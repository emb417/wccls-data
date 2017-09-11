const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const scraper = require('../scraper');
const config = require('./config.json');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  
  logger.info( `${ config.app } setting context based on ${ req.originalUrl }` );
  const context = { 
    availabilityCode: ( typeof req.query.ac != "undefined" ) ? [ req.query.ac ] : config.availabilityCode,
    baseUrl: config.baseUrl,
    branchIds: ( typeof req.params.branchId != "undefined" ) ? [ req.params.branchId ] : config.branchIds,
    branchIdMap: config.branchIdMap,
    keywords: [ req.params.keywords ],
    resultsSizeLimit: ( typeof req.query.size != "undefined" ) ? req.query.size : config.resultsSizeLimit,
    sortBy: ( typeof req.query.sort != "undefined" ) ? req.query.sort : config.sortBy
  };
  
  logger.debug( `building promise array...` );
  let promises = [];
  context.keywords.forEach( keyword => {
    promises.push( scraper.scrape( keyword, context ) );
  });
  
  logger.debug( `promise all...` );
  Promise.all( promises.map( p => p.catch( () => undefined ) ) )
  .then( results => {
    
    const timestamp = Date.now();
    const promiseData = {
      "timestamp": timestamp,
      "items": results  
    };

    const delim = "----";
    let formattedData = "";
    if ( promiseData.items.length > 0 ) {
      logger.debug( `formatting results for msg...` );      
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          if ( branchTitle.items.includes( context.availabilityCode ) ) {
            formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
            formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.title }${ delim }${ branchTitle.items }`;
          }
        });
      });
    }

    const messageText = formattedData !== "" ? formattedData : "{}";
    logger.debug( `sending response...` );
    res.send( messageText );

  })
  .catch( error => { res.send( error ) } );
});

module.exports = app;
