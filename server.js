const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const lambda = require('./app/lambda');

const app = express();
// invoke pretty print
app.set('json spaces', 2);

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// express middleware
app.use(morgan('common', {stream: accessLogStream}));
app.use(bodyParser.json());

// express routes
app.get('/keyword/:keyword', function(req, res) {
  lambda.handler(req.body, req.params, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.get('/keyword/:keyword/size/:size', function(req, res) {
  lambda.handler(req.body, req.params, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.get('/keyword/:keyword/branch/:branchId', function(req, res) {
  lambda.handler(req.body, req.params, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.get('/keyword/:keyword/size/:size/branch/:branchId', function(req, res) {
  lambda.handler(req.body, req.params, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.get('/', function(req, res) {
  lambda.handler(req.body, req.query, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

http.createServer(app).listen(1337);
