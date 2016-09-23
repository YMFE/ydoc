/**
 *
 * @providesModule QStorageManager
 * @flow
 */

'use strict';

var StorageManagerModule = require('NativeModules').StorageManager;


const QStorageManager = {

  saveData(module: string, key: string, storedObject: Object, callBack: Function, errCallBack: Function) {
    StorageManagerModule.saveData(module, key, storedObject, callBack, errCallBack);
  },


  removeData(module: string, key: string) {
    StorageManagerModule.removeData(module, key);
  },

  getData(module: string, key: string, type: string, callBack: Function, errCallBack: Function) {
    StorageManagerModule.getData(module, key, type, callBack, errCallBack);
  }
};

module.exports = QStorageManager;
