const fs = require('fs');
const path = require('path');
const Express = require('express');
const Morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');

// app modules
const account = require('./account');
const news = require('./news');
const now = require('./now');
const status = require('./status');

// data directories
const logDirectory = path.join(__dirname, '..', 'logs');
const dataDirectory = path.join(__dirname, '..', 'data');

// ensure directories exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.existsSync(dataDirectory) || fs.mkdirSync(dataDirectory);

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

app.get('/due/:user/:pwd', account);

app.get('/holds/:user/:pwd', account);

app.get('/news', news);

app.get('/now/:keywords/:branchId', now);

app.get('/now/:keywords', now);

app.get('/status/:keywords', status);

app.get('*', (req, res) => {
  res.send(
`Welcome!  We support these texts:
  1\) news to check not holdable list status \(only returns in items\)
  2\) status\/\:keywords to give all statuses for top 20 most popular search results
  3\) now\/\:keywords\/\:branchId to get only in items at branch
  4\) due\/\:user\/\:pwd to get due dates for items checked out
  5\) holds\/\:user\/\:pwd to get hold position for items requested`
  );
});

app.listen(1337);
