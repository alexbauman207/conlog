const thinky = require('../db/thinky');
const type = thinky.type;

const Disconnect = thinky.createModel('disconnects', {
  date: type.date(),
  duration: type.number()
}, { pk: 'date' });

module.exports = Disconnect;
