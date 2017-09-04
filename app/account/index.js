const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';

const express = require('express');
const config = require('./config.json');
const scraper = require('./scraper.js');

const app = express.Router({ mergeParams : true });

app.use((req, res) => {
  logger.info(`...starting ${ config.app } initial context...`);
  const context = { 
    routePath: req.route.path,
    logonUrl: config.logonUrl,
    itemsOutUrls: config.itemsOutUrls,
    holdsUrls: config.holdsUrls,
    barcodeOrUsername: req.params.user,
    password: req.params.pwd,
    rememberMe: false
  };

  logger.info(`getting results for msg...`);
  scraper.scrape( context ).then( results => {
    // format for sms response
    const delim = "--";
    let formattedData = "";
    if ( results.length > 0 ) {
      
      logger.info(`formatting results for msg...`);      
      results.forEach( item => {
        formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
        formattedData += (context.routePath === "/due/:user/:pwd") ? 
                        `${ item.dueDate }${ delim }${ item.id }${ delim }${ item.title }${ delim }${ item.renewal }` :
                        `${ item.position }${ delim }${ item.id }${ delim }${ item.title }`;
      });
    }
    const messageText = formattedData !== "" ? formattedData : "No Results...";
    
    logger.info(`sending response...`);
    res.send( messageText );
  });

});

module.exports = app;