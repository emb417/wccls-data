const fs = require('fs');
const path = require('path');
const Express = require('express');
const Morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');

// app modules
const status = require('./status');
const news = require('./news');
const now = require('./now');

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

app.get('/status/:keywords', status);

app.get('/news', news);

app.get('/now/:keywords/:branchId', now);

app.get('/now/:keywords/:branchId', now);

app.get('/now/:keywords', now);



app.get('*', (req, res) => {
  res.send('Welcome!  We support /news or /avail/:keywords or /pop/:keywords.');
});

app.listen(1337);
