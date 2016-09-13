var fs = require('fs');
let IsConnected = require('is-connected');
let isConnectivity = new IsConnected();
var tmp_start = "";
var tmp_end = "";
var read_start = "";
var read_end = "";

console.log("Beginning Internet check");

isConnectivity.on('connected', function connected() {
    console.log(`${new Date().toLocaleTimeString()}internet connected`);
    if (tmp_start !== "" && tmp_end === "") {
        tmp_end = ~~(Date.now()/1000);
        read_end = new Date().toLocaleTimeString();
        let date = new Date().toLocaleDateString();
        let output = `On ${date}, the internet was down for ${((tmp_end - tmp_start) / 60).toFixed(2)} minutes between ${read_start} and ${read_end}\n`;
        fs.appendFile(`logs/${String(date).split("/").join("-")}.txt`, output, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("Log Updated!")
        });
        tmp_start = "";
        tmp_end = "";
    }

});

isConnectivity.on('disconnected', function disconnected() {
    console.log('internet not connected');
    if (tmp_start === "") {
        tmp_start = ~~(Date.now()/1000);
        read_start = new Date().toLocaleTimeString();
        console.log("Disconnected.  Time recorded.");
    }

});

isConnectivity.init('dns');
