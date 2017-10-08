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
          url: `${ context.holdsUrl }`,
          headers: {
            'cookie': sessionCookie
          }
        })
        .then( response => {

          logger.debug(`holdsUrl response...`);
          logger.trace(response.data);
          axios({
            method: 'get',
            url: `${ context.holdDetailUrl }${ context.holdId }`,
            headers: {
              'cookie': sessionCookie
              }
          })
          .then( response => {

            logger.debug(`hold detail response...`);
            logger.trace(response.data);
            axios.post(`${ context.baseUrl }${ context.parser.actionUrl(response.data) }`,
              querystring.stringify({
                button: 'Cancel'
              }),
              {
                headers: {
                  'cookie': sessionCookie
                }
              }
            )
            .then( response => {

              logger.debug(`cancel url response...`);
              logger.trace(response.data);
              axios.post(`${ context.baseUrl }${ context.parser.actionUrl(response.data) }`,
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

                logger.debug(`hold cancelled...`);
                logger.trace(response.data);
                resolve( 'Your hold has been cancelled' );
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
    })
    .catch( error => reject(error) );
  });
};
