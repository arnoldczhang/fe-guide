/**
 * dataforge
 * 
 * The JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.
 * 
 */
const dataForge = require('data-forge');

dataForge.readFile('./src/dataforge/test.json')
  .parseJSON()
  .then((res) => {
    console.log(res);
  });
