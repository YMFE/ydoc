module.exports = function(){
    return {
        "name": "Qunar React Native for Web",
        "examplePath": "./test-reactweb/examples/",
        "dest": "./_docs-reactweb",
        "common": {
            "title": "Qunar React Native for Web",
            "footer": "© 2016 <a href=\"http://gitlab.corp.qunar.com/mfe/qdoc\">YMFE</a> Team. Build by <a href=\"https://github.com/YMFE/ydoc\">ydoc</a>.",
            "home": "YMFE",
            "homeUrl": "http://ued.qunar.com/ymfe/",
            "navbars": []
        },
        "resources": {
            "images": './test-reactweb/docs/images/',
            "demo":'./test-reactweb/docs/demo/'
        },
        "pages": [
            {
            //   "name": "index",
            //   "title": "简介",
            //   "banner": {
            //       "title": "Qunar React Native for Web",
            //       "description": "简介"
            //   },
            //   "content":'./test-reactweb/README.md',
            //   "options": {
            //       "menuLevel": 2
            //   }
            // },
            // {
            //   "name": "start",
            //   "title": "起步",
            //   "banner": {
            //       "title": "起步",
            //       "description": "起步"
            //   },
            //   "content":'./test-reactweb/docs/start.md',
            //   "options": {
            //       "menuLevel": 2
            //   }
            // },
            // {
            //    "name": "develop",
            //    "title": "开发",
            //    "banner": {
            //         "title": "开发",
            //         "description": "开发"
            //     },
            //    "content": "./test-reactweb/docs/develop.md"
            // },
            // {
            //    "name": "publish",
            //    "title": "发布",
            //    "banner": {
            //         "title": "发布",
            //         "description": "发布"
            //     },
            //    "content":"./test-reactweb/docs/publish.md"
            // },
            // {
                "name": "component",
                "title": "组件",
                "banner": {
                    "title": "Qunar React Native for Web 组件",
                    "description": "组件"
                },
                "content": {
                    "type": "blocks",
                    "sidebar": true,
                    "multi": true,
                    "index": "./test-reactweb/components/README.md",
                    "pages": [{
                    //     "name": "ActivityIndicator",
                    //     "content": "./test-reactweb/components/ActivityIndicator/index.js"
                    // },{
                    //     "name": "ActionSheet",
                    //     "content": "./test-reactweb/components/ActionSheet/ActionSheet.js"
                    // },{
                    //     "name": "Alert",
                    //     "content": "./test-reactweb/components/Alert/Alert.js"
                    // },{
                    //     "name": "DatePicker",
                    //     "content": "./test-reactweb/components/DatePicker/index.js"
                    // },{
                    //     "name": "Image",
                    //     "content": "./test-reactweb/components/Image/index.js"
                    // },{
                    //     "name": "Picker",
                    //     "content": "./test-reactweb/components/Picker/index.js"
                    // },{
                    //     "name": "ListView",
                    //     "content": "./test-reactweb/components/ListView/ListView.md"
                    // },{
                    //     "name": "ListView.DataSource",
                    //     "content": "./test-reactweb/components/ListView/ListViewDataSource.md"
                    // },{
                    //     "name": "Modal",
                    //     "content": "./test-reactweb/components/Modal/index.js"
                    // },{
                        "name": "Navigator",
                        "content": "./test-reactweb/components/Navigator/index.js"
                    },{
                        "name": "Navigator.NavigatorBar",
                        "content": "./test-reactweb/components/Navigator/NavigatorNavigationBar.js"
                    // },{
                    //     "name": "ProgressBar",
                    //     "content": "./test-reactweb/components/ProgressBar/ProgressBar.js"
                    // },{
                    //     "name": "ScrollView",
                    //     "content": "./test-reactweb/components/QScrollView/index.js"
                    // },{
                    //     "name": "Switch",
                    //     "content": "./test-reactweb/components/Switch/Switch.js"
                    // },{
                    //     "name": "Text",
                    //     "content": "./test-reactweb/components/Text/index.js"
                    // },{
                    //     "name": "TextInput",
                    //     "content": "./test-reactweb/components/TextInput/index.js"
                    // },{
                    //     "name": "TimePicker",
                    //     "content": "./test-reactweb/components/DatePicker/index.js"
                    // },{
                    //     "name": "Toast",
                    //     "content": "./test-reactweb/components/Toast/Toast.js"
                    // },{
                    //     "name": "TouchableHighlight",
                    //     "content": "./test-reactweb/components/Touchable/TouchableHighlight.js"
                    // },{
                    //     "name": "TouchableOpacity",
                    //     "content": "./test-reactweb/components/Touchable/TouchableOpacity.js"
                    // },{
                    //     "name": "TouchableWithoutFeedback",
                    //     "content": "./test-reactweb/components/Touchable/TouchableWithoutFeedback.js"
                    // },{
                    //     "name": "View",
                    //     "content": "./test-reactweb/components/View/index.js"
                    // },{
                    //     "name": "ViewPager",
                    //     "content": "./test-reactweb/components/ViewPager/ViewPager.js"
                    // },{
                    //     "name": "WebView",
                    //     "content": "./test-reactweb/components/WebView/index.js"
                    }]
                }
            // },
            // {
            //     "name": "api",
            //     "title": "API",
            //     "banner": {
            //         "title": "Qunar React Native for Web API",
            //         "description": "API"
            //     },
            //     "content": {
            //         "type": "blocks",
            //         "sidebar": true,
            //         "multi": true,
            //         "index": "./test-reactweb/apis/README.md",
            //         "pages": [{
            //             "name": "AppRegistry",
            //             "content": "./test-reactweb/apis/AppRegistry/AppRegistry.js"
            //         },{
            //             "name": "AppState",
            //             "content": "./test-reactweb/apis/AppState/AppState.js"
            //         },{
            //             "name": "Animated",
            //             "content": "./test-reactweb/apis/Animated/README.md"
            //         },{
            //             "name": "AsyncStorage",
            //             "content": "./test-reactweb/apis/AsyncStorage/index.js"
            //         },{
            //             "name": "Clipboard",
            //             "content": "./test-reactweb/apis/Clipboard/Clipboard.js"
            //         },{
            //             "name": "Dimensions",
            //             "content": "./test-reactweb/apis/Dimensions/index.js"
            //         },{
            //             "name": "Fetch",
            //             "content": "./test-reactweb/apis/Fetch/README.md"
            //         },{
            //             "name": "ImageEditor",
            //             "content": "./test-reactweb/apis/ImageEditor/ImageEditor.js"
            //         },{
            //             "name": "ImageStore",
            //             "content": "./test-reactweb/apis/ImageStore/ImageStore.js"
            //         },{
            //             "name": "ImagePicker",
            //             "content": "./test-reactweb/apis/ImagePicker/ImagePicker.js"
            //         },{
            //             "name": "Geolocation",
            //             "content": "./test-reactweb/apis/Geolocation/index.js"
            //         },{
            //             "name": "Linking",
            //             "content": "./test-reactweb/apis/Linking/index.js"
            //         },{
            //             "name": "StyleSheet",
            //             "content": "./test-reactweb/apis/StyleSheet/StyleSheet.js"
            //         },{
            //             "name": "NetInfo",
            //             "content": "./test-reactweb/apis/NetInfo/index.js"
            //         },{
            //             "name": "NativeModules",
            //             "content": "./test-reactweb/apis/NativeModules/NativeModules.js"
            //         },{
            //             "name": "NativeModules.UIManager",
            //             "content": "./test-reactweb/apis/UIManager/index.js"
            //         },{
            //             "name": "NativeModules.NativeAPI",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/QNativeModules.js"
            //         },{
            //             "name": "PanResponder",
            //             "content": "./test-reactweb/apis/PanResponder/index.js"
            //         },{
            //             "name": "PixelRatio",
            //             "content": "./test-reactweb/apis/PixelRatio/index.js"
            //         },{
            //             "name": "Vibration",
            //             "content": "./test-reactweb/apis/Vibration/Vibration.js"
            //         }]
            //     }
            // },
            // {
            //     "name": "extension",
            //     "title": "扩展",
            //     "banner": {
            //         "title": "Qunar React Native for Web 扩展",
            //         "description": "扩展"
            //     },
            //     "content": {
            //         "type": "blocks",
            //         "sidebar": true,
            //         "multi": true,
            //         "index": "./test-reactweb/modules/qunar-extension/README.md",
            //         "pages": [{
            //             "name": "ABTest",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/ABTest.js"
            //         },{
            //             "name": "CookieManager",
            //             "content": "./test-reactweb/apis/CookieManager.js"
            //         },{
            //             "name": "CameraRoll",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/CameraRoll.js"
            //         },{
            //             "name": "CVParam",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/CVParam.js"
            //         },{
            //             "name": "DeviceInfo",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/DeviceInfo.js"
            //         },{
            //             "name": "MapUtils",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/MapUtils/index.js"
            //         },{
            //             "name": "QHotDogNetWork",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/QHotDogNetWork.js"
            //         },{
            //             "name": "QShare",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/QShare/README.md"
            //         },{
            //             "name": "QLoginManager",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/QLoginManager.js"
            //         },{
            //             "name": "ImageUploader",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/ImageUploader.js"
            //         },{
            //             "name": "UElog",
            //             "content": "./test-reactweb/modules/qunar-extension/libs/UELog.js"
            //         }]
            //     }
            // },
            // {
            //     "name": "demo",
            //     "title": "DEMO",
            //     "banner": {
            //         "title": "demo list",
            //         "description": "例子"
            //     },
            //     "content": "./test-reactweb/docs/DEMO.md",
            //     "compile": "markdown"
            // },
            // {
            //     "name": "releases",
            //     "title": "版本",
            //     "banner": {
            //         "title": "Qunar React Native for Web 版本",
            //         "description": "版本记录"
            //     },
            //     "content": "./test-reactweb/docs/releases.md",
            //     "compile": "markdown",
            //     "options": {
            //         "menuLevel": 3
            //     }
            // },
            // {
            //     "name": "QRN",
            //     "title": "QRN",
            //     "url": "http://ued.qunar.com/qrn/"
            }
        ]
    }
}
