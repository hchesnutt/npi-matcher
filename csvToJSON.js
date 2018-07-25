const fs = require('fs');

const csv = require('csvtojson');

const columns = require('./columns.js');

const pathToNpi = '/Users/henrychesnutt/Downloads/NPPES_Data_Dissemination_July_2018/npidata_pfile_20050523-20180708.csv'
const pathToDestination = './npi-data.json';

const readStream = fs.createReadStream(pathToNpi);
const writeStream = fs.createWriteStream(pathToDestination);
console.log('read & writeStreams start');
console.log(columns);
const csvParams = {
  includeColumns: new RegExp(columns),
};

readStream.pipe(csv(csvParams)).pipe(writeStream);

readStream.on('end', () => console.log('readstream done'))
writeStream.on('end', () => {
  console.log('writeStream done');
  console.timeEnd('start');
});