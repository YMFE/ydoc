/**
 *
 * @providesModule QStatusBar
 */

'use strict';

var QRCTStatusBarManager = require('NativeModules').QRCTStatusBarManager;

var isIOS = !!(require('Platform').OS === 'ios');

const QStatusBar = {

    setHidden(hidden: boolean, callback: Function, errorCallback: Function) {
        QRCTStatusBarManager.setHidden(hidden, callback, errorCallback);
    },

    setStyle(style: string, callback: Function, errorCallback: Function) {
        if (isIOS) {
            QRCTStatusBarManager.setStyle(style, callback, errorCallback);
        } else {
            throw 'Android不支持 QStatusBar.setStyle !';
        }
    },

    setColor(color: string, animated: boolean, callback: Function, errorCallback: Function) {
        if (!isIOS) {
            QRCTStatusBarManager.setColor(color, animated, callback, errorCallback);
        } else {
            throw 'iOS不支持 QStatusBar.setColor !';
        }
    },

    setTranslucent(translucent: boolean, callback: Function, errorCallback: Function) {
        if (!isIOS) {
            QRCTStatusBarManager.setTranslucent(translucent, callback, errorCallback);
        } else {
            throw 'iOS不支持 QStatusBar.setTranslucent !';
        }
    }
};

module.exports = QStatusBar;
