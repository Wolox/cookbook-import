const fetch = require('node-fetch');
const fs = require('fs').promises;

const URL = 'https://api.github.com/repos/Wolox/frontend-cookbook/contents/cookbook-react/src/recipes/inputs/barcelona';

fetch(URL).then((res) => res.json()).then(async fileData => {
  const response = await fetch(fileData[2].download_url, { 
    headers: { 'Content-Type': 'application/text' }
  });
  const fileContent = await response.text();

  console.log(fileData[2].name, fileContent)
  await fs.writeFile(fileData[2].name, fileContent);
});

