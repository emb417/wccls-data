const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('./config.json');
const scraper = require('./scraper.js');
const parser = require('./parser.js');
const format = require('./format.js');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );
  const branchId = ( typeof req.params.branchId != "undefined" ) ? req.params.branchId : config.homeBranchId;
  const context = {
    ...config,
    branchId: ( /^\d+$/.test(branchId) ) ? branchId : config.branchIdMap[branchId],
    parser: parser.hours
  };

  logger.debug( `getting results for message...` );
  scraper.get( context ).then( results => {

    logger.debug( `formatting results for text messsage...` );
    const messageText = results.length > 0 ? format.textMessage( results ) : "No Results...";

    logger.debug( `sending response...` );
    res.send( messageText );
  })
  .catch( error => { res.send( error ) } );

});

module.exports = app;
