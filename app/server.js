const log4js = require('log4js');
log4js.configure({
  appenders: { 
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/server.log' } 
  },
  categories: { 
    default: { appenders: ['file','console'], level: 'info' } 
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
app.get('/now/:keywords', now);
app.get('/remove/:keywords', admin);
app.get('/status/:keywords', status);
app.get('*', (req, res) => {
  res.send(
`Welcome!  We support these texts:
  1\) news to check not holdable list status \(only returns in items\)
  2\) status\/\:keywords to search for all statuses of top 5 most relevant results
  3\) now\/\:keywords\/\:branchId to search for available titles at branch out of the 500 most popular results
  4\) now\/\:keywords same as #3 but returning available titles at any branch
  5\) due\/\:user\/\:pwd to get due dates for items checked out
  6\) holds\/\:user\/\:pwd to get hold position for items requested
  7\) lucky seven...any other words will invoke this menu message`
  );
});

app.listen(1337, logger.info('server started'));
