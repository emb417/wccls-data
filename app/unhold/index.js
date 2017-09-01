const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('../scraper');
const config = require('./config.json');

const app = Express.Router({ mergeParams : true });

const itemsDB = path.join(__dirname, '../..', 'data/items.db');
const messagesScript = path.join(__dirname, '../..', 'automation/imessage.sh');

app.use((req, res) => {
  console.log(`${ Date.now()} ...setting ${ config.app } initial context...`);
  const context = { 
    availabilityCode: (typeof req.query.ac != "undefined") ? [ req.query.ac ] : config.availabilityCode,
    baseUrl: config.baseUrl,
    branchIds: (typeof req.query.branch != "undefined" ) ? [ req.query.branch ] : config.branchIds,
    keywords: (typeof req.params.keywords != "undefined") ? [ req.params.keywords ] : config.keywords,
    msgTo: (typeof req.query.m != "undefined" ) ? [ req.query.m ] : config.msgTo,
    resultsSizeLimit: (typeof req.query.rsl != "undefined" && parseInt(req.query.rsl) < 301) ? [ req.query.rsl ] : config.resultsSizeLimit,
    sortBy: (typeof req.query.sort != "undefined") ? [ req.query.sort ] : config.sortBy
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
        const unholdableData = { "unholdables": [ promiseData ] };
        fs.writeFile(itemsDB, JSON.stringify(unholdableData), (err) => {
            if (err) { throw err; }
            console.log(`${ Date.now()} items.db initialized...`);
            return;
        });
      } else {
        console.log(`${ Date.now()} items.db does exists, appending new data...`);
        fs.readFile(itemsDB, 'utf8', (err, fileData) => {
          if (err) { throw err; }
          // read and write same, soon merge...
          const newData = JSON.parse(fileData);
          if (typeof newData.unholdables != "undefined") {
            newData.unholdables.push(promiseData);
            // write over items.db with newly merged data
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log(`${ Date.now()} items.db updated...`);
                return;
            });            
          } else {
            console.log(`${ Date.now()} first onshelf add, appending new data...`);
            newData.unholdables = [ promiseData ];
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log(`${ Date.now()} items.db updated...`);
                return;
            });
          }
        });
      };
    });
    const delim = "----";
    let formattedData = "";
    if ( promiseData.items.length > 0 ) {
      console.log(`${ Date.now()} formatting results for msg...`);      
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          if(branchTitle.items.includes(`In -- ${ context.availabilityCode }`)){
            formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
            formattedData += `${
              branchTitle.branch.replace('Beaverton City Library', 'BCC')
                .replace('Beaverton Murray Scholls', 'BMS')
                .replace('Cedar Mill Bethany Branch Library', 'CMB')
                .replace('Cedar Mill Community Library', 'CMC')
                .replace('Hillsboro Brookwood Library', 'HBW')
                .replace('Hillsboro Shute Park Library', 'HSP')
            }${ delim }${ 
              branchTitle.title.replace(/\[videorecording\s+\(/, '')
                .replace(/\[sound\srecording\s+\(/,'')
                .replace(/\[electronic\sresource\s+\(/,'')
                .replace(/\)\]/,'')
            }`;
          };
        });
      });      
    }
    
    if(formattedData!==""){
      console.log(`${ Date.now()} executing message...`);
      childProcess.exec(`${ messagesScript } ${ context.msgTo } "${ formattedData }"`);
    }
    console.log(`${ Date.now()} sending response...`);
    res.send(( formattedData !== "" ) ? formattedData : "No Results...");
  });
});

module.exports = app;
