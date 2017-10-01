const log4js = require('log4js');
const logger = log4js.getLogger();

const childProcess = require('child_process');
const path = require('path');

const express = require('express');
const config = require('./config.json');
const scraper = require('../scraper');
const parser = require('../parser');
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

    const timestamp = Date.now();
    const promiseData = {
      "timestamp": timestamp,
      "items": results
    };

    const delim = "----";
    let formattedData = "";
    if ( promiseData.items.length > 0 ) {

      logger.debug( `formatting results for message...` );
      promiseData.items.forEach( branchTitles => {
        logger.trace( `branchTitles: ${ JSON.stringify(branchTitles) }` );
        branchTitles.forEach( branchTitle => {
          logger.trace( `branchTitle: ${ JSON.stringify(branchTitle) }` );
          if ( branchTitle.items.includes( `In -- ${ context.availabilityCode }` ) ){
            formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
            formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.title }`;
          };
        });
      });
    }

    if( formattedData !== "" ){
      logger.debug( `sending message...` );
      childProcess.exec( `${ messagesScript } ${ context.msgTo } "${ formattedData }"` );
    }

    logger.debug(`sending response...`);
    res.send( ( formattedData !== "" ) ? formattedData : "{}" );
  })
  .catch( error => { res.send( error ) } );
});

module.exports = app;
