const log4js = require('log4js');
const logger = log4js.getLogger();

const axios = require('axios');
const parser = require('./parser.js');

exports.scrape = ( context ) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`start logon session...`);
    axios.get(`${ context.logonUrl }`)
    .then( response => {
      logger.debug(`post logon creds...`);
      let c = '';
      if (response.headers['set-cookie'] instanceof Array) {
        c = response.headers['set-cookie'][0];
      }
      axios({
        method: 'post',
        url: `${ context.logonUrl }`,
        headers: {
          'cookie': `${ c }`
        },
        data: {
          barcodeOrUsername: context.barcodeOrUsername,
          password: context.password,
          rememberMe: context.rememberMe
        }
      })
      .then( response => {
        let promiseArray = context.urls.map( url => {
          return axios({
                        method: 'get',
                        url: `${ url }`,
                        headers: {
                          'cookie': `${ c }`
                        }
                      })
        });

        logger.debug(`getting items...`);
        axios.all(promiseArray.map(p => p.catch(() => undefined)))
        .then( results => {

          logger.debug(`parsing html...`);
          let items = [];
          results.map( r => {
            items = context.routePath === "/due/:user/:pwd" ? [ ...items, ...(parser.dueDates( r.data )) ]
                                                            : [ ...items, ...(parser.holdPositions( r.data )) ];
            return;
          });
          if(context.routePath === "/holds/:user/:pwd"){
            // sort by position
            items.sort( (a, b) => {
              return a.position - b.position;
            });
          }

          resolve( items );
        })
        .catch( error => reject(error) );
      })
      .catch( error => reject(error) );
    })
    .catch( error => reject(error) );
  });
};
