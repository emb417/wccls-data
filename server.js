const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/wargames/bcl', function(req, res){

  const url = 'https://catalog.wccls.org/Mobile/Search/Items/1.609225.1.9.1';
  let json = {};

  request(url, function(error, response, html){

      if(!error){
          const $ = cheerio.load(html);

          json.title = $('#main b').text();
          json.branch = $('#main .findit-branch-selected').text().substring(8);
          json.items = $('#main .findit-item').map(function(i, el) {
            // this === el
            return $(this).find('span').text();
          }).get();

      }

      res.send(JSON.stringify(json));

  });

});

app.get('/wargames/bms', function(req, res){

  url = 'https://catalog.wccls.org/Mobile/Search/Items/1.609225.1.39.1';

  request(url, function(error, response, html){

      let json = {};

      if(!error){
          const $ = cheerio.load(html);

          json.title = $('#main b').text();
          json.branch = $('#main .findit-branch-selected').text().substring(8);
          json.items = $('#main .findit-item').map(function(i, el) {
            // this === el
            return $(this).find('span').text();
          }).get();

      }

      res.send(JSON.stringify(json));

  });

});

app.listen('8081');

console.log('http://localhost:8081/wargames/bcl','\nhttp://localhost:8081/wargames/bms');

exports = module.exports = app;
