const axios = require('axios');
const parser = require('../parser');
const config = require('../config');

exports.scrape = (context, callback) => {
  const resultsUrl = `${ config.baseUrl }/Results/?t=${ context.keyword }`;

  // return item ids parsed from search results response data
  const getItemIds = (response) => {
    return parser.getIds(response.data);
  }

  // return urls to crawl for availability data
  const availabilityUrls = (response) => {
    const urls = [];
    const branchIds = (typeof context.branchId != "undefined" ) ?
      [ ...context.branchId ] : [ ...config.branchIds ];

    for( const itemId of getItemIds(response)){
      for( const branchId of branchIds ){
        urls.push(`${ config.baseUrl }/Items/1.${ itemId }.1.${ branchId }.1`);
      };
    }

    return urls;
  };

  //search by keyword to get top hits (ids)
  axios.get(resultsUrl)
    .then((response) => {
      //return axios.get(availabilityUrls(response)[0]);
      let promiseArray = availabilityUrls(response).map(url => axios.get(url));
      axios.all(promiseArray)
      .then(function(results) {
        let availability = [];
        results.map((r) => {
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
