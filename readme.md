<h1 align="center">Uptime</h1>

<p align="center">
  <img src="http://i.imgur.com/HWIer6p.jpg" />
</p>

<p align="center">
  <a href="https://codeclimate.com/github/arbauman/Uptime"><img src="https://img.shields.io/codeclimate/github/arbauman/Uptime.svg?style=flat-square" alt="Code Climate" /></a>
  <a href="https://github.com/arbauman/Uptime/issues"><img src="https://img.shields.io/github/issues-raw/arbauman/Uptime.svg?style=flat-square" alt="" /></a>
  <a href="https://github.com/arbauman/Uptime/graphs/contributors"><img src="https://img.shields.io/github/contributors/arbauman/Uptime.svg?style=flat-square" alt="GitHub contributors" /></a>
  <a href="https://github.com/arbauman/Uptime/blob/master/license"><img src="https://img.shields.io/github/license/arbauman/Uptime.svg?style=flat-square" alt="license" /></a>
</p>

A utility that checks for a connection to the internet and records to a RethinkDB database.  It also provides a read-only web API intended to integrate with [Cyclotron](http://www.cyclotron.io/).

## Requirements

* Node v6.0 or above
* RethinkDB

## Installation

1. Install Node by *whatever means necessary*
2. Clone this repo to wherever you want, open a terminal in root directory, and `npm install`
3. Check out **config.json** and configure as needed.
4. `npm start` to start the monitoring, logging, and serving the API.  Optionally use [PM2](https://www.npmjs.com/package/pm2) to manage the process.
5. (Recommended) use [Cyclotron](http://www.cyclotron.io/) or similar to hook into the JSON API and generate graphs and dashboards from the data.

## API

Upon running Uptime, you'll be greeted with a message directing you to the homepage for the API.  This is a convenience, providing a simple list of links to the various URIs.

##### /api/rolling/

```js
// The most recent 240 Instants
[{
  "date": // ISO 8601 String => 2014-09-08T08:02:17-05:00
  "online": // Integer, 1 if connected, 0 if disconnected
}]
```

##### /uptime/today/

```js
// All of today's Instants averaged
{
  "date": // ISO 8601 String => 2014-09-08T08:02:17-05:00
  "offline": // Float, Percentage
  "online": // Float, Percentage
}
```

##### /uptime/daily/

```js
// All Instants averaged by day
[{
  "date": // ISO 8601 String => 2014-09-08T08:02:17-05:00
  "offline": // Float, Percentage
  "online": // Float, Percentage
}]
```

##### /uptime/monthly/

```js
// All Instants averaged by month
[{
  "date": // Integer, representing the month of the year.  1 for Jan, 12 for Dec
  "offline": // Float, Percentage
  "online": // Float, Percentage
}]
```

##### /uptime/yearly/

```js
// All Instants averaged by year
[{
  "date": // Integer, representing the year
  "offline": // Float, Percentage
  "online": // Float, Percentage
}]
```

##### /disconnects/daily/

```js
// All Disconnects averaged, summed, and counted by day
[{
  "date": // ISO 8601 String => 2014-09-08T08:02:17-05:00
  "avgDuration": // Float, seconds
  "totalDuration": // Float, seconds
  "count": // Integer, number of disconnects on that day
}]
```

##### /disconnects/monthly/

```js
// All Disconnects averaged, summed, and counted by month
[{
  "date": // Integer, representing the month of the year.  1 for Jan, 12 for Dec
  "avgDuration": // Float, seconds
  "totalDuration": // Float, seconds
  "count": // Integer, number of disconnects on that day
}]
```

##### /disconnects/yearly/

```js
// All Disconnects averaged, summed, and counted by year
[{
  "date": // Integer, representing the year
  "avgDuration": // Float, seconds
  "totalDuration": // Float, seconds
  "count": // Integer, number of disconnects on that day
}]
```

##### /lifetime/disconnects/

```js
// Total count of all disconnects and total offline seconds
{
  "count": // Integer, number of disconnects
  "duration": // Integer, number of seconds disconnected
}
```