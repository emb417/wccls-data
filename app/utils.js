exports.cleanTitle = ( title ) => {
  return title.replace(/\[videorecording\s*\(\s*/, '')
    .replace(/\s*\[sound\srecording\s*\(\s*/,'')
    .replace(/\s*\[electronic\sresource\s*\(game\)\]/,'')
    .replace(/\s*\[game\]\s*/,'')
    .replace(/\s*\[downloadable\saudiobook]\s*/,'')
    .replace(/\s*\[downloadable\sebook]\s*/,'')
    .replace(/\)\]/,'');
}

exports.cleanBranch = ( branch ) => {
  return branch.replace('Beaverton City Library', 'BCC')
    .replace('Beaverton Murray Scholls', 'BMS')
    .replace('Cedar Mill Bethany Branch Library', 'CMB')
    .replace('Cedar Mill Community Library', 'CMC')
    .replace('Hillsboro Brookwood Library', 'HBW')
    .replace('Hillsboro Shute Park Library', 'HSP')
    .replace('Tigard Public Library', 'TIG')
    .replace('Tualatin Public Library', 'TUA')
}

exports.branchIdMap = ( branchId ) => {
  const idMap = {
    "bcc": 9,
    "bms": 39,
    "cmb": 34,
    "cmc": 11,
    "hbw": 20,
    "hsp": 19,
    "tig": 29,
    "tua": 31
  }

  return /^\d+$/.test(branchId) ? branchId : idMap[branchId.toLowerCase()];
}
