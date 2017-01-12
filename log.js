// Setting Variables
const IsConnected = require('is-connected');
const thinky = require('thinky')({
  db: 'conlog',
});
const isConnectivity = new IsConnected();
let start = "";
let end = "";

// Model
const Disconnect = thinky.createModel('Disconnect', {
  end: Date,
  start: Date,
});
console.log("Beginning Internet check");

// Events
isConnectivity.on('connected', function connected() {
  console.log(`${new Date().toLocaleTimeString()} Internet Connected`);
  if (start !== "" && end === "") {
    let disconnect = new Disconnect({
      start: start,
      end: new Date(),
    });
    disconnect.saveAll().then(function(result) {
      console.log(`${new Date().toLocaleTimeString()} Successfully saved to database with ID ${result.id}`);
    });
    start = "";
    end = "";
  }
});

isConnectivity.on('disconnected', function disconnected() {
  console.log(`${new Date().toLocaleTimeString()} Internet Not Connected`);
  if (start === "") {
    start = new Date();
    console.log(`${new Date().toLocaleTimeString()} Disconnected, time recorded.`);
  }
});

// Initialize
isConnectivity.init('dns', 'lookup');
