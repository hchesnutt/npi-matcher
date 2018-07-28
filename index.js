const { resolve } = require('path');
const { yellow, green } = require('chalk');

const findDoctors = require('./elasticsearch/findDoctors.js');
const { parseDoctors, 
  parseResponses, 
  decorateWithNPI,
  writeToJSON,
  writeToCSV, } = require('./lib/utils.js');

const pathToDoctorsJSON = resolve(__dirname, './mount_sinai_provider_data.json')
const JSONDestinationPath = resolve(__dirname, `${pathToDoctorsJSON.replace(/.json$/, '_NPI.json')}`);
const CSVDestinationPath = resolve(__dirname, `${pathToDoctorsJSON.replace(/.json$/, '_NPI.csv')}`);

const doctorsRaw = require(pathToDoctorsJSON);
const keys = Object.keys(doctorsRaw);
const doctors = parseDoctors(doctorsRaw, keys);

try {
  console.time(' Total time:')

  // Query Elasticsearch
  findDoctors([...doctors], async (responses) => {
    responses = await responses;
    // Parse Elasticsearch responses
    const matchedDoctors = parseResponses(responses);
    // Decorate raw doctor data with NPI from responses
    const doctorsRawWithNPI = decorateWithNPI(doctorsRaw, keys, matchedDoctors);

    // Write decorated doctor data to file as JSON
    writeToJSON(JSONDestinationPath, doctorsRawWithNPI);

    // Write decorated doctor data to file as CSV
    writeToCSV(CSVDestinationPath, doctorsRawWithNPI);

    // Notify user of success
    console.log(
      yellow(`Enrichment Success`),
      `\n JSON results written to:`, green(JSONDestinationPath),
      `\n CSV results written to:`, green(CSVDestinationPath)
    );
    console.timeEnd(' Total time:');
  });
} catch (e) {
  console.log(e);
}

