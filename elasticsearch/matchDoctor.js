const { parseHit } = require('../utils.js');
const findMatches = require('./findMatches.js');

const matchDoctor = async (doctor) => {

  findMatches()
  const matches = hits.map(hit => parseHit(hit));

};

module.exports = matchDoctor;