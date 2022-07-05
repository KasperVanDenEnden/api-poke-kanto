const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;

module.exports = { 
    


}  

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      } catch (error) {
        console.error('Unable to fetch data:', error);
      }
  }

function fetchNames(nameType) {
    return fetchData(`https://www.randomlists.com/data/names-${nameType}.json`);
  }

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

async function generateName(gender) {
    try {
      // Fetch both name lists in parallel
      const response = await Promise.all([
        fetchNames(gender)
      ]);
  
      // Promise.all returns an array of responses
      // to our two requests, so select them
      const [firstNames, lastNames] = response;
  
      // Pick a random name from each list
      const firstName = pickRandom(firstNames.data);
       
      // Use a template literal to format the full name
      return `${firstName}`;
    } catch(error) {
      console.error('Unable to generate name:', error);
    }
  }