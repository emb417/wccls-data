'use strict';

const axios = require('axios');
const parser = require('./parser');

exports.scrape = (context, callback) => {
  const baseUrl = "https://catalog.wccls.org/Mobile/Search";
  // construct initial url
  const resultsUrl = `${ baseUrl }/Results/?ls=1.${ context.size || '10' }.0.&t=${ context.keyword }`;

  // return item ids parsed from search results response data
  const getItemIds = (response) => {
    return parser.getIds(response.data);
  }

  // return urls to crawl for availability data
  const availabilityUrls = (response) => {
    const urls = [];
    // use branchId if supplied in context otherwise search all
    const branchIds = (typeof context.branch != "undefined" ) ?
      [ context.branch ] : [ ...[
                              9, //Beaverton City Library
                              39, //Beaverton Murray Scholls
                              34, //Cedar Mills Bethany Branch
                              11, //Cedar Mills Community Library
                              20, //Hillsboro Brookwood
                              19 //Hillsboro Shute Park
                            ] ];
    // construct urls for all items and branches combos
    for( const itemId of getItemIds(response)){
      for( const branchId of branchIds ){
        urls.push(`${ baseUrl }/Items/1.${ itemId }.1.${ branchId }.1`);
      };
    }

    return urls;
  };

  //search by keyword to get ids
  axios.get(resultsUrl)
    .then((response) => {
      // build array from concurrent requests per item and branch combo
      let promiseArray = availabilityUrls(response).map(url => {
        return axios.get(url);
      });
      // once all concurrent requests are complete, parse results per response
      axios.all(promiseArray)
      .then(function(results) {
        let filteredAvailability = [];

        results.map((r) => {
          const availability = parser.getAvailability(r.data, context);
          //discard results that have no items
          if(availability.items.length>0){
            filteredAvailability.push(availability);
          }
        });

        return callback(null, filteredAvailability);
      });
    })
    .catch(function (error) {
      callback(true, error);
    });
};
