/**
 *
 * @providesModule ABTest
 */

'use strict';

import {QRCTABTest} from 'NativeModules';

const ABTest = {

  /**
   * @param String abId 实验ID
   * @param String simpleName 使用该策略信息的来源(e.g. : vc name or class name),用于记录Log.
   * @param function callback 成功回调
   * @param function errorCallback 失败回调
   **/
  abTest: function(abId, simpleName, callback, errorCallback) {
    QRCTABTest.abTest(abId, simpleName, callback, errorCallback)
  }
};

module.exports = ABTest;
