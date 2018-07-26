const { toUpper } = require('../utils.js');
const client = require('./client.js');

const findMatches = async (doctor) => {
  const { firstName, middleName, lastName, gender } = toUpper(doctor);

  client.search({
    index: 'doctors',
    size: 10,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'Provider Last Name (Legal Name)': lastName } },
          ],
          should: [
            { match: { 'Provider First Name': firstName } },
            { match: { 'Provider Gender Code': gender } },
            { match: { 'Provider Middle Name': middleName } },
          ]
        }
      }
    }
  });
};

module.exports = findMatches;
