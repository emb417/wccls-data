const removeString = ( input ) => {
  return /^\d+$/.test(input) ? input : "";
}

exports.textMessage = ( items ) => {
  const delim = "--";
  let formattedData = "";

  if(!items[0].dueDate){
    // sort by position
    items.sort( (a, b) => {
      return removeString(a.position) - removeString(b.position);
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
