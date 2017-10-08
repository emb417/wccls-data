const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');

const config = require('./config.json');
const scraper = require('./scraper.js');
const parser = require('./parser.js');
const branchIdMap = require('../utils.js').branchIdMap;

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );
  const context = {
    ...config,
    holdId: req.params.item,
    logonCreds: {
      barcodeOrUsername: req.params.user,
      password: req.params.pwd,
      rememberMe: false
    },
    parser
  };

  logger.debug( `getting results for message...` );
  scraper.get( context ).then( results => {

    logger.debug( `sending response...` );
    res.send( results );
  })
  .catch( error => { res.send( error ) } );

});

module.exports = app;
