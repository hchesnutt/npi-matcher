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
  const { _source, _score } = hit;
  return {
    score: _score,
    NPI: _source['NPI'],
    firstName: _source['Provider First Name'],
    lastName: _source['Provider Last Name (Legal Name)'],
    middleName: _source['Provider Middle Name'],
    gender: _source['Provider Gender Code'],
  }
};

module.exports = {
  toUpper,
  parseHit,
}