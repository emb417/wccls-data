const log4js = require('log4js');
const logger = log4js.getLogger();

exports.textMessage = ( items ) => {
  logger.debug( `formatting results for text messsage...` );
  const delim = "--";
  let formattedData = "";

  items.forEach( item => {
    formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
    formattedData += ( item.dueDate ) ?
                    `${ item.dueDate }${ delim }${ item.id }${ delim }${ item.title }${ delim }${ item.renewal }` :
                    `${ item.position }${ delim }${ item.id }${ delim }${ item.title }`;
  });

  return formattedData;
}
