const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');
const parser = require('./parser');

// return urls to crawl for availability data
const availabilityUrls = ( context, response ) => {
  const urls = [];
  // construct urls for all items and branches combos
  for ( const itemId of parser.getIds( response.data ) ) {
    for ( const branchId of context.branchIds ) {
      logger.trace(`branchId ${ branchId }...`);
      logger.trace(`context.branchIdMap ${ JSON.stringify(context.branchIdMap) }...`);
      logger.trace(`context.branchIdMap[branchId] ${ context.branchIdMap[branchId] }...`);
      urls.push( `${ context.baseUrl }/Items/1.${ itemId }.1.${ /^\d+$/.test(branchId) ? branchId : context.branchIdMap[branchId] }.1` );
    };
  }
  
  return urls;
};

exports.scrape = ( keyword, context ) => {
  return new Promise( (resolve, reject) => {

    // search by keyword to get ids    
    logger.debug(`searching by keyword ${ keyword }...`);
    axios.get( `${ context.baseUrl }/Results/?ls=1.${ context.resultsSizeLimit }.0.&o=${ context.sortBy }&t=${ keyword }` )
      .then( response => {

        // build array from concurrent requests per item and branch combo
        logger.debug(`mapping availabilityUrls...`);
        let promiseArray = availabilityUrls( context, response ).map( url => {
          logger.trace(`availabilityUrls: ${ url }`);
          return axios.get( url );
        });

        // once all concurrent requests are complete, parse results per response        
        logger.debug(`parsing availabilityUrls...`);
        axios.all(promiseArray.map(p => p.catch(() => undefined)))
        .then( results => {
          
          logger.debug(`filtering availability...`);
          let filteredAvailability = [];
          results.map( r => {

            // discard results that have no items
            const availability = parser.getAvailability( r.data, context );
            if( availability.items.length > 0 ){
              filteredAvailability.push( availability );
            }
            
            return;
          });

          resolve(filteredAvailability);
        })
        .catch( error => { reject(error) } );  
      })
      .catch( error => { reject(error) } );
  });
};
