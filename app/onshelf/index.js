const fs = require('fs');
const path = require('path');
const Express = require('express');
const scraper = require('./scraper');
const config = require('./config.json');

const onshelf = Express.Router({ mergeParams : true });

const itemsDB = path.join(__dirname, '../..', 'data/items.db');
const messagesFile = path.join(__dirname, '../..', 'notify/message.txt');

onshelf.use((req, res) => {
  console.log("...setting ONSHELF initial context...");
  const context = { 
    availabilityCode: config.availabilityCode,
    resultsSizeLimit: config.resultsSizeLimit,
    keywords: [ req.params.keywords ] || config.keywords
  };
  console.log("building promise array...");
  let promises = [];
  context.keywords.forEach( keyword => {
    console.log("for keyword:",keyword);
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
    fs.access(itemsDB, fs.constants.F_OK, (err) => {
      // if db doesn't exist, create it
      if(err){
        console.log("items.db does not exist, writing a new one...");
        const onshelfData = { "onshelf": [ promiseData ] };
        fs.writeFile(itemsDB, JSON.stringify(onshelfData), (err) => {
            if (err) { throw err; }
            console.log("items.db initialized...");
            return;
        });
      } else {
        console.log("items.db does exists, appending new data...");
        fs.readFile(itemsDB, 'utf8', (err, fileData) => {
          if (err) { throw err; }
          // read and write same, soon merge...
          const newData = JSON.parse(fileData);
          if (typeof newData.onshelf != "undefined") {
            newData.onshelf.push(promiseData);
            // write over items.db with newly merged data
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log("items.db updated...");
                return;
            });            
          } else {
            console.log("first onshelf add, appending new data...");
            newData.onshelf = [ promiseData ];
            fs.writeFile(itemsDB, JSON.stringify(newData), (err) => {
                if (err) { throw err; }
                console.log("items.db updated...");
                return;
            });
          }
        });
      };
    });
    let formattedData = promiseData;
    console.log("formatting results for msg...");
    formattedData = "";
    promiseData.items.forEach( branchTitles => {
      branchTitles.forEach( branchTitle => {
        if(branchTitle.items.includes(config.availabilityCode)){
          formattedData += formattedData === "" ? "" : "|-o-|";
          formattedData += `${ branchTitle.title.replace(/\s/g, '.') }::${ branchTitle.branch.replace(/\s/g, '.') }`;
        }
      });
    });
    if(formattedData!==""){
      console.log("updating messages.txt file...");
      const messageText = `${ config.msgTo } ${ formattedData }`;
      fs.access(messagesFile, fs.constants.F_OK, (err) => {
        if(err){
          fs.writeFile(messagesFile, messageText, (err) => {
              if (err) { throw err; }
              return;
          });
        }
        fs.writeFile(messagesFile, messageText, (err) => {
            if (err) { throw err; }
            return;
        });          
        return;
      });
    }
    res.send(formattedData);
  });
});

module.exports = onshelf;
