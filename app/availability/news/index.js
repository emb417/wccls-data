const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const childProcess = require('child_process');
const path = require('path');      

const scraper = require('../scraper');
const config = require('./config.json');

const messagesScript = path.join(__dirname, '../../..', 'automation/imessage.sh');  

const app = express.Router({ mergeParams : true });

app.use((req, res) => {
  
  logger.info(`${ config.app } setting context based on ${ req.originalUrl }`);
  const context = { 
    availabilityCode: (typeof req.query.ac != "undefined") ? [ req.query.ac ] : config.availabilityCode,
    baseUrl: config.baseUrl,
    branchIds: (typeof req.query.branch != "undefined" ) ? [ req.query.branch ] : config.branchIds,
    keywords: (typeof req.params.keywords != "undefined") ? [ req.params.keywords ] : config.keywords,
    msgTo: (typeof req.query.m != "undefined" ) ? [ req.query.m ] : config.msgTo,
    resultsSizeLimit: (typeof req.query.size != "undefined" && req.query.size < 301) ? [ req.query.size ] : config.resultsSizeLimit,
    sortBy: (typeof req.query.sort != "undefined") ? req.query.sort : config.sortBy
  };
  
  logger.debug(`building promise array...`);
  let promises = [];
  context.keywords.forEach( keyword => {
    promises.push(scraper.scrape( keyword, context ));
  });
  
  logger.debug(`promise all...`);
  Promise.all(promises.map(p => p.catch(() => undefined)))
  .then( results => {
    
    const timestamp = Date.now();
    const promiseData = {
      "timestamp": timestamp,
      "items": results  
    };

    const delim = "----";
    let formattedData = "";
    if ( promiseData.items.length > 0 ) {
      
      logger.debug(`formatting results for msg...`);      
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          if(branchTitle.items.includes(`In -- ${ context.availabilityCode }`)){
            formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
            formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.title }`; 
          };
        });
      });      
    }
    
    if( formattedData !== "" ){
      logger.debug(`sending message...`);
      childProcess.exec(`${ messagesScript } ${ context.msgTo } "No News...${ formattedData }"`);
    }
    
    logger.debug(`sending response...`);
    res.send(( formattedData !== "" ) ? formattedData : "No News...");
  });
});

module.exports = app;
