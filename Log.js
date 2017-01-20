const moment = require('moment');
const Chalk = require('chalk');
const chalk = new Chalk.constructor();

class Log {
    constructor(doTimestamp){
        this.doTimestamp = doTimestamp ? doTimestamp : false;
    }

    get timestamp() {
        return this.doTimestamp === true ? `[${moment().format('YYYY/MM/DD H:mm:ss')}] ` : '';
    }

    warn(text, label = 'WRN') {
        this.log(text, chalk.bgYellow.black, label);
    }

    success(text, label = 'SUC') {
        this.log(text, chalk.bgGreen.black, label);
    }

    db(text, label = 'DAT') {
        this.log(text, chalk.bgBlue.black, label);
    }

    error(text, label = 'ERR') {
        this.log(text, chalk.bgRed.black, label);
    }

    debug(text, label = 'DBG') {
        this.log(text, chalk.bgBlack.gray, label);
    }

    system(text, label = 'SYS') {
        this.log(text, chalk.bgWhite.black, label);
    }

    log(text, color, label) {
        return console.log(this.timestamp + color(` ${label} `) + ` ${text}`);
    }
}

module.exports = Log;
