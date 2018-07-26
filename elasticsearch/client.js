const { Client } = require('elasticsearch');

const AUTH = require('.../config.json');

const HOST = 'f8bbb4eeff7845c5a2444dcf0347a566.us-east-1.aws.found.io:9243';
const endpoint = `https://${AUTH.USER}:${AUTH.KEY}@${HOST}`;

const client = new Client({
  host: endpoint,
});

module.exports = client;
