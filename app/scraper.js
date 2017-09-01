const axios = require('axios');
const parser = require('./parser');

// return urls to crawl for availability data
const availabilityUrls = ( context, response ) => {
  const urls = [];
  // construct urls for all items and branches combos
  for ( const itemId of parser.getIds( response.data ) ) {
    for ( const branchId of context.branchIds ) {
      urls.push( `${ context.baseUrl }/Items/1.${ itemId }.1.${ branchId }.1` );
    };
  }
  
  return urls;
};

exports.scrape = ( keyword, context ) => {
  return new Promise( (resolve, reject) => {
    console.log(`${ Date.now()} searching by keyword ${ keyword }...`);
    // search by keyword to get ids
    axios.get( `${ context.baseUrl }/Results/?ls=1.${ context.resultsSizeLimit }.0.&o=${ context.sortBy }&t=${ keyword }` )
      .then( response => {
        console.log(`${ Date.now()} mapping availabilityUrls...`);
        // build array from concurrent requests per item and branch combo
        let promiseArray = availabilityUrls( context, response ).map( url => {
          return axios.get( url );
        });
        console.log(`${ Date.now()} parsing availabilityUrls...`);
        // once all concurrent requests are complete, parse results per response
        axios.all(promiseArray.map(p => p.catch(() => undefined)))
        .then( results => {
          console.log(`${ Date.now()} filtering availability...`);
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
