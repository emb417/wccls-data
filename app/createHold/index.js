const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');

const config = require('./config.json');
const scraper = require('./scraper.js');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );
  const branchId = /^\d+$/.test(req.params.branchId) ? req.params.branchId : config.branchIdMap[req.params.branchId.toLowerCase()];
  const context = {
    ...config,
    branchId,
    itemId: req.params.item,
    logonCreds: {
      barcodeOrUsername: req.params.user,
      password: req.params.pwd,
      rememberMe: false
    }
  };

  logger.debug( `getting results for message...` );
  scraper.get( context ).then( results => {

    logger.debug( `sending response...` );
    res.send( results );
  })
  .catch( error => { res.send( error ) } );

});

module.exports = app;
