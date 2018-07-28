const { resolve } = require('path');
const { green } = require('chalk');
const ora = require('ora');

const findDoctors = require('./elasticsearch/findDoctors.js');
const { parseDoctors, 
  parseResponses, 
  decorateWithNPI,
  writeToJSON,
  writeToCSV, } = require('./lib/utils.js');

const pathToDoctorsJSON = resolve(__dirname, './mount_sinai_provider_data.json');
const JSONDestinationPath = resolve(__dirname, `${pathToDoctorsJSON.replace(/.json$/, '_NPI.json')}`);
const CSVDestinationPath = resolve(__dirname, `${pathToDoctorsJSON.replace(/.json$/, '_NPI.csv')}`);

const doctorsRaw = require(pathToDoctorsJSON);
const keys = Object.keys(doctorsRaw);
const doctors = parseDoctors(doctorsRaw, keys);

console.time(' Total time:');
const spinner = ora({
  text: 'Matching doctor data to NPI',
  spinner: 'dots10',
}).start();

try {
  // Query Elasticsearch
  findDoctors([...doctors], async (responses) => {
    responses = await responses;
    
    // Parse Elasticsearch responses
    spinner.stopAndPersist({ text: 'Parsing responses', }).start();
    const matchedDoctors = parseResponses(responses);
    
    // Decorate raw doctor data with NPI from responses
    const doctorsRawWithNPI = decorateWithNPI(doctorsRaw, keys, matchedDoctors);
    
    // Write decorated doctor data to file as JSON
    spinner.stopAndPersist({ text: 'Writing results to destination files', }).start();
    writeToJSON(JSONDestinationPath, doctorsRawWithNPI);

    // Write decorated doctor data to file as CSV
    writeToCSV(CSVDestinationPath, doctorsRawWithNPI);

    // Notify user of success
    spinner.succeed(`Enrichment Success`);
    console.log(
      `\n JSON file:`, green(JSONDestinationPath),
      `\n CSV file:`, green(CSVDestinationPath),
    );
    console.timeEnd(' Total time:');
  });
} catch (e) {
  console.log(e);
}
