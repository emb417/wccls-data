const axios = require('axios');
const parser = require('./parser');
const config = require('../config/global.json');

// return urls to crawl for availability data
const availabilityUrls = ( context, response ) => {
  const urls = [];
  // use branchId if supplied in context otherwise search all
  const branchIds = (typeof context.branch != "undefined" ) ?
    [ context.branch ] : config.branchIds;
  // construct urls for all items and branches combos
  for ( const itemId of parser.getIds( response.data ) ) {
    for ( const branchId of branchIds ) {
      urls.push( `${ config.baseUrl }/Items/1.${ itemId }.1.${ branchId }.1` );
    };
  }
  
  return urls;
};

exports.scrape = ( keyword, context ) => {
  return new Promise( (resolve, reject) => {
    console.log("getting search results for keyword: ", keyword);
    // search by keyword to get ids
    axios.get( `${ config.baseUrl }/Results/?ls=1.${ context.resultsSizeLimit || '10' }.0.&t=${ keyword }` )
      .then( response => {
        console.log('get availabilityUrls...');
        // build array from concurrent requests per item and branch combo
        let promiseArray = availabilityUrls( context, response ).map( url => {
          return axios.get( url );
        });
        // once all concurrent requests are complete, parse results per response
        axios.all(promiseArray.map(p => p.catch(() => undefined)))
        .then( results => {
          console.log("filtering availability...");
          let filteredAvailability = [];
          results.map( r => {
            const availability = parser.getAvailability( r.data, context );
            // discard results that have no items
            if( availability.items.length > 0 ){
              filteredAvailability.push( availability );
            }
            return;
          });

          resolve(filteredAvailability);
        })
      })
      .catch( error => { reject(error) } );
  });
};
