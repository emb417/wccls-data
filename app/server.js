const fs = require('fs');
const path = require('path');
const Express = require('express');
const Morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');

// app modules
const hours = require('./hours');
const onshelf = require('./onshelf');
const unhold = require('./unhold');

// data directories
const logDirectory = path.join(__dirname, '..', 'logs');
const dataDirectory = path.join(__dirname, '..', 'data');
const notifyDirectory = path.join(__dirname, '..', 'notify');

// ensure directories exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.existsSync(dataDirectory) || fs.mkdirSync(dataDirectory);
fs.existsSync(notifyDirectory) || fs.mkdirSync(notifyDirectory);

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// instantiate Express app
const app = Express();
// express middleware
app.use(Morgan('common', {stream: accessLogStream}));
app.use(bodyParser.json());

app.get('/onshelf/:keywords', onshelf);

app.get('/unhold', unhold);

app.get('/hours/:day/branch/:id', hours);

app.get('/list/:type', (req, res) => {
  if(req.params.type === "branches") {
    const list = [
      '9:BCL',
      '39:BMS',
      '34:CMBB',
      '11:CMCL',
      '20:HB',
      '19:HSP'
    ];
    res.send(list.join('----'));    
  }
  else if (req.params.type === "days") {
    const list = [
      'M',
      'T',
      'W',
      'Th',
      'F',
      'Sa',
      'Su'
    ];
    res.send(list.join('----'));    
  }

});

app.get('*', (req, res) => {
  res.send('Welcome!  We support /list/branches or /list/days or /unhold or /onshelf/:keywords.');
});

app.listen(1337);
