const findMatches = require('./findMatches.js');

const findDoctors = (doctors, callback, results = []) => {
  // Starting from the back
  const nextDoctor = doctors.pop();

  if (nextDoctor) {
    try {
      // Query ElasticSearch for doctor and push promise to results
      results.push(findMatches(nextDoctor));

      // Schedule next query
      setTimeout(findDoctors.bind(null, doctors, callback, results), 5);

    } catch(e) {
      console.log(e);
    }
  } else {
    // submit promise array to callback
    return callback(Promise.all(results));
  }
};

module.exports = findDoctors;
