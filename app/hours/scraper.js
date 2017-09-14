const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');
const parser = require('./parser.js');

exports.scrape = ( context ) => {
  return new Promise( (resolve, reject) => {
    axios.get(`${ context.hoursUrl }${ /^\d+$/.test(context.branchId) ? context.branchId : context.branchIdMap[context.branchId] }`)
    .then( response => {
        
        logger.debug(`parsing html...`);
        const hours = parser.hours( response.data );

        resolve( hours );
    })
    .catch( error => reject(error) );
  })
  .catch( error => reject(error) );
};