const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const lambda = require('./app/lambda');

const app = express();

// invoke pretty print
app.set('json spaces', 2);

app.use(bodyParser.json());

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

http.createServer(app).listen(1337, function() {
  console.log('listening...');
});
