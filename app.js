// Setting Variables
const IsConnected = require('is-connected');
const app = require('express')();
const router = require('express').Router();
const thinky = require('thinky')({
  db: 'conlog'
});
const isConnectivity = new IsConnected();
let start = "";
let stop = "";

router.route('/disconnects').get((req, res) => {
  thinky.r.table('disconnects').orderBy('start').run((conn, results) => {
    res.status(200).json(results);
  });
});
router.route('/hourly').get((req, res) => {
  thinky.r.table('hourly').orderBy('date').run((conn, results) => {
    res.status(200).json(results);
  });
});
router.route('/status').get((req, res) => {
  thinky.r.table('status').orderBy('time').run((conn, results) => {
    res.status(200).json(results);
  });
});

app.use('/api', router);
app.listen(8020, () => {
  console.log('App listening on port 8020');
})

// Models
const Disconnect = thinky.createModel('disconnects', {
  stop: Date,
  start: Date
});
const Hourly = thinky.createModel('hourly', {
  date: Date,
  hour: Number,
  minutes: Number
});
const Status = thinky.createModel('status', {
  time: Date,
  online: Boolean
});
console.log("Beginning Internet check");

// Events
isConnectivity.on('connected', function connected() {
  let status = new Status({
    time: new Date(),
    online: true
  }).saveAll().then((result) => {
    console.log(`${new Date().toLocaleTimeString()} Internet connected. Status saved as ${result.online}`);
  });
  if(start !== "" && stop === "") {
    stop = new Date();
    let minutes = ((stop.getTime() - start.getTime()) / 1000 / 60).toFixed(2);
    if(minutes < 1) {
      console.log(`${new Date().toLocaleTimeString()} Outages under a minute are ignored.`);
      start = "";
      stop = "";
      return;
    } else {
      let disconnect = new Disconnect({
        start: start,
        stop: new Date()
      }).saveAll().then((result) => {
        console.log(`${new Date().toLocaleTimeString()} Saved to disconnects with ID ${result.id}`);
      });
      let hourly = new Hourly({
        date: start,
        hour: start.getHours(),
        minutes
      }).saveAll().then((result) => {
        console.log(`${new Date().toLocaleTimeString()} Saved to hourly with ID ${result.id}`);
      });
      start = "";
      stop = "";
    }
  }
});

isConnectivity.on('disconnected', function disconnected() {
  let status = new Status({
    time: new Date(),
    online: false
  }).saveAll().then((result) => {
    console.log(`${new Date().toLocaleTimeString()} Internet disconnected. Status saved as ${result.online}`);
  });
  if(start === "") {
    start = new Date();
    console.log(`${new Date().toLocaleTimeString()} Disconnected, time recorded.`);
  }
});

// Initialize
isConnectivity.init('dns', 'lookup');
