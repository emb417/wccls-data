const scraper = require('./scraper');

exports.handler = function(event, context, callback) {

  scraper.scrape(context, function(err, result) {
    if (err) {
      return callback(null, { error: result });
    }
    return callback(null, result);
  });

};
