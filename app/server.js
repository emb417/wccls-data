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
const branches = require('./branches');
const cancelHold = require('./cancelHold');
const createHold = require('./createHold');
const find = require('./availability/find');
const help = require('./help');
const hours = require('./hours');
const news = require('./availability/news');
const now = require('./availability/now');
const renew = require('./renew');


// data directory
const logDirectory = path.join(__dirname, '..', 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// instantiate express app
const app = express();

// express middleware
app.use(log4js.connectLogger(logger, { level: 'info' }));

// express routes
app.get('/add/:keywords', admin);
app.get('/branches', branches);
app.get('/due/:user/:pwd', account);
app.get('/due/:user/:pwd/renew/:item', renew);
app.get('/find/:keywords', find);
app.get('/help', help);
app.get('/holds/:user/:pwd', account);
app.get('/holds/:user/:pwd/cancel/:item', cancelHold);
app.get('/holds/:user/:pwd/add/:item/branch/:branchId', createHold);
app.get('/hours/:branchId', hours);
app.get('/hours', hours);
app.get('/list', admin);
app.get('/news', news);
app.get('/now/:branchId/:keywords', now);
app.get('/remove/:keywords', admin);
app.get('*', ( req, res ) => { res.send( `The Dude does not abide!` ); });

app.listen(1337, logger.info('server started'));
