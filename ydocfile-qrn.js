var fs = require('fs');
var path = require('path');

module.exports = function() {
    return {
        "name": "Qunar React Native",
        "dest": "./_docs-qrn/",
        "examplePath": "./test-qrn/Examples/",
        "resources": {
            "images": './test-qrn/docs/images/'
        },
        "common": {
            "title": "Qunar React Native",
            "footer": "© 2016 <a href=\"http://gitlab.corp.qunar.com/mfe/qdoc\">YMFE</a> Team. Build by <a href=\"https://github.com/YMFE/ydoc\">ydoc</a>.",
            "home": "YMFE",
            "homeUrl": "http://ued.qunar.com/ymfe/",
            "navbars": []
        },
        "pages": [{
            "name": "index",
            "title": "开始",
            "banner": {
                "title": "Qunar React Native",
                "description": "去哪儿定制版 React Native，更快、更好、更统一。"
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "index": "./test-qrn/QRN-README.md",
                "pages": [{
                    "name": "项目创建",
                    "content": "./test-qrn/docs/qrn/project-init.md"
                }, {
                    "name": "项目开发",
                    "content": "./test-qrn/docs/qrn/project-develop.md"
                }, {
                    "name": '开发工具',
                    "content": "./test-qrn/docs/qrn/dev-tool.md"
                }, {
                    "name": '使用iconfont',
                    "content": "./test-qrn/docs/qrn/guide-using-iconfont.md"
                }, {
                    name: "使用ImageSet",
                    content: "./test-qrn/docs/qrn/guide-using-imageset.md"
                }, {
                    "name": 'Native集成（iOS）',
                    "content": "./test-qrn/docs/qrn/native-integration.md"
                }, {
                    "name": 'Native集成 （Android）',
                    "content": "./test-qrn/docs/qrn/native-integration-adr.md"
                }, {
                    "name": "使用Chrome调试",
                    "content": "./test-qrn/docs/qrn/debug-in-chrome.md"
                }, {
                    "name": "使用Atom调试（实验性）",
                    "content": "./test-qrn/docs/qrn/debug-in-atom.md"
                }, {
                    "name": "调试日志查看",
                    "content": "./test-qrn/docs/qrn/debug-http-log-watch.md"
                }, {
                    "name": "测试部署",
                    "content": "./test-qrn/docs/qrn/test-and-deploy.md"
                }]
            }
        }, {
            "name": "component",
            "title": "组件",
            "banner": {
                "title": "Qunar React Native 组件",
                "description": "组件"
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "index": './test-qrn/Libraries/qunar-extension/INTRO.md',
                "pages": [{
                    "name": "滚动和列表"
                }, {
                    "name": "ScrollView",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/ScrollView/ScrollView.js"
                }, {
                    "name": "RefreshControl",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/RefreshControl/RefreshControl.js"
                }, {
                    "name": "LoadControl",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/LoadControl/LoadControl.js"
                }, {
                    "name": "ListView",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/ListView/QListView.js"
                }, {
                    "name": "InfiniteListView",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/ListView/InfiniteListView.js"
                }, {
                    "name": "状态"
                }, {
                    "name": "Loading",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Loading/Loading.js"
                }, {
                    "name": "ProgressView",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/ProgressView/QProgressView.js"
                }, {
                    "name": "QLoading",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/QLoading/QLoading.js"
                }, {
                    "name": "QLoadingError",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/QLoadingError/QLoadingError.js"
                }, {
                    "name": "元素"
                }, {
                    "name": "Button",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Button/Button.js"
                }, {
                    "name": "Checked",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Checked/Checked.js"
                }, {
                    "name": "Radio",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Radio/Radio.js"
                }, {
                    "name": "分段"
                }, {
                    "name": "Tab",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Tab/Tab.js"
                }, {
                    "name": "TabBar",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/TabBar/QTabBar.js"
                }, {
                    "name": "TabBarItem",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/TabBarItem/QTabBarItem.js"
                }, {
                    "name": "其他"
                }, {
                    "name": "Slider",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Slider/QSlider.js"
                }, {
                    "name": "TimePicker",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/QTimePicker/QTimePicker.js"
                }, {
                    "name": "Modal",
                    "sub": true,
                    "content": "./test-qrn/Libraries/qunar-extension/libs/Modal/Modal.js"
                }]
            }
        }, {
            "name": "extraUI",
            "title": "外部组件",
            "banner": {
                "title": "Qunar React Native UI组件",
                "description": "Qunar React Native 外部UI组件"
            },
            "content":{
                "index": './test-qrn/docs/ui/INTRO.md',
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [{
                        "name": "Accordion",
                        "content": "./test-qrn/docs/ui/Accordion.md"
                    }, {
                        "name": "Calendar",
                        "content": "./test-qrn/docs/ui/Calendar.md"
                    }, {
                        "name": "Carousel",
                        "content": "./test-qrn/docs/ui/Carousel.md"
                    }, {
                        "name": "Dialog",
                        "content": "./test-qrn/docs/ui/Dialog.md"
                    }, {
                        "name": "Dropdown",
                        "content": "./test-qrn/docs/ui/Dropdown.md"
                    }, {
                        "name": "Numbers",
                        "content": "./test-qrn/docs/ui/Numbers.md"
                    }, {
                        "name": "Popover",
                        "content": "./test-qrn/docs/ui/Popover.md"
                    }, {
                        "name": "RangeSlider",
                        "content": "./test-qrn/docs/ui/RangeSlider.md"
                    }, {
                        "name": "Rating",
                        "content": "./test-qrn/docs/ui/Rating.md"
                    }, {
                        "name": "SliderMenu",
                        "content": "./test-qrn/docs/ui/SliderMenu.md"
                    }, {
                        "name": "Suggest",
                        "content": "./test-qrn/docs/ui/Suggest.md"
                    }, {
                        "name": "Tooltip",
                        "content": "./test-qrn/docs/ui/Tooltip.md"
                    }, {
                        "name": "SwipeListView",
                        "content": "./test-qrn/docs/ui/SwipeListView.md"
                    }
                ]
            }
        }, {
            "name": "api",
            "title": "API",
            "banner": {
                "title": "Qunar React Native API",
                "description": "API"
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "index": './test-qrn/docs/qrn/api-intro.md',
                "pages": [{
                    "name": "DeviceInfo",
                    "content": "./test-qrn/docs/qrn/api-deviceinfo.md"
                }, {
                    "name": "LoginManager",
                    "content": "./test-qrn/docs/qrn/api-loginManager.md"
                }, {
                    "name": "CookieManager",
                    "content": "./test-qrn/docs/qrn/api-cookieManager.md"
                }, {
                    "name": "CameraRoll",
                    "content": "./test-qrn/docs/qrn/api-cameraRoll.md"
                }, {
                    "name": "ImageUploader",
                    "content": "./test-qrn/docs/qrn/api-imageUploader.md"
                }, {
                    "name": "Toast",
                    "content": "./test-qrn/docs/qrn/api-toast.md"
                }, {
                    "name": "QHotDogNetWork",
                    "content": "./test-qrn/docs/qrn/api-QHotDogNetWork.md"
                }, {
                    "name": "MapUtils",
                    "content": "./test-qrn/docs/qrn/api-mapUtils.md"
                }, {
                    "name": "UELog",
                    "content":"./test-qrn/docs/qrn/api-uelog.md"
                }, {
                    "name": "CVParam",
                    "content":"./test-qrn/docs/qrn/api-cvparam.md"
                }, {
                    name: "GeoLocation",
                    content: "./test-qrn/docs/qrn/api-location.md"
                }, {
                    name: "QStatusBar",
                    content: "./test-qrn/docs/qrn/api-statusBar.md"
                }, {
                    name: "ABTest",
                    content: "./test-qrn/docs/qrn/api-abTest.md"
                }, {
                    name: "QShare",
                    content:"./test-qrn/docs/qrn/api-qshare.md"
                }]
            }
        }, {
            "name": "extension",
            "title": "EXT",
            "banner": {
                "title": "Qunar React Native Extension",
                "description": "Qunar React Native 增强拓展框架"
            },
            "content":{
                "index": './test-qrn/docs/ext/ext.md',
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [{
                        "name": "Router",
                        "content": "./test-qrn/docs/ext/router.md",
                        "options": {
                            "menuLevel": 2
                        }
                    }, {
                        "name": "WebX",
                        "content": "./test-qrn/docs/ext/webx.md"
                    }, {
                        "name": "Redux",
                        "content": "./test-qrn/docs/ext/redux.md",
                        "options": {
                            "menuLevel": 2
                        }
                    }, {
                        "name": "Fetch",
                        "content": "./test-qrn/docs/ext/fetch.md"
                    }
                ]
            }
        }, {
            "name": "extending",
            "title": "扩展",
            "banner": {
                "title": "Qunar React Native 功能扩展",
                "description": "借助Native组件引入更多功能"
            },
            "content": {
                "index": "./test-qrn/docs/qrn/extending.md",
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [
                    {
                        "name": "Native组件开发(iOS)",
                        "content": "./test-qrn/docs/qrn/native-module-ios.md"
                    },
                    {
                        "name": "Native组件开发(Android)",
                        "content": "./test-qrn/docs/qrn/native-module-adr.md"
                    },
                    {
                        "name": "js调用Native组件",
                        "content": "./test-qrn/docs/qrn/native-module-js.md"
                    }
                ]
            }
        }, {
            "name": "demo",
            "title": "DEMO",
            "banner": {
                "title": "Qunar React Native 示例",
                "description": "零基础玩儿转示例"
            },
            "content": "./test-qrn/docs/qrn/demo.md"
        }, {
            "name": "faq",
            "title": "FAQ",
            "banner": {
                "title": "Qunar React Native 常见问题",
                "description": "开发中经常见到的一些坑"
            },
            "content": "./test-qrn/docs/qrn/faq.md"
        }, {
            "name": "releases",
            "title": "Releases",
            "banner": {
                "title": "Qunar React Native Releases",
                "description": "Releases"
            },
            "content": "./test-qrn/docs/qrn/releases.md",
            "options": {
                "menuLevel": 3
            }
        }, {
            "name": "React Web",
            "title": "React Web",
            "url": "http://ued.qunar.com/react-web/"
        }]
    };
};
