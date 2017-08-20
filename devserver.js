const express = require('express');
const bodyParser = require('body-parser');
const lambda = require('./lambda');
const app = express();

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

app.listen(3000);
