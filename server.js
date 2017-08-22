const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const lambda = require('./app/lambda');

const app = express();
// invoke pretty print
app.set('json spaces', 2);

const logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// express middleware
app.use(morgan('common', {stream: accessLogStream}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  lambda.handler(req.body, req.query, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

http.createServer(app).listen(1337);
