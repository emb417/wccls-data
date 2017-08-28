const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('./scraper');
const globalConfig = require('../config/global.json');
const unholdConfig = require('../config/unhold.json');

const unhold = Express();

unhold.use((req, res) => {
  console.log("...setting initial context...");
  const context = { 
    availabilityCode: unholdConfig.availabilityCode,
    resultsSizeLimit: unholdConfig.resultsSizeLimit
  };
  console.log("building promise array...");
  let promises = [];
  unholdConfig.keywords.forEach( keyword => {
    promises.push(scraper.scrape(keyword, context));
  });
  console.log("promise all...");
  Promise.all(promises.map(p => p.catch(() => undefined)))
  .then( results => {
    const timestamp = Date.now();
    // console.log(timestamp, results);
    console.log("adding timestamps...");
    const promiseData = {
      "timestamp": timestamp,
      "items": results  
    };
    console.log("checking items.db...");
    fs.access('./data/items.db', fs.constants.F_OK, (err) => {
      // if db doesn't exist, create it
      if(err){
        console.log("items.db does not exist, writing a new one...");
        const unholdableData = { "unholdables": [ promiseData ] };
        fs.writeFile('./data/items.db', JSON.stringify(unholdableData), (err) => {
            if (err) { throw err; }
            console.log("items.db initialized...");
            return;
        });
      } else {
        console.log("items.db does exists, appending new data...");
        fs.readFile('./data/items.db', 'utf8', (err, fileData) => {
          if (err) { throw err; }
          // read and write same, soon merge...
          let unholdables = JSON.parse(fileData).unholdables;
          unholdables.push(promiseData);
          const mergedData = { unholdables };
          // write over items.db with newly merged data
          fs.writeFile('./data/items.db', JSON.stringify(mergedData), (err) => {
              if (err) { throw err; }
              console.log("items.db updated...");
              return;
          });
        });
      };
    });
    let formattedData = promiseData;
    if(unholdConfig.type === "msg"){
      console.log("formatting results for msg...");
      formattedData = "";
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          if(branchTitle.items.includes(`In -- ${ unholdConfig.availabilityCode }`)){
            formattedData += `${ branchTitle.title.replace(/\s/g, '.') }::${ branchTitle.branch.replace(/\s/g, '.') }|`;
          }
        });
      });
      if(formattedData!==""){
        console.log("updating messages.txt file...");
        const messageText = `${ globalConfig.msgTo } ${ formattedData }`;
        fs.access('./notify/message.txt', fs.constants.F_OK, (err) => {
          if(err){
            fs.writeFile('./notify/message.txt', messageText, (err) => {
                if (err) { throw err; }
                return;
            });
          }
          fs.writeFile('./notify/message.txt', messageText, (err) => {
              if (err) { throw err; }
              return;
          });          
          return;
        });
      }
    }
    res.send(formattedData);
  });
});

module.exports = unhold;