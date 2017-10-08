const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');
const querystring = require('querystring');

exports.get = ( context ) => {
  return new Promise( (resolve, reject) => {

    logger.debug(`cancel hold...`);
    axios.get(`${ context.logonUrl }`)
    .then( response => {

      logger.debug(`start logon session...`);
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

        logger.debug(`logon response...`);
        logger.trace(response.data);
        axios({
          method: 'get',
          url: `${ context.itemsOutUrl }`,
          headers: {
            'cookie': sessionCookie
          }
        })
        .then( response => {

          logger.debug(`item renew response...`);
          logger.trace(response.data);
          const renewId = `chkItem${ context.renewId }`;
          axios.post(`${ context.itemsOutUrl }`,
            querystring.stringify({
              button: 'Renew',
              [renewId]: 'true'
            }),
            {
              headers: {
                'cookie': sessionCookie
              }
            }
          )
          .then( response => {

            logger.debug(`item renewed...`);
            logger.trace(response.data);
            resolve( 'Your item has been renewed' );
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
