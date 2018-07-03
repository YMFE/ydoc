const util = require('util');
const color = require('bash-color');

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

const COLORS = {
  DEBUG: color.purple,
  INFO: color.cyan,
  WARN: color.yellow,
  ERROR: color.red
}

/**
 * const log = new logger();
 * api:
 *  log.debug(msg)
 *  log.info(msg)
 *  log.warn(msg)
 *  log.error(msg)
 */

class logger {
  constructor(logLevel) {
    this.lastChar = "\n";
    this.levelsByValue = {};
    this.setLevel(logLevel || 'info');
    for (let levelKey in LEVELS) {
      let level = LEVELS[levelKey];
      levelKey = levelKey.toLowerCase();
      this[levelKey] = (...args) => {        
        args.unshift(level);
        this._logLn.apply(this, args)
      }
      this.levelsByValue[level] = levelKey.toUpperCase();
    }
  }

  _stdout(msg){
    process.stdout.write(msg);
  }

  setLevel(logLevel) {
    logLevel = logLevel || 'INFO';
    this.logLevel = LEVELS[logLevel.toUpperCase()];
  }

  getLevel(logLevel) {
    return this.logLevel;
  }

  _write(msg) {
    msg = msg.toString();
    this.lastChar = msg[msg.length - 1];
    return this._stdout(msg);
  }

  _format() {
    return util.format.apply(util, arguments)
  }

  _log(level, ...args) {
    if (level < this.logLevel) return;
    let levelKey = this.levelsByValue[level];
    let msg = this._format.apply(util, args);
    
    if (this.lastChar == '\n') {
      msg = COLORS[levelKey](levelKey.toLowerCase() + ':') + ' ' + msg;
    }
    return this._write(msg);
  }

  ok(...args) {
    let msg = this._format.apply(util, args);
    if (args.length > 0) {
        this._logLn(LEVELS.INFO, color.green('>> ') + msg.trim().replace(/\n/g, color.green('\n>> ')), color.green('OK'));
    } else {
        this._log(LEVELS.INFO, color.green('OK'), '\n');
    }
  }

  _logLn(...args) {
    if (this.lastChar != '\n') this._write('\n');
    args.push('\n');
    return this._log.apply(this, args);
  }
}

module.exports = logger;