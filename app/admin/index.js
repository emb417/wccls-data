const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const fs = require('fs');
const path = require('path'); 

const newsConfig = path.join(__dirname, '..', 'availability/news/config.json');
logger.debug(newsConfig);

const app = express.Router({ mergeParams : true });

app.use((req, res) => {
  
  logger.info(`ADMIN ${ req.originalUrl }`);
  fs.access(newsConfig, fs.constants.F_OK, (err) => {
    if(err){
      logger.warn(`news/config.json doesn't exist?!?!`);
    } else {
      
      logger.debug(`appending new keywords...`);
      fs.readFile(newsConfig, 'utf8', (err, fileData) => {
        if (err) { throw err; }

        const fileJSON = JSON.parse(fileData);
        fileJSON.keywords.push(req.params.keywords);
        
        // write over file with newly merged data
        fs.writeFile(newsConfig, JSON.stringify(fileJSON, null, 2), (err) => {
            if (err) { throw err; }
            logger.info(`news/config.json updated...`);
            return;
        });
      });
    };
  });
  res.send( `news/config.json updated...` );
});

module.exports = app;
