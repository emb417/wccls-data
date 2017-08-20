const axios = require('axios');
const parser = require('../parser');
const config = require('../config');

exports.scrape = (context, callback) => {
  // construct initial url
  const resultsUrl = `${ config.baseUrl }/Results/?ls=1.${ context.size || config.size }.0.&t=${ context.keyword }`;

  // return item ids parsed from search results response data
  const getItemIds = (response) => {
    return parser.getIds(response.data);
  }

  // return urls to crawl for availability data
  const availabilityUrls = (response) => {
    const urls = [];
    // use branchId if supplied in context otherwise use config to search all
    const branchIds = (typeof context.branchId != "undefined" ) ?
      [ ...context.branchId ] : [ ...config.branchIds ];

    // construct urls for all items and branches combos
    for( const itemId of getItemIds(response)){
      for( const branchId of branchIds ){
        urls.push(`${ config.baseUrl }/Items/1.${ itemId }.1.${ branchId }.1`);
      };
    }

    return urls;
  };

  //search by keyword to get ids
  axios.get(resultsUrl)
    .then((response) => {
      // build array from concurrent requests per item and branch combo
      let promiseArray = availabilityUrls(response).map(url => axios.get(url));
      // once all concurrent requests are complete, parse results per response
      axios.all(promiseArray)
      .then(function(results) {
        let availability = [];
        results.map((r) => {
          // discard results that are not 'not holdable'
          if(parser.getAvailability(r.data).items.length>0){
            availability.push(parser.getAvailability(r.data));
          }
        });
        return callback(null, availability);
      });
    })
    .catch(function (error) {
      callback(true, error);
    });
};
