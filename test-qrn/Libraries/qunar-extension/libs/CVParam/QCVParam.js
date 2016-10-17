/**
 *
 * @providesModule CVParam
 */

'use strict';

import {QRCTCVParam} from 'NativeModules';

const CVParam = {

  /**
   * @param object data
   * @param function callback
   * @param function errorCallback
   **/
  getCVParam: function(data, callback, errorCallback) {
    QRCTCVParam.getCVParam(data, callback, errorCallback)
  }
};

module.exports = CVParam;
