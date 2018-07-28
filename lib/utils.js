const fs = require('fs');

const toUpper = (doctor) => {
  const newDoctor = {};

  Object.keys(doctor).forEach(property => {
    if (typeof doctor[property] === 'string') {
      newDoctor[property] = doctor[property].toUpperCase();
    } else {
      newDoctor[property] = doctor[property];
    }
  });
  return newDoctor;
};

const parseHit = (hit) => {
  if (!hit) return {
    NPI_score: null,
    NPI: null,
    NPI_firstName: null,
    NPI_lastName: null,
    NPI_middleName: null,
    NPI_gender: null,
    NPI_degree: null,
    NPI_address: null,
    NPI_city: null,
    NPI_state: null,
    NPI_zipCode: null,
  }

  const { _source, _score } = hit;
  return {
    NPI_score: _score,
    NPI: _source['NPI'],
    NPI_firstName: _source['Provider First Name'],
    NPI_lastName: _source['Provider Last Name (Legal Name)'],
    NPI_middleName: _source['Provider Middle Name'],
    NPI_gender: _source['Provider Gender Code'],
    NPI_degree: _source['Provider Credential Text'],
    NPI_address: _source['Provider First Line Business Practice Location Address'],
    NPI_city: _source['Provider Business Practice Location Address City Name'],
    NPI_state: _source['Provider Business Practice Location Address State Name'],
    NPI_zipCode: _source['Provider Business Practice Location Address Postal Code'],
  }
};

const parseResponses = (responses) => {
  responses.reverse();
  return responses.map(res => {
    const { hits: { hits } } = res;

    // return and parse the top hit
    return parseHit(hits[0]);
  })
}

const parseDoctors = (doctors, keys) => {
  return keys.map(key => {
    let { firstName, middleName, lastName, gender, degree } = doctors[key];
    if (gender === '') gender = 'null';
    return {
      key,
      firstName,
      middleName,
      lastName,
      gender,
      degree,
    }
  });
};

const writeToJSON = (path, doctors) => {
  fs.writeFileSync(path, JSON.stringify(doctors));
};

const getHeaders = (doctors) => {
  const headersObj = {};

  for (let doctor of doctors) {
    Object.keys(doctor).forEach(field => {
      if (!headersObj[field]) headersObj[field] = true;
    });
  }
  
  return Object.keys(headersObj);
}

const writeToCSV = (path, doctors) => {
  // create and write headers
  const keys = getHeaders(doctors);
  const headers = keys.map(field => `"${field}"`).join(',') + '\n';
  fs.writeFileSync(path, headers);

  // Batch records by 500 before appending them to .csv
  let batch = '';
  for (let i = 0; i < doctors.length; i++) {
    let record = doctors[i];
    let row = [];

    for (let j = 0; j < keys.length; j++) {
      let key = keys[j];
      row.push(JSON.stringify(typeof record[key] === 'object' 
        && record[key] !== null
        ? '[Object]' : record[key]));
    }
    batch += `${row.join(',')}\n`;
    if ((i + 1) % 500 === 0) {
      fs.appendFileSync(path, batch);
      batch = '';
    }
  }
  // Capture last batch
  fs.appendFileSync(path, batch);
};

const decorateWithNPI = (source, sourceKeys, decoration) => {
  const results = [];

  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];

    const newObject = Object.assign({}, source[key], decoration[i]);
    results.push(newObject);
  }
  return results;
};

module.exports = {
  toUpper,
  parseResponses,
  parseDoctors,
  writeToJSON,
  writeToCSV,
  decorateWithNPI,
};
