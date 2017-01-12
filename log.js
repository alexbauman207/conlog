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

routes = router.get('/', (req, res) => {
  thinky.r.table('Disconnect').orderBy('start').run((conn, results) => {
    res.status(200).json(results);
  });
})

app.use('/api/Disconnects', routes)
app.listen(8020, () => {
  console.log('App listening on port 8020');
})

// Model
const Disconnect = thinky.createModel('Disconnect', {
  stop: Date,
  start: Date
});
console.log("Beginning Internet check");

// Events
isConnectivity.on('connected', function connected() {
  if(start !== "" && stop === "") {
    stop = new Date();
    if(stop.getTime() - start.getTime() <= 60000) {
      console.log(`${new Date().toLocaleTimeString()} Outages under a minute are ignored.`)
      return;
    } else {
      let disconnect = new Disconnect({
        start: start,
        stop: new Date()
      });
      disconnect.saveAll().then(function(result) {
        console.log(`${new Date().toLocaleTimeString()} Saved to database with ID ${result.id}`);
      });
      start = "";
      stop = "";
    }
  } else {
    console.log(`${new Date().toLocaleTimeString()} Internet Connected`);
  }
});

isConnectivity.on('disconnected', function disconnected() {
  if(start === "") {
    start = new Date();
    console.log(`${new Date().toLocaleTimeString()} Disconnected, time recorded.`);
  } else {
    console.log(`${new Date().toLocaleTimeString()} Internet Not Connected`);
  }
});

// Initialize
isConnectivity.init('dns', 'lookup');
