const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('./scraper');
const config = require('./config.json');

const onshelf = Express.Router({ mergeParams : true });

const itemsDB = path.join(__dirname, '../..', 'data/items.db');
const messagesScript = path.join(__dirname, '../..', 'automation/imessage.sh');

onshelf.use((req, res) => {
  console.log(`${ Date.now()} ...setting ONSHELF initial context...`);
  const context = { 
    availabilityCode: config.availabilityCode,
    resultsSizeLimit: config.resultsSizeLimit,
    keywords: [ req.params.keywords ] || config.keywords
  };
  console.log(`${ Date.now()} building promise array...`);
  let promises = [];
  context.keywords.forEach( keyword => {
    console.log(`${ Date.now()} for keyword: ${ keyword }`);
    promises.push(scraper.scrape(keyword, context));
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
        const onshelfData = { "onshelf": [ promiseData ] };
        fs.writeFile(itemsDB, JSON.stringify(onshelfData), (err) => {
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
          if (typeof newData.onshelf != "undefined") {
            newData.onshelf.push(promiseData);
            // write over items.db with newly merged data
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log(`${ Date.now()} items.db updated...`);
                return;
            });            
          } else {
            console.log(`${ Date.now()} first onshelf add, appending new data...`);
            newData.onshelf = [ promiseData ];
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log(`${ Date.now()} items.db updated...`);
                return;
            });
          }
        });
      };
    });
    let formattedData = promiseData;
    console.log(`${ Date.now()} formatting results for msg...`);
    formattedData = "";
    promiseData.items.forEach( branchTitles => {
      branchTitles.forEach( branchTitle => {
        if(branchTitle.items.includes(config.availabilityCode)){
          formattedData += formattedData === "" ? "" : "\n";
          formattedData += `${
            branchTitle.branch.replace('Beaverton City Library', '---BCL-')
              .replace('Beaverton Murray Scholls Library', '---BMS-')
              .replace('Cedar Mill Bethany Branch', '---CMBB')
              .replace('Cedar Mill Community Library', '---CMCL')
              .replace('Hillsboro Brookwood Library', '---HB--')
              .replace('Hillsboro Shute Park Library', '---HSP-')
          }----${ 
            branchTitle.title.replace(/\[videorecording\s+\(/, '')
              .replace(/\[sound\srecording\s+\(/,'')
              .replace(/\)\]/,'')
           }`;
        }
      });
    });
    if(formattedData!==""){
      console.log(`${ Date.now()} executing message...`);
      childProcess.exec(`${ messagesScript } ${ config.msgTo } "${ formattedData }"`);
      console.log(`${ Date.now()} sending response...`);
      res.send(formattedData);
    } else {
      console.log(`${ Date.now()} no results...`);
      res.send("No Results."); 
    }
  });
});

module.exports = onshelf;
