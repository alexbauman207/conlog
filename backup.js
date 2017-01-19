const thinky = require('./db/thinky');
const r = thinky.r;
const moment = require('moment');
const config = require('./config');
const Log = require('./Log');
const log = new Log(config.timestamps);

// Models
const Day = require('./models/Day');
const Instant = require('./models/Instant');
const Disconnect = require('./models/Disconnect');
let check = '';
let yesterday = '';

// Every night between 12 and 1 AM, aggregates yesterday's Instants into a Day
setInterval(() => {
  if(moment().hour() === 0) {
    check = moment.utc();
    yesterday = moment.utc().subtract(1, 'days');
    r.table('instants').filter(
      r.row('date').during(
        r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), 0, 0, 0, config.offset),
        r.time(check.year(), check.month() + 1, check.date(), 0, 0, 0, config.offset)
      )
    ).map(row => {
      return { totalOnline: doc('online'), count: 1 };
    }).reduce((left, right) => {
      return {
        totalOnline: left('totalOnline').add(right('totalOnline')),
        count: left('count').add(right('count'))
      };
    }).do(res => {
      return {
        date: r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), config.offset),
        online: res('totalOnline').div(res('count'))
      };
    }).run().then(results => {
      new Day({
        date: results.date,
        online: results.online
      }).saveAll().then(resolve => {
        log.db(`Yesterday's data saved: Average uptime was ${resolve.online * 100}%`);
        r.table('instants').filter(
          r.row('date').during(
            r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), 0, 0, 0, config.offset),
            r.time(check.year(), check.month() + 1, check.date(), 0, 0, 0, config.offset)
          )
        ).delete().run().then(result => {
          log.db(`Yesterday's data deleted from Instants`);
        }, reject => {
          log.error(`Failed deleting entries: ${reject}`, 'DAT');
        })
      }, reject => {
        log.error(`Failed saving entries: ${reject}`, 'DAT');
      })
    }, reject => {
      log.error(`Failed querying database: ${reject}`, 'DAT');
    })
  }
}, 3600000);
