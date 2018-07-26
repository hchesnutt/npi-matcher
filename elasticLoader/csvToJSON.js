const fs = require('fs');

const csv = require('csvtojson');

const columns = require('./columns.js');

const pathToNpi = '/Users/henrychesnutt/Downloads/NPPES_Data_Dissemination_July_2018/npidata_pfile_20050523-20180708.csv'
const pathToDestination = './npi-data.json';

const readStream = fs.createReadStream(pathToNpi);
const writeStream = fs.createWriteStream(pathToDestination);

// Only include specific columns from NPI
const csvParams = {
  includeColumns: new RegExp(columns),
};

// Pipe readStream data through csv parser, then pipe to new file
readStream.pipe(csv(csvParams)).pipe(writeStream);

readStream.on('end', () => console.log('readstream done'))
writeStream.on('end', () => {
  console.log('writeStream done');
  console.timeEnd('csvToJSON');
});