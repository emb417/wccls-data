const delim = "----";

exports.statusTextMessage = ( results ) => {
  let formattedData = "";
  results.forEach( branchTitles => {
    branchTitles.forEach( branchTitle => {
      formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
      formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.itemId }${ delim }${ branchTitle.title }${ delim }${ branchTitle.items }`;
    });
  });
  return formattedData;
}

exports.nowTextMessage = ( results, availabilityCode ) => {
  let formattedData = "";
    results.forEach( branchTitles => {
      branchTitles.forEach( branchTitle => {
        if ( branchTitle.items.includes( availabilityCode ) ) {
          formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
          formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.title }${ delim }${ branchTitle.items }`;
        }
      });
    });
  return formattedData;
  }

  exports.newsTextMessage = ( results, availabilityCode ) => {
    let formattedData = "";
    results.forEach( branchTitles => {
      branchTitles.forEach( branchTitle => {
        if ( branchTitle.items.includes( `In -- ${ availabilityCode }` ) ){
          formattedData += formattedData === "" ? `${ delim }` : `\n${ delim }`;
          formattedData += `${ branchTitle.branch }${ delim }${ branchTitle.title }`;
        };
      });
    });
    return formattedData;
  }
