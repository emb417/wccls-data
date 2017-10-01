const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('../config.json');
const scraper = require('./scraper.js');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );

  const context = {
    barcodeOrUsername: req.params.user,
    logonUrl: config.logonUrl,
    password: req.params.pwd,
    rememberMe: false,
    url: config.createHoldUrl
  };

  logger.debug( `getting results for msg...` );
  scraper.scrape( context ).then( results => {
    // format for sms response
    const delim = "--";
    let formattedData = "";
    if ( results.length > 0 ) {

      logger.debug( `formatting results for msg...` );
      results.forEach( item => {
        formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
        formattedData += `${ item.position }${ delim }${ item.id }${ delim }${ item.title }`;
      });
    }
    const messageText = formattedData !== "" ? formattedData : "No Results...";

    logger.debug( `sending response...` );
    res.send( messageText );
  })
  .catch( error => { res.send( error ) } );

});

module.exports = app;
