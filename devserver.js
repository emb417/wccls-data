const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const lambda = require('./lambda');
const app = express();

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

app.get('/keyword/:keyword/size/:size/branch/:branchId', function(req, res) {
  lambda.handler(req.body, req.params, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.get('/', function(req, res) {
  const parsedUrl = url.parse(req.url);
  console.log(parsedUrl);
  lambda.handler(req.body, querystring.parse(parsedUrl.query), function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  });
});

app.listen(3000);
