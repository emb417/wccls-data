const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');

exports.get = ( context ) => {
  return new Promise( (resolve, reject) => {

    logger.debug(`start logon session...`);
    axios.get(`${ context.logonUrl }`)
    .then( response => {

      const c = response.headers['set-cookie'][0];
      logger.debug(`post logon creds...`);
      axios({
        method: 'post',
        url: context.logonUrl,
        headers: {
          'cookie': c
        },
        data: { ...context.logonCreds }
      })
      .then( response => {

        const promiseArray = context.urls.map( url => {
          return axios({
                        method: 'get',
                        url,
                        headers: {
                          'cookie': c
                        }
                      });
        });

        logger.debug(`getting items...`);
        axios.all(promiseArray.map(p => p.catch(() => undefined)))
        .then( results => {

          logger.debug(`parsing html...`);
          let items = [];
          results.map( r => {
            items = [ ...items, ...(context.parser( r.data )) ];
            return;
          });

          resolve( items );
        })
        .catch( error => reject(error) );
      })
      .catch( error => reject(error) );
    })
    .catch( error => reject(error) );
  });
};
