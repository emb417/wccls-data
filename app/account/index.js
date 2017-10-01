const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('./config.json');
const scraper = require('./scraper.js');
const format = require('./format.js');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );
  const urlsMap = {
    "/due/:user/:pwd": config.itemsOutUrls,
    "/holds/:user/:pwd": config.holdsUrls
  }
  const context = {
    barcodeOrUsername: req.params.user,
    logonUrl: config.logonUrl,
    password: req.params.pwd,
    rememberMe: false,
    urls: urlsMap[req.route.path],
    routePath: req.route.path
  };

  logger.debug( `getting results for msg...` );
  scraper.scrape( context ).then( results => {

    const messageText = results.length > 0 ? format.textMessage(results) : "No Results...";

    logger.debug( `sending response...` );
    res.send( messageText );
  })
  .catch( error => { res.send( error ) } );

});

module.exports = app;
