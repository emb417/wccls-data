exports.textMessage = ( items ) => {
  // format for sms response
  const delim = "--";
  let formattedData = "";

  items.forEach( item => {
    formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
    formattedData += `${ item.day }${ delim }${ item.time }`;
  });

  return formattedData;
}
