const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');
const querystring = require('querystring');

exports.get = ( context ) => {
  return new Promise( (resolve, reject) => {

    logger.debug(`start logon session...`);
    axios.get(`${ context.logonUrl }`)
    .then( response => {

      //logger.trace(`init logon response: ${ JSON.stringify(response.headers) }`);

      logger.debug(`post logon creds...`);
      const sessionCookie = response.headers['set-cookie'][0];
      axios({
        method: 'post',
        url: `${ context.logonUrl }`,
        headers: {
          'cookie': sessionCookie
        },
        data: { ...context.logonCreds }
      })
      .then( response => {

        //logger.trace(`logon attempt response: ${ response.data }`);

        logger.debug(`setting item...`);
        axios({
          method: 'get',
          url: `${ context.itemUrl }${ context.itemId }`,
          headers: {
            'cookie': sessionCookie
          }
        })
        .then( response => {

          //logger.trace(`item response: ${ response.data }`);

          logger.debug(`initiate hold request...`);
          axios({
            method: 'get',
            url: `${ context.createHoldUrl }`,
            headers: {
              'cookie': sessionCookie
            }
          })
          .then( response => {

            //logger.trace(`createHold response: ${ response.data }`);

            logger.debug(`posting hold request...`);
            const d = new Date();
            const activationDate = `${ d.getMonth()+1 }/${ d.getDate() }/${ d.getYear()+1900 }`;
            logger.trace(`pickupBranch: ${ context.branchId }`);
            logger.trace(`activationDate: ${ activationDate }`);
            axios.post(context.createHoldRequestUrl,
              querystring.stringify({
                activationDate,
                button: 'Submit Request',
                pickupBranch: context.branchId
              }),
              {
                headers: {
                  'cookie': sessionCookie
                }
              }
            )
            .then( response => {

              logger.trace(`createHoldRequest response: ${ JSON.stringify(response.data) }`);

              logger.debug(`checking for conditional response...`);
              if( response.data.indexOf('Your request has been placed') > -1 ){

                logger.debug(`hold created...`);
                resolve( 'Your request has been placed' );
              }
              else {
                logger.debug(`confirming conditional response...`);
                axios.post(context.conditionalResponseUrl,
                  querystring.stringify({
                    button: 'Yes'
                  }),
                  {
                    headers: {
                      'cookie': sessionCookie
                    }
                  }
                )
                .then( response => {

                  logger.trace(`conditional response: ${ JSON.stringify(response.data) }`);

                  logger.debug(`hold created...`);
                  resolve( 'Your request has been placed' );
                })
                .catch( error => reject(error) );
              }
            })
            .catch( error => reject(error) );
          })
          .catch( error => reject(error) );
        })
        .catch( error => reject(error) );
      })
      .catch( error => reject(error) );
    })
    .catch( error => reject(error) );
  });
};
