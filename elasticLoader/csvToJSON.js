const fs = require('fs');

const csvtojson = require('csvtojson');

const columns = require('./columns.js');

const pathToNpi = '/Users/henrychesnutt/Documents/Hacking/npi-matcher/elasticLoader/npi-data.csv';
const pathToDestination = '/Users/henrychesnutt/Documents/Hacking/npi-matcher/elasticLoader/npi-data.json';

const readStream = fs.createReadStream(pathToNpi);
const writeStream = fs.createWriteStream(pathToDestination);

// Only include specific columns from NPI
const csv = csvtojson({
  includeColumns: new RegExp(columns),
});

// Clean degree field
csv.subscribe((jsonObj) => {
  jsonObj['Provider Credential Text'] = jsonObj['Provider Credential Text'].replace(/(\.|\,)/g,'');
});

// Pipe readStream data through csv parser, then pipe to new file
readStream.pipe(csv).pipe(writeStream);

readStream.on('end', () => console.log('readstream done'))
writeStream.on('end', () => {
  console.log('writeStream done');
  console.timeEnd('csvToJSON');
});