// -*- mode: web; -*-

/**
 * @providesModule qunar-react-native
 */

'use strict';

const React = require('react-native');

const QReactExtension = {
    get CameraRoll() { return require('./libs/CameraRoll/QCameraRoll');},
    get Hytive() { return require('./libs/Hytive/Hytive');},
    get TextInput() { return require('./libs/TextInput/QTextInput');},
    get ScrollView() { return require('./libs/ScrollView/ScrollView');},
    get RefreshControl() { return require('./libs/RefreshControl/RefreshControl');},
    get LoadControl() { return require('./libs/LoadControl/LoadControl');},
    get ImageUploader() { return require('./libs/ImageUploader/QImageUploader');},
    get CameraView() { return require('./libs/CameraView/QCameraView');},
    get Toast() { return require('./libs/Toast/QToast');},
    get Slider() { return require('./libs/Slider/QSlider');},
    get ProgressView() { return require('./libs/ProgressView/QProgressView');},
    get Tab(){ return require('./libs/Tab/Tab');},
    get TabBar() { return require('./libs/TabBar/QTabBar');},
    get Loading() { return require('./libs/Loading/Loading');},
    get QLoading() { return require('./libs/QLoading/QLoading');},
    get QLoadingError() { return require('./libs/QLoadingError/QLoadingError');},
    get Button() { return require('./libs/Button/Button');},
    get FontLoader() { return require('./libs/FontLoader/FontLoader');},
    get QHotDogNetWork() { return require('./libs/QHotDogNetWork/QHotDogNetWork');},
    get ListView() { return require('./libs/ListView/QListView');},
    get InfiniteListView() { return require('./libs/ListView/InfiniteListView');},
    get MapUtils() { return require('./libs/MapUtils/MapUtils');},
    get CookieManager() { return require('./libs/CookieManager/CookieManager');},
    get Picker() { return require('./libs/QPicker/QPicker');},
    get PickerView() { return require('./libs/QPicker/PickerAndroid');},
    get TimePicker() { return require('./libs/QTimePicker/QTimePicker');},
    get LoginManager() { return require('./libs/QLoginManager/QLoginManager');},
    get Checked() { return require('./libs/Checked/Checked');},
    get Radio() { return require('./libs/Radio/Radio');},
    get DeviceInfo() { return require('NativeModules').QRCTDeviceInfo;},
    get EventEmitter() { return require('EventEmitter');},
    get UELog() {return require('./libs/UELog/QUELog');},
    get CVParam() {return require('./libs/CVParam/QCVParam');},
    get TouchableCustomFeedback() { return require('./libs/TouchableCustomFeedback/TouchableCustomFeedback.js');},
    get QStatusBar() {return require('./libs/QStatusBar/QStatusBar.js')},
    get ABTest() {return require('./libs/ABTest/QABTest.js');},
    get QShare() {return require('./libs/QShare/QShare.js')},
    get Modal() {return require('./libs/Modal/Modal.js');},
    get QStorageManager() {return require('./libs/QStorageManager/QStorageManager.js')},
};

// polyfill 里面的 Object.assign 不支持 getter/setter

let QunarReactNative = {};

[React, QReactExtension].map((module) => {
    for (let prop in module) {
        if (module.hasOwnProperty(prop)) {
            Object.defineProperty(QunarReactNative, prop, Object.getOwnPropertyDescriptor(module, prop));
        }
    }
});

module.exports = QunarReactNative;
