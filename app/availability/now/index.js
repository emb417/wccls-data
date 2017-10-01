const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('./config.json');
const scraper = require('../scraper');
const parser = require('../parser');
const format = require('../format.js');
const branchIdMap = require('../../utils.js').branchIdMap;

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {

  logger.info( `${ config.app } setting context based on ${ req.originalUrl }` );
  const context = {
    ...config,
    branchIdMap,
    branchIds: [ req.params.branchId ],
    getIds: parser.getIds,
    getAvailability: parser.getNowAvailability,
    keywords: [ req.params.keywords ]
  };

  logger.debug( `building promise array...` );
  let promises = [];
  context.keywords.forEach( keyword => {
    logger.trace( `promise for: ${ keyword }` );
    promises.push( scraper.get( keyword, context ) );
  });

  logger.debug( `promise all...` );
  Promise.all( promises.map( p => p.catch( () => undefined ) ) )
  .then( results => {

    logger.trace( `promise all results: ${ JSON.stringify(results) }` );
    logger.debug( `formatting and sending text messsage...` );
    res.send( format.nowTextMessage( results, context.availabilityCode ) || "{}" );
  })
  .catch( error => { res.send( error ) } );
});

module.exports = app;
