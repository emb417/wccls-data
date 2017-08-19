const axios = require('axios');
const parser = require('../parser');

exports.scrape = (context, callback) => {
  const resultsUrl = `https://catalog.wccls.org/Mobile/Search/Results/?t=${ context.keyword }`;
  const availabilityUrl = `https://catalog.wccls.org/Mobile/Search/Items/1.__itemId__.1.${ context.branchId }.1`;
  //search by keyword to get top hit (id)
  axios.get(resultsUrl)
    .then((response) => {
      //get availability for responses item id
      return axios.get(availabilityUrl.replace('__itemId__',parser.getIds(response.data)[0]));
    })
    .then((response) => {
      return callback(null, parser.getAvailability(response.data));
    })
    .catch(function (error) {
      callback(true, error);
    });
};
