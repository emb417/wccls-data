const log4js = require('log4js');
const logger = log4js.getLogger();

const cheerio = require('cheerio');

exports.actionUrl = ( response ) => {
  const $ = cheerio.load( response );
  logger.trace(`Action URL: ${ $('#main form').attr('action') }`);
  return $('#main form').attr('action');
};
