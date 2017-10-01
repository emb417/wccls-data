const log4js = require('log4js');
const logger = log4js.getLogger();

const cheerio = require('cheerio');
const utils = require('../utils');

exports.hours = ( response ) => {
  const $ = cheerio.load( response );
  let days = [];
  
  // iterate over each row in the main table
  $('#main tr').each( (i, element) => {
    // skip header row
    if(i==0){ return; }
    const text = $(element).find('td').text().replace(/\s*/g,'');
    logger.trace(`${ text }`);
    const day = text.match(/^[a-zA-Z]+/);
    logger.trace(`Day: ${ day }`);
    const time = text.substring(text.indexOf('day')+3);
    logger.trace(`Time: ${ time }`);

    days.push({ day, time });
  });
  
  return days;  
};