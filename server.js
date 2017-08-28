const fs = require('fs');
const path = require('path');
const Express = require('express');
const Morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const unhold = require('./app/unhold');

const logDirectory = path.join(__dirname, 'logs');
const dataDirectory = path.join(__dirname, 'data');
const notifyDirectory = path.join(__dirname, 'notify');

// ensure directories exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.existsSync(dataDirectory) || fs.mkdirSync(dataDirectory);
fs.existsSync(notifyDirectory) || fs.mkdirSync(notifyDirectory);
fs.access('./notify/message.txt', fs.constants.F_OK, (err) => {
  if(err){
    fs.writeFile('./notify/message.txt', '', (err) => {
        if (err) { throw err; }
        return;
    });
  }
  return;
});

const app = Express();

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// express middleware
app.use(Morgan('common', {stream: accessLogStream}));
app.use(bodyParser.json());

app.use('/unhold', unhold);

app.get('*', (req, res) => {
  res.send('Welcome!  Use /unhold or fail.');
});

app.listen(1337);
