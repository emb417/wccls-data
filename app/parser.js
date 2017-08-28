const cheerio = require('cheerio');

exports.getAvailability = (response, context) => {
  // console.log("parsing availability...");
  const $ = cheerio.load(response);
  const obj = {};
  obj.title = $('#main b').text();
  obj.branch = $('#main .findit-branch-selected').text().substring(8);
  obj.items = $('#main .findit-item').map(function(i, el) {
    const findItemText = $(this).text();
    // availability is end of item text
    const itemAvailabilityText = findItemText.substr(findItemText.lastIndexOf(" - ")+3);
    // if item text contains not holdable, format availability
    const formattedAvailability = /\-\ Not\ Holdable\ \-/.test(findItemText) ?
      `${ itemAvailabilityText } -- Not Holdable` : itemAvailabilityText;
    // ony include availability that contains availabilityCode
    // if(formattedAvailability.includes(unescape(context.availabilityCode))) {
    //  return formattedAvailability;
    //}
    return formattedAvailability;
  }).get();

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
  return ids;
};
