const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');

exports.get = ( context ) => {
  return new Promise( (resolve, reject) => {
    axios.get(`${ context.hoursUrl }${ context.branchId }`)
    .then( response => {

        logger.debug(`parsing html...`);
        resolve( context.parser( response.data ) );
    })
    .catch( error => reject(error) );
  })
  .catch( error => reject(error) );
};
