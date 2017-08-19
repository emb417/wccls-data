const cheerio = require('cheerio');

exports.getAvailability = (response) => {
    const $ = cheerio.load(response);
    const obj = {};
    obj.title = $('#main b').text();
    obj.branch = $('#main .findit-branch-selected').text().substring(8);
    obj.items = $('#main .findit-item').map(function(i, el) {
      const findItemText = $(this).text();
      if(/\-\ Not\ Holdable\ \-/.test(findItemText)){
        return findItemText.substr(findItemText.lastIndexOf(" - ")+3);
      }
      return;
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
