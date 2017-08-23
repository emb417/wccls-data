const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const scraper = require('./app/scraper');

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

const app = express();
// invoke pretty print
app.set('json spaces', 2);

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// express middleware
app.use(morgan('common', {stream: accessLogStream}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  scraper.scrape(req.query, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.listen(1337);
