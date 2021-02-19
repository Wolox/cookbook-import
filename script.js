#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs').promises;
const chalk = require('chalk');
const { 
  validateCategory,
  validateRecipe,
  validateTech,
  TECH_RECIPE_FOLDERS,
  DATA_TYPES,
  BASE_URL
} = require('./utils');

const argv = require('minimist')(process.argv.slice(2));

const outputFolder = argv.output || argv.o || 'src';

// TODO: validate existance of parameters
const tech = argv.tech || argv.t;
const recipeCategory = argv.category || argv.c;
const recipeName = argv.name || argv.n;

const dirUrl = `${TECH_RECIPE_FOLDERS[tech]}/recipes/${recipeCategory}/${recipeName}`;

const requiredParamMsg = (param) => `Parameter '${param}' is required`;

const importFile = async (path, recipeData) => {
  const response = await fetch(recipeData.download_url, { 
    headers: { 'Content-Type': 'application/text' }
  });
  const fileContent = await response.text();

  return fs.writeFile(`${path}/${recipeData.name}`, fileContent);
}

const importDirectory = async (dirPath, recipeData) => {
  const filePath = `${dirPath}/${recipeData.name}`;
  await fs.mkdir(filePath, { recursive: true });
  return getDir(`${BASE_URL}/${recipeData.path}`, filePath);
}

validateCategory(recipeCategory);
validateRecipe(recipeName);
validateTech(tech);

const getDir = (url, dir) => {
  return fetch(url).then(async (res) => {
    if (res.status === 404) {
      console.error(chalk.red(`A recipe with name '${recipeName}' and category '${recipeCategory}' could not be found in cookbook-${tech}`));
      process.exit(1);
    } else if (res.status < 200 || res.status > 299) {
      // Generic error, the condition is probably improvable
      console.error(chalk.red(`The following error has occured requesting ${url}:`));
      console.error(chalk.red(await res.json()));
      process.exit(1);
    }
    return res.json();
  }).then(async fileData => {
    for (const data of fileData) {
      if (data.type === DATA_TYPES.file) {
        await importFile(dir, data);
      } else if (data.type === DATA_TYPES.directory) {
        await importDirectory(dir, data);
      }
    }
  })
}

console.log(chalk.green('Importing recipe...'));
getDir(`${BASE_URL}/${dirUrl}`, outputFolder).then(err => {
  console.log(chalk.green(`Recipe successfully imported into ${outputFolder}`))
});


