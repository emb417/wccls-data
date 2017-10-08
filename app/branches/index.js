const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const config = require('./config.json');

const app = express.Router( { mergeParams : true } );

app.use( ( req, res ) => {
  logger.info( `${ config.app } initial context based on ${ req.originalUrl }` );
  const context = {
    ...config
  };

  logger.debug( `sending response...` );
  res.send(
`BCC: Beaverton City Center (9)
BMS: Beaverton Murray Scholls (39)
CMB: Cedar Mills Bethany (34)
CMC: Cedar Mills Community (11)
HBW: Hillsboro Brookwood (20)
HSB: Hillsboro Shute Park (19)
TIG: Tigard (29)
TUA: Tualatin (31)`
  );

});

module.exports = app;
