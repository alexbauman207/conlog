const config = require('../config');
const thinky = require('thinky')({
  host: config.dbHost,
  port: config.dbPort,
  db: config.dbName
});

module.exports = thinky;
