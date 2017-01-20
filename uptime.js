const express = require('express');
const app = express();
const thinky = require('./db/thinky');
const config = require('./config');

// API settings
const api = require('./routes/api');
const path = require('path');
app.use('/api', api);
app.set('views', './views');
app.set('view engine', 'hbs');

// Start server
app.listen(config.webPort, () => {
  console.log(`JSON API available at http://localhost:${config.webPort}/api`);
});

// Aggregates Instants and converts them into Days daily
const backup = require('./backup');

// Models
const Day = require('./models/Day');
const Instant = require('./models/Instant');
const Disconnect = require('./models/Disconnect');

// Uptime packages
const moment = require('moment');
const Log = require('./Log');
const log = new Log(config.timestamps);
const isConn = require('is-connected');
const isConnected = new isConn(config.interval);
let tracker = { start: '', stop: '', duration: '' };

// Functions
function logInstant(state) {
  new Instant({
    date: moment.utc().toISOString(),
    online: state
  }).saveAll().then(resolve => {
    if(state === 1) {
      log.db(`Internet Connected.  Successfully saved Instant to database as ${state}`);
    } else {
      log.db(`Internet Disconnected.  Successfully saved Instant to database as ${state}`);
    }
    
  }, reject => {
    if(state === 1) {
      log.error('Internet Connected.  Something went wrong, Instant not saved', 'DAT');
    } else {
      log.error('Internet Disconnected.  Something went wrong, Instant not saved', 'DAT');
    }
  });
}

// Events
isConnected.on('connected', () => {
  logInstant(1);
  if(tracker.start !== '' && tracker.stop === '') {
    tracker.stop = moment.utc();
    tracker.duration = tracker.stop.diff(tracker.start, 'seconds');
    if(tracker.duration >= 60) {
      new Disconnect({
        date: tracker.start.toISOString(),
        duration: tracker.duration
      }).saveAll().then(resolve => {
        log.db('Internet Connected.  Successfully saved Disconnect to database');
      }, reject => {
        log.error('Internet Connected.  Something went wrong, Disconnect not saved', 'DAT');
      });
      tracker = { start: '', stop: '', duration: '' };
    } else {
      log.system('Internet Connected.  Disconnect shorter than 1 minute, discarded.');
      tracker = { start: '', stop: '', duration: '' };
    }
  }
});

isConnected.on('disconnected', () => {
  logInstant(0);
  if(tracker.start === '') {
    tracker.start = moment.utc();
    log.warn('Internet Disconnected. Time recorded.');
  }
});

//Initialization
isConnected.init('dns', 'lookup');
