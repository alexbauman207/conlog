# Uptime

A utility that checks for a connection to the internet and records to a RethinkDB database.  It also provides a read-only web API intended to integrate with [Cyclotron](http://www.cyclotron.io/).

## Requirements

* Node v.6.0 or above
* RethinkDB

## Installation

1. Install Node by *whatever means necessary*
2. Clone this repo to wherever you want, open a terminal in root directory, and `npm install`
3. Check out **config.json** and configure as needed.
4. `npm start` to start the monitoring, logging, and serving the API.  Optionally use [PM2](https://www.npmjs.com/package/pm2) to manage the process.
5. (Recommended) use [Cyclotron](http://www.cyclotron.io/) or similar to hook into the JSON API and generate graphs and dashboards from the data.

