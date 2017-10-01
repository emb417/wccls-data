exports.textMessage = ( items ) => {
  const delim = "--";
  let formattedData = "";

  if(!items[0].dueDate){
    // sort by position
    items.sort( (a, b) => {
      return a.position - b.position;
    });
  }

  items.forEach( item => {
    formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
    formattedData += ( item.dueDate ) ?
                    `${ item.dueDate }${ delim }${ item.id }${ delim }${ item.title }${ delim }${ item.renewal }` :
                    `${ item.position }${ delim }${ item.id }${ delim }${ item.title }`;
  });

  return formattedData;
}
