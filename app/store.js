const log4js = require('log4js');
const logger = log4js.getLogger();

const fs = require('fs');
const path = require('path');

const itemsDB = path.join(__dirname, '../..', 'data/items.db');

exports.put = ( data ) => {
  logger.debug(`checking items.db...`);
  fs.access(itemsDB, fs.constants.F_OK, (err) => {
    // if db doesn't exist, create it
    if(err){
      logger.debug(`items.db does not exist, writing a new one...`);
      fs.writeFile(itemsDB, JSON.stringify([ data ]), (err) => {
          if (err) { throw err; }
          logger.debug(`items.db initialized...`);
          return;
      });
    } else {
      logger.debug(`items.db does exists, appending new data...`);
      fs.readFile(itemsDB, 'utf8', (err, fileData) => {
        if (err) { throw err; }
        // read and write same, soon merge...
        const fileJSON = JSON.parse(fileData);
        fileJSON.push(data);
        // write over items.db with newly merged data
        fs.writeFile(itemsDB, JSON.stringify(fileJSON), (err) => {
            if (err) { throw err; }
            logger.debug(`items.db updated...`);
            return;
        });
      });
    };
  });  
}