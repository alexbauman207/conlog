const thinky = require('../db/thinky');
const type = thinky.type;

const Instant = thinky.createModel('instants', {
  date: type.date(),
  online: type.number().min(0).max(1).integer()
}, { pk: 'date' });

module.exports = Instant;
