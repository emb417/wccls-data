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

  1a\) "where is keywords" to search for top 5 most relevant results and see availability
  1b\) "request hold for itemId branch branchId" to get place hold for an item

  2\) "now branch keywords" to search for available titles at a branch out of the 500 most popular results

  3a\) "list" to get not holdable list
  3b\) "add keywords" to add to not holdable list
  3c\) "remove keywords" to remove from not holdable list

  4a\) "what's requested" to get hold position for items requested
  4b\) "cancel hold for holdItemId" to cancel hold for an item

  5a\) "hours branch" to see hours per branch
  5b\) "hours" to see hours for home branch in config

  6a\) "what's due" to get due dates for items checked out
  6b\) "renew dueItemId" to get due dates for items checked out

  7\) "news" to manually invoke the check of not holdable list status \(only returns in items\)

  8\) "branches" to see abbreviation and (id) per branch

  9\) "help" to see this again`
  );

});

module.exports = app;
