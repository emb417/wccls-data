const log4js = require('log4js');
const logger = log4js.getLogger();

const cheerio = require('cheerio');
const utils = require('../utils');

exports.getNowAvailability = (response, context) => {
  const $ = cheerio.load(response);
  const obj = {};
  obj.title = utils.cleanTitle($('#main b').text());
  obj.branch = utils.cleanBranch($('#main .findit-branch-selected').text().substring(8));
  obj.items = $('#main .findit-item').map(function(i, el) {
    const findItemText = $(this).text();
    // availability is end of item text
    const itemAvailabilityText = findItemText.substr(findItemText.lastIndexOf(" - ")+3);
    // if item text contains not holdable, format availability
    const formattedAvailability = /\-\ Not\ Holdable\ \-/.test(findItemText) ?
      `${ itemAvailabilityText } -- Not Holdable` : itemAvailabilityText;
    return formattedAvailability;
  }).get();

  return obj;
};

exports.getStatusAvailability = (response, context) => {
  const $ = cheerio.load(response);
  const obj = {};
  obj.title = utils.cleanTitle($('#main b').text());
  obj.branch = utils.cleanBranch($('#main .findit-branch-selected').text().substring(8));
  obj.items = $('#main .findit-item').map(function(i, el) {
    const findItemText = $(this).text();
    // availability is end of item text
    const itemAvailabilityText = findItemText.substr(findItemText.lastIndexOf(" - ")+3);
    // if item text contains not holdable, format availability
    const formattedAvailability = /\-\ Not\ Holdable\ \-/.test(findItemText) ?
      `${ itemAvailabilityText } -- Not Holdable` : itemAvailabilityText;
    return formattedAvailability;
  }).get();
  obj.itemId = $('#breadcrumbs a').last().attr('href').split('.').pop();

  return obj;
};

exports.getIds = (response) => {
  const $ = cheerio.load(response);
  const ids = [];
  $('#main .nsm-brief-primary-title-group').each(function(i, element) {
      const href = $(this).find('a').attr('href');
      const id = href.substr(href.lastIndexOf(".")+1);
      ids.push(id);
  });
  logger.trace(`search results ids: ${ ids }`);

  //check for single result redirect to detail page
  if(ids.length === 0){
    $('#main').each(function(i, element) {
        const id = $(this).find('span').attr('id').split('_')[1];
        logger.trace(`element attr id: ${ id }`);
        ids.push(id);
    });
    logger.trace(`single search result ids: ${ ids }`);
  }


  return ids;
};
