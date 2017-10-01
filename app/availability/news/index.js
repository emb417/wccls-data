const log4js = require('log4js');
const logger = log4js.getLogger();

const childProcess = require('child_process');
const path = require('path');

const express = require('express');
const config = require('./config.json');
const scraper = require('../scraper');
const parser = require('../parser');
const format = require('../format.js');
const branchIdMap = require('../../utils.js').branchIdMap;

const messagesScript = path.join( __dirname, '../../..', 'automation/imessage.sh' );

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {

  logger.info( `${ config.app } setting context based on ${ req.originalUrl }` );
  const context = {
    ...config,
    branchIdMap,
    getIds: parser.getIds,
    getAvailability: parser.getNowAvailability,
  };

  logger.debug( `building promise array...` );
  let promises = [];
  context.keywords.forEach( keyword => {
    promises.push( scraper.get( keyword, context ) );
  });

  logger.debug( `promise all...` );
  Promise.all( promises.map( p => p.catch( () => undefined ) ) )
  .then( results => {

    logger.trace( `promise all results: ${ JSON.stringify(results) }` );
    logger.debug( `formatting results for text messsage...` );
    const messageText = format.newsTextMessage( results, context.availabilityCode );

    if( messageText ){
      logger.debug( `sending text message...` );
      childProcess.exec( `${ messagesScript } ${ context.msgTo } "${ messageText }"` );
    }

    logger.debug(`sending response...`);
    res.send( messageText || "{}" );
  })
  .catch( error => { res.send( error ) } );
});

module.exports = app;
