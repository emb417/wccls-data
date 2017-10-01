const delim = "----";

exports.statusTextMessage = ( items ) => {
  let formattedData = "";
  items.forEach( branchTitles => {
    branchTitles.forEach( branchTitle => {
      formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
      formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.itemId }${ delim }${ branchTitle.title }${ delim }${ branchTitle.items }`;
    });
  });
  return formattedData;
}
