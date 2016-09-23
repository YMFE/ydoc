/**
 *
 * @providesModule UELog
 */

'use strict';

var Platform = require('Platform');
var QRNUelog = Platform.OS === 'ios'?require('NativeModules').QRNUelog:require('NativeModules').QRNUeLog;

const QUELog = {
  /**
   * @param {Array<string>} logs
   **/
  log: function(logs) {
    QRNUelog.log(logs);
  },

  /**
   * @param string log
   **/
  logOrigin: function(log) {
    QRNUelog.logOrigin(log);
  }
};

module.exports = QUELog;
