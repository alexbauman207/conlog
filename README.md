# Conlog

A utility written in Javascript for Node.js that monitors internet connectivity and records periods of downtime.

## Requirements

* Node 6.2.0
* npm 3.8.9

## Installation

1. Clone this repo.
2. Navigate to wherever you saved the repo on your hard drive in your choice of terminal.
3. Type ```npm install``` to install dependencies.*


*Note: this program uses a modified version of [is-connected](https://www.npmjs.com/package/is-connected).
Some changes to that library are required to get this running.

1. From the Conlog directory, navigate to /node_modules/is-connected/index.js.
2. Change ```const resolve = require('dns').resolve;``` to ```const resolve = require('dns').lookup;```.
3. Optionally, change checkInterval to your liking.  For reference, 1000 = 1 second.

## Usage

```node log.js```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
