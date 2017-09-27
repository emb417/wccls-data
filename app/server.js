const log4js = require('log4js');
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/server.log' }
  },
  categories: {
    default: { appenders: ['file','console'], level: 'debug' }
  }
});
const logger = log4js.getLogger();

const fs = require('fs');
const path = require('path');
const express = require('express');

// app modules
const account = require('./account');
const admin = require('./admin');
const news = require('./availability/news');
const now = require('./availability/now');
const status = require('./availability/status');

// data directory
const logDirectory = path.join(__dirname, '..', 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// instantiate express app
const app = express();

// express middleware
app.use(log4js.connectLogger(logger, { level: 'info' }));

// express routes
app.get('/add/:keywords', admin);
app.get('/branches', ( req, res ) => {
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
app.get('/due/:user/:pwd', account);
app.get('/find/:keywords', status);
app.get('/help', ( req, res ) => {
  res.send(
`The Dude is here to help.  The Dude abides:

  1\) "find keywords" to search for top 5 most relevant results and see availability

  2\) "news" to manually invoke the check of not holdable list status \(only returns in items\)

  3\) "list" to get not holdable list

  4\) "add keywords" to add to not holdable list

  5\) "remove keywords" to remove from not holdable list

  6\) "due barcode pin" to get due dates for items checked out

  7\) "holds barcode pin" to get hold position for items requested

  8\) "now branch keywords" to search for available titles at a branch out of the 500 most popular results

  9\) "branches" to see abbreviation and (id) per branch

  10\) "help" to see this again`
  );
});
app.get('/holds/:user/:pwd', account);
app.get('/holds/:user/:pwd/add/:item', account);
app.get('/holds/:user/:pwd/cancel/:item', account);
app.get('/list', admin);
app.get('/news', news);
app.get('/now/:branchId/:keywords', now);
app.get('/remove/:keywords', admin);
app.get('/status/:keywords', status);
app.get('*', ( req, res ) => { res.send( `The Dude does not abide!` ); });

app.listen(1337, logger.info('server started'));
