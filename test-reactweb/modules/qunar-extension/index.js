// -*- mode: web; -*-

/**
 * @providesModule qunar-react-native
 * @includeModules @qnpm/react-native-ext
 */
'use strict';

var ReactNative = require('react-native');
var NativeModules = require('NativeModules')
require('QNativeModules')
NativeModules.QRCTDeviceInfo = {}
NativeModules.QRCTABTest = require('ABTest')
NativeModules.QShareManager = require('QShare')
NativeModules.QRCTPhotoManager = require('CameraRoll')

const QReactExtension = {
    // get CameraRoll() { return require('./libs/CameraRoll/QCameraRoll');},
    // get Hytive() { return require('./libs/Hytive/Hytive');},
    // get TextInput() { return require('./libs/TextInput/QTextInput');},
    // get ScrollView() { return require('./libs/ScrollView/ScrollView');},
    // get RefreshControl() { return require('./libs/RefreshControl/RefreshControl');},
    // get LoadControl() { return require('./libs/LoadControl/LoadControl');},
    // get ImageUploader() { return require('./libs/ImageUploader/QImageUploader');},
    // get CameraView() { return require('./libs/CameraView/QCameraView');},



    // 在此存放QRN扩展或新增的组件或api （QRN 1.4.0）

    // componenets
    // 组件中ScrollView，Loading，QLoading，Checked，Modal是react-web为适应重写或更改的，其他组件直接引用的QRN
    get ScrollView() {return require('QScrollView');},
    get RefreshControl() {return require('QRefreshControl');},
    get LoadControl (){return require('QLoadControl')},
    get ListView() { return require('QListView');},
    get InfiniteListView() {return require('InfiniteListView');},

    get Loading() { return require('Loading');},
    get ProgressView() { return require('QProgressView');},
    get QLoading() { return require('QLoading');},
    get QLoadingError() { return require('QLoadingError');},

    get Button() { return require('../../../Libraries/qunar-extension/libs/Button/Button');},
    get Checked() { return require('Checked');},
    get Radio() { return require('Radio');},

    get Tab(){ return require('Tab');},
    get TabBar() { return require('QTabBar');},
    get TabBarItem() { return require('QTabBarItem');},

    get Slider() { return require('QSlider');},
    get TimePicker() {return require('DatePicker');},
    get Modal (){return require('Modal')},

    //  apis
    get DeviceInfo() { return require('DeviceInfo'); },
    get LoginManager() {return require('QLoginManager');},
    get CameraRoll() { return require('CameraRoll'); },
    get ImageUploader() { return require('ImageUploader'); },
    get Toast (){return require('Toast')},
    get QHotDogNetWork() { return require('QHotDogNetWork'); },
    get MapUtils() {return require('MapUtils'); },
    get UELog() {return require('UELog')},
    get CVParam() {return require('CVParam')},
    get Geolocation() {return require('Geolocation')},
    get QStatusBar() {return require('QStatusBar')},
    get ABTest() {return require('ABTest')},
    get QShare() {return require('QShare');},


    // 其他
    get TouchableCustomFeedback() { return require('TouchableCustomFeedback');},
    get QStorageManager() {return require('QStorageManager')},
    get TimePickerView() {return ReactNative.TimePicker},
    get EventEmitter() { return require('EventEmitter');},
    get ListViewDataSource() { return require('./libs/ListView/QListViewDataSource');},
};

let QunarReactNative = {};

[ReactNative, QReactExtension].map((module) => {
    for (let prop in module) {
        if (module.hasOwnProperty(prop)) {
            Object.defineProperty(QunarReactNative, prop, Object.getOwnPropertyDescriptor(module, prop));
        }
    }
});

module.exports = QunarReactNative;
