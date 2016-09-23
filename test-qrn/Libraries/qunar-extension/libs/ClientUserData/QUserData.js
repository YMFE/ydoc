/**
 * @providesModule ClientUserData
 * @flow
 */
'use strict';

var  ClientUserDataIOS = require('NativeModules').ClientUserData;

var ClientUserData = {
  getUserData: function(data) {
    ClientUserDataIOS.getUserData(data);
  }
};

module.exports = ClientUserData;
