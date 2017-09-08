const log4js = require('log4js');
const logger = log4js.getLogger();

const express = require('express');
const fs = require('fs');
const path = require('path'); 

const newsConfig = path.join(__dirname, '..', 'availability/news/config.json');

const app = express.Router({ mergeParams : true });

app.use( (req, res) => {
  
  logger.info( `ADMIN ${ req.originalUrl }` );
  fs.access(newsConfig, fs.constants.F_OK, ( err ) => {
    if ( err ) {
      logger.warn( `news/config.json doesn't exist?!?!` );
    } else {
      
      logger.debug( `administering keywords...` );
      fs.readFile( newsConfig, 'utf8', ( err, fileData ) => {
        if ( err ) { throw err; }

        const fileJSON = JSON.parse(fileData);
        logger.debug(req.route.path);
        if ( req.route.path.split('/')[1] === "list" ) {
          logger.debug( `listing keywords...` );
          res.send( `${ fileJSON.keywords.join(`\n`) }` );
        }
        else if ( req.route.path.split('/')[1] === "add" ) {
          logger.debug( `appending keywords...` );
          fileJSON.keywords.push( req.params.keywords ); 
          // write over file with newly added keywords
          fs.writeFile( newsConfig, JSON.stringify( fileJSON, null, 2 ), ( err ) => {
              if ( err ) { throw err; }
              logger.info( `news/config.json updated...` );
              return;
          });
          res.send( `${ fileJSON.keywords.join(`\n`) }` );    
        } 
        else if ( req.route.path.split( '/' )[1] === "remove" ) {
          const foundIndex = fileJSON.keywords.findIndex( ( keyword ) => {
            return keyword === req.params.keywords;
          });
          fileJSON.keywords.splice( foundIndex, 1 );
          // write over file minus removed keywords
          fs.writeFile( newsConfig, JSON.stringify( fileJSON, null, 2 ), ( err ) => {
              if ( err ) { throw err; }
              logger.info( `news/config.json updated...` );
              return;
          });
          res.send( `${ fileJSON.keywords.join(`\n`) }` );          
        }
        
      });
    };
  });
});

module.exports = app;
