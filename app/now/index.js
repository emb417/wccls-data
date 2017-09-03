const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('../scraper');
const config = require('./config.json');

const app = Express.Router({ mergeParams : true });

const itemsDB = path.join(__dirname, '../..', 'data/items.db');

app.use((req, res) => {
  console.log(`${ Date.now()} ...setting ${ config.app } initial context...`);
  const context = { 
    availabilityCode: (typeof req.query.ac != "undefined") ? [ req.query.ac ] : config.availabilityCode,
    baseUrl: config.baseUrl,
    branchIds: (typeof req.params.branchId != "undefined" ) ? [ req.params.branchId ] : config.branchIds,
    keywords: (typeof req.params.keywords != "undefined") ? [ req.params.keywords ] : config.keywords,
    resultsSizeLimit: (typeof req.query.size != "undefined" && req.query.size < 301) ? req.query.size : config.resultsSizeLimit,
    sortBy: (typeof req.query.sort != "undefined") ? req.query.sort : config.sortBy
  };
  console.log(`${ Date.now()} building promise array...`);
  let promises = [];
  context.keywords.forEach( keyword => {
    promises.push(scraper.scrape( keyword, context ));
  });
  console.log(`${ Date.now()} promise all...`);
  Promise.all(promises.map(p => p.catch(() => undefined)))
  .then( results => {
    const timestamp = Date.now();
    console.log(`${ timestamp } adding timestamps...`);
    const promiseData = {
      "timestamp": timestamp,
      "items": results  
    };
    
    console.log(`${ Date.now()} checking items.db...`);
    fs.access(itemsDB, fs.constants.F_OK, (err) => {
      // if db doesn't exist, create it
      if(err){
        console.log(`${ Date.now()} items.db does not exist, writing a new one...`);
        fs.writeFile(itemsDB, JSON.stringify([ promiseData ]), (err) => {
            if (err) { throw err; }
            console.log(`${ Date.now()} items.db initialized...`);
            return;
        });
      } else {
        console.log(`${ Date.now()} items.db does exists, appending new data...`);
        fs.readFile(itemsDB, 'utf8', (err, fileData) => {
          if (err) { throw err; }
          // read and write same, soon merge...
          const fileJSON = JSON.parse(fileData);
          fileJSON.push(promiseData);
          // write over items.db with newly merged data
          fs.writeFile(itemsDB, JSON.stringify(fileJSON), (err) => {
              if (err) { throw err; }
              console.log(`${ Date.now()} items.db updated...`);
              return;
          });
        });
      };
    });
    
    const delim = "----";
    let formattedData = "";
    if ( promiseData.items.length > 0 ) {
      console.log(`${ Date.now()} formatting results for msg...`);      
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          if(branchTitle.items.includes(context.availabilityCode)){
            formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
            formattedData += `${
              branchTitle.branch.replace('Beaverton City Library', 'BCC')
                .replace('Beaverton Murray Scholls', 'BMS')
                .replace('Cedar Mill Bethany Branch Library', 'CMB')
                .replace('Cedar Mill Community Library', 'CMC')
                .replace('Hillsboro Brookwood Library', 'HBW')
                .replace('Hillsboro Shute Park Library', 'HSP')
                .replace('Tigard Public Library', 'TIG')
                .replace('Tualatin Public Library', 'TUA')                
              }${ delim }${ 
              branchTitle.title.replace(/\[videorecording\s+\(/, '')
                .replace(/\[sound\srecording\s+\(/,'')
                .replace(/\[electronic\sresource\s+\(/,'')
                .replace(/\)\]/,'')
              }${ delim }${
              branchTitle.items
            }`;
          }
        });
      });      
    }

    const messageText = formattedData !== "" ? formattedData : "No Results...";
    console.log(`${ Date.now()} sending response...`);
    res.send( messageText );

  });
});

module.exports = app;
