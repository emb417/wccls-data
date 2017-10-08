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
`The Dude abides:

  1\) "where is keywords" to search for top 5 most relevant results and see availability

  2\) "news" to manually invoke the check of not holdable list status \(only returns in items\)

  3\) "list" to get not holdable list

  4\) "add keywords" to add to not holdable list

  5\) "remove keywords" to remove from not holdable list

  6\) "due barcode pin" to get due dates for items checked out

  7\) "holds barcode pin" to get hold position for items requested

  8\) "now branch keywords" to search for available titles at a branch out of the 500 most popular results

  9\) "branches" to see abbreviation and (id) per branch

  10\) "hours branch" to see hours per branch

  11\) "hours" to see hours for home branch in config

  12\) "help" to see this again`
  );

});

module.exports = app;
