const matchDoctor = require('./matchDoctor.js');

const matchDoctors = async (doctors) => {
  try {
    const result = await matchDoctor(doctors[2007]);
    console.log(result);
  } catch (e) {
    console.log('error!', e);
  }
};

module.exports = matchDoctors;