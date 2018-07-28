const { toUpper } = require('../lib/utils.js');
const client = require('./client.js');

/*
  Matching Strategy:
  must match last name
  must match on firstName
  must be in the state of New York
  fuzzy match on degree
  fuzzy match on middleName
  fuzzy match on gender
*/

// returns a promise
const findMatches = (doctor) => {
  const { firstName, middleName, lastName, gender, degree } = toUpper(doctor);

  return client.search({
    index: 'doctors',
    size: 1,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'Provider First Name': firstName } },
            { match: { 'Provider Last Name (Legal Name)': lastName } },
          ],
          should: [
            { 
              match: {
                'Provider Middle Name': {
                  query: middleName,
                  'fuzziness': 'AUTO',
                }
              } 
            },
            { 
              match: {
                'Provider Gender Code': {
                  query: gender,
                  'fuzziness': 'AUTO',
                }
              }
            },
            {
              match: {
                'Provider Credential Text': {
                  query: degree,
                  'fuzziness': 'AUTO',
                }
              }
            }
          ]
        }
      }
    }
  });
};

module.exports = findMatches;
