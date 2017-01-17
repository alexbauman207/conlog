// Setting Variables
const IsConnected = require('is-connected');
const moment = require('moment')
const app = require('express')();
const router = require('express').Router();
const thinky = require('thinky')({
  db: 'conlog'
});
const r = thinky.r;
const isConnectivity = new IsConnected(30000);
let start = "";
let stop = "";

router.route('/status').get((req, res) => {
  r.table('status').orderBy(r.desc('date')).limit(2880).run().then(results => {
    res.status(200).json(results);
  });
});
router.route('/days').get((req, res) => {
  r.table('status').orderBy(r.desc('date')).limit(366).run().then(results => {
    res.status(200).json(results);
  });
});

app.use('/api', router);
app.listen(8020, () => {
  console.log('App listening on port 8020');
});

// Models
const Status = thinky.createModel('status', {
  date: Date,
  online: Number
}, { pk: 'date' });
const Days = thinky.createModel('days', {
  date: Date,
  online: Number
}, { pk: 'date' });

// restructure
// 10-sec > 1 day
setInterval(() => {
  if(moment().hour() === 0) {
    let check = moment.utc();
    let yesterday = moment().utc().subtract(1, 'days');
    r.table('status').filter(
      r.row('date').during(
                           r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), 0, 0, 0, '-05:00'), 
                           r.time(check.year(), check.month() + 1, check.date(), 0, 0, 0, '-05:00')
                           )
    ).map(function(doc) {
      return { totalOnline: doc('online'), count: 1 };
    }).reduce(function(left, right) {
      return {
        totalOnline: left('totalOnline').add(right('totalOnline')),
        count: left('count').add(right('count'))
      };
    }).do(function(res) {
      return {
        date: r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), 'Z'),
        online: res('totalOnline').div(res('count'))
      };
    }).run().then(result => {
      new Days({
        date: result.date,
        online: result.online
      }).saveAll().then((gotBack) => {
        console.log(`${moment().format('h:mm:ss A')} Yesterday's data saved: online ${gotBack.online * 100}%`);
        r.table('status').filter(
          r.row('date').during(
                               r.time(yesterday.year(), yesterday.month() + 1, yesterday.date(), 0, 0, 0, '-05:00'), 
                               r.time(check.year(), check.month() + 1, check.date(), 0, 0, 0, '-05:00')
                               )
        ).delete().run().then(result => {
          console.log(`${moment().format('h:mm:ss A')} Yesterday's entries deleted from Status`)
        }, reject => {
          console.log(`Failed deleting yesterday's entries: ${reject}`)
        })
      }, reject => {
        console.log(`Couldn't save Days: ${reject}`);
      })
    }, reject => {
      console.log(`Rethink query failed: ${reject}`)
    })
  }
}, 3600000)


console.log(`${moment().format('h:mm:ss A')} Beginning Internet check`);
// Events
isConnectivity.on('connected', function connected() {
  new Status({
    date: moment(),
    online: 1
  }).saveAll().then((result) => {
    console.log(`${moment().format('h:mm:ss A')} Internet connected. Status saved as ${result.online}`);
  });
});

isConnectivity.on('disconnected', function disconnected() {
  new Status({
    date: moment(),
    online: 0
  }).saveAll().then((result) => {
    console.log(`${moment().format('h:mm:ss A')} Internet disconnected. Status saved as ${result.online}`);
  });
});

// Initialize
isConnectivity.init('dns', 'lookup');
