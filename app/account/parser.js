const log4js = require('log4js');
const logger = log4js.getLogger();

const cheerio = require('cheerio');
const utils = require('../utils');

exports.dueDates = ( response ) => {
  const $ = cheerio.load( response );
  const items = [];

  // iterate over each row in the main table
  $('#main tr').each( (i, element) => {
    // skip header row
    if(i==0){ return; }
    let id, title, renewal, dueDate = '';

    logger.trace(`element: ${$(element)}`);
    const href = $(element).children().find('a').attr('href');
    id = href.split( '/' )[4];
    title = utils.cleanTitle($(element).find('a').text());

    const cells = `${$(element)}`.split('\<br\>');
    logger.trace(`cells: ${ cells.length }`);
      renewal = cells[1] ? cells[1].replace('&#xA0;',' ') : '';
      dueDate = cells[2] ? cells[2].substr(0, cells[2].indexOf('&#xA0;&#xA0;')).replace('&#xA0;',' ') : '';

    items.push({ id, title, renewal, dueDate });
  });

  return items;
};

exports.holdPositions = ( response ) => {
  const $ = cheerio.load( response );
  const items = [];

  // iterate over each row in the main table
  $('#main tr').each( (i, element) => {
    // skip header row
    if(i==0){ return; }

    let id, title, position = '';

    const href = $(element).children().find('a').attr('href');
    id = href.split( '/' )[4];
    title = utils.cleanTitle($(element).find('a').text());
    position = $(element).children('td:nth-child(3)').text().replace(/\s*/g,'');
    // parse X of X text; only the place in line matters
    // size of queue represents popularity; not relevant for hold position
    position = position.substr(0,position.indexOf('Of'));

    if ( position === "" ){
      // get status text instead
      position = $(element).find('span').text();

      if ( position.indexOf('Cancelled') > -1 ){
        // remove cancels from message
        return;
      }
    }
    items.push({ id, title, position });
  });

  return items;
};
