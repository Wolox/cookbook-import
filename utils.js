const chalk = require('chalk');

const BASE_URL = 'https://api.github.com/repos/Wolox/frontend-cookbook/contents';
const DATA_TYPES = {
  file: 'file',
  directory: 'dir'
}
const TECH_RECIPE_FOLDERS = {
  react: 'cookbook-react/src',
  java: 'cookbook-java',
  node: 'cookbook-node',
  rails: 'cookbook-rails',
  'react-native': 'cookbook-react-native',
  'web': 'cookbook-web'
}

const requiredParamMsg = (param) => `Parameter '${param}' is required`;

const validateTech = tech => {
  if (!tech) {
    console.error(chalk.red(requiredParamMsg('tech')));
    console.error(chalk.red(`Required parameters are: tech, category, name`));
    process.exit(1);
  }

  const techs = Object.keys(TECH_RECIPE_FOLDERS);
  if (!techs.includes(tech)) {
    console.error(chalk.red(`${tech} is not a valid tech`));
    console.error(chalk.blue(`Valid techs are ${techs.join(', ')}`));
    process.exit(1);
  }
}

const validateCategory = category => {
  if (!category) {
    console.error(chalk.red(requiredParamMsg('category')));
    console.error(chalk.blue(`To find valid categories, visit https://cookbook.wolox-fearmy.now.sh/ and check the sidebar list. Make sure the category exists for this tech`));
    process.exit(1);
  }
}

const validateRecipe = name => {
  if (!name) {
    console.error(chalk.red(requiredParamMsg('name')));
    console.error(chalk.blue(`To find valid recipes, visit https://cookbook.wolox-fearmy.now.sh/ and go to a recipe category. The accepted recipe names are the same that appear in the web`));
    process.exit(1);
  }
}

module.exports = {
  BASE_URL,
  DATA_TYPES,
  TECH_RECIPE_FOLDERS,
  validateTech,
  validateRecipe,
  validateCategory
};
