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
app.get('/due/:user/:pwd', account);
app.get('/holds/:user/:pwd', account);
app.get('/list', admin);
app.get('/news', news);
app.get('/now/:keywords/:branchId', now);
app.get('/remove/:keywords', admin);
app.get('/status/:keywords', status);
app.get('*', (req, res) => {
  res.send(
`The Dude is here to help.  The Dude only abides:

  1\) list to get not holdable list

  2\) add\/\:keywords to add to not holdable list

  3\) remove\/\:keywords to remove from not holdable list

  4\) news to manually invoke the check of not holdable list status \(only returns in items\)

  5\) status\/\:keywords to search for top 5 most relevant results and see availability

  6\) now\/\:keywords\/\:branchId to search for available titles at branch out of the 500 most popular results

  7\) due\/\:user\/\:pwd to get due dates for items checked out

  8\) holds\/\:user\/\:pwd to get hold position for items requested

  9\) help to see this again`
  );
});

app.listen(1337, logger.info('server started'));
