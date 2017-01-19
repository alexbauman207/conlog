const thinky = require('../db/thinky');
const type = thinky.type;

const Day = thinky.createModel('days', {
  date: type.date(),
  online: type.number().min(0).max(1)
}, { pk: 'date' });

module.exports = Day;
