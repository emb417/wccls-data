const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('./scraper');
const unholdConfig = require('../config/unhold.json');

const unhold = Express();

unhold.use((req, res) => {
  const context = { 
    availabilityCode: unholdConfig.availabilityCode,
    resultsSizeLimit: unholdConfig.resultsSizeLimit,
    type: unholdConfig.type
  };
  
  let promises = [];
  unholdConfig.keywords.forEach( keyword => {
    promises.push(scraper.scrape(keyword, context));
  });
  // console.log(promises);
  Promise.all(promises.map(p => p.catch(() => undefined)))
  .then( results => {
    const timestamp = Date.now();
    // console.log(timestamp, results);
    
    const obj = {
      "unholdables": {
        "timestamp": timestamp,
         results  
      }
    };
    res.send(obj);
  });
});

module.exports = unhold;