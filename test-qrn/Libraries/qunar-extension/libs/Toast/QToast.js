/**
 *
 * @providesModule QToast
 */

'use strict';

var Platform = require('Platform');
var QRCTToastIOSManager = Platform.OS === 'ios'?require('NativeModules').QRCTToastIOSManager:null;
var RCTToastAndroid = require('ToastAndroid');
var warning = require('fbjs/lib/warning');
/**
 * This exposes the native ToastAndroid module as a JS module. This has a function 'show'
 * which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 * 2. int duration: The duration of the toast. May be QToast.SHORT or QToast.LONG
 * 3. int offSet: The offSet of the toast. May be QToast.TOP or QToast.MIDDLE or QToast.BOTTOM
 */
var QToastParam ={
    SHORT: -10000000001,
    LONG: -10000000002,
    TOP: -20000000001,
    MIDDLE: -20000000002,
    BOTTOM: -20000000003
}
var QToast = {

    SHORT: QToastParam.SHORT,
    LONG: QToastParam.LONG,
    TOP: QToastParam.TOP,
    MIDDLE: QToastParam.MIDDLE,
    BOTTOM: QToastParam.BOTTOM,

    show: function (message:string,
                    duration:number = QToast.SHORT,
                    offSet:number = QToast.MIDDLE):void {
        if (Platform.OS === 'ios') {
               var iOSOffSet;
               var iOSDuration ;

            switch (offSet){
                case QToastParam.TOP:
                    iOSOffSet = QRCTToastIOSManager.TOP;
                    break;

                case QToastParam.MIDDLE:
                    iOSOffSet = QRCTToastIOSManager.MIDDLE;
                    break;

                case QToastParam.BOTTOM:
                    iOSOffSet = QRCTToastIOSManager.BOTTOM;
                    break;

                default:
                    iOSOffSet = offSet;
            }

            switch (duration) {
                case QToastParam.SHORT:
                    iOSDuration = QRCTToastIOSManager.SHORT;
                    break;

                case QToastParam.LONG:
                    iOSDuration = QRCTToastIOSManager.LONG;
                    break;

                default:
                    iOSDuration = duration;
            }

            QRCTToastIOSManager.show(message, iOSDuration, iOSOffSet);

        } else if (Platform.OS === 'android') {

            if (duration === QToastParam.SHORT) {

                RCTToastAndroid.show(message, RCTToastAndroid.SHORT);

            } else if (duration === QToastParam.LONG) {

                RCTToastAndroid.show(message, RCTToastAndroid.LONG);

            } else {
                warning(false, 'Toast on Android is only supported SHORT & LONG.');

                RCTToastAndroid.show(message, RCTToastAndroid.SHORT);

            }

        }
    }
};

module.exports = QToast;
