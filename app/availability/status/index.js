const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('./config.json');
const scraper = require('../scraper');
const parser = require('../parser');
const branchIdMap = require('../../utils.js').branchIdMap;

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {

  logger.info( `${ config.app } setting context based on ${ req.originalUrl }` );
  const context = {
    ...config,
    branchIdMap,
    getIds: parser.getIds,
    getAvailability: parser.getStatusAvailability,
    keywords: [ req.params.keywords ]
  };

  logger.debug( `building promise array...` );
  let promises = [];
  context.keywords.forEach( keyword => {
    promises.push( scraper.get( keyword, context ) );
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
      logger.debug(`formatting results for message...`);
      promiseData.items.forEach( branchTitles => {
        branchTitles.forEach( branchTitle => {
          formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
          formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.itemId }${ delim }${ branchTitle.title }${ delim }${ branchTitle.items }`;
        });
      });
    }

    const messageText = formattedData !== "" ? formattedData : "No Results...";
    logger.debug( `sending response...` );
    res.send( messageText );

  })
  .catch( error => { res.send( error ) } );
});

module.exports = app;
