const fs = require('fs');
const path = require('path');
const Express = require('express');
const Morgan = require('morgan');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');

// app modules
const onshelf = require('./onshelf');
const unhold = require('./unhold');

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

app.get('/onshelf/:keywords', onshelf);

app.get('/unhold', unhold);

app.get('*', (req, res) => {
  res.send('Welcome!  We support /unhold or /onshelf/:keywords with query of rsl (result size limit up to 300), branch, and sort.');
});

app.listen(1337);
