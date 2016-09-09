var fs = require('fs');
var path = require('path');

module.exports = function() {
    return {
        "name": "Qunar React Native",
        "examplePath": "./Examples/",
        "resources": {
            "images": './docs/images/'
        },
        "common": {
            "title": "Qunar React Native",
            "footer": "© 2015 - 2016 Qunar 平台前端架构组. Powered by <a href=\"http://gitlab.corp.qunar.com/mfe/qdoc\">qdoc</a>",
            "home": "Qunar MFE",
            "homeUrl": "http://ued.qunar.com/mobile/",
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
                "index": "./QRN-README.md",
                "pages": [{
                    "name": "项目创建",
                    "content": "./docs/qrn/project-init.md"
                }, {
                    "name": "项目开发",
                    "content": "./docs/qrn/project-develop.md"
                }, {
                    "name": '开发工具',
                    "content": "./docs/qrn/dev-tool.md"
                }, {
                    "name": '使用iconfont',
                    "content": "./docs/qrn/guide-using-iconfont.md"
                }, {
                    name: "使用ImageSet",
                    content: "./docs/qrn/guide-using-imageset.md"
                }, {
                    "name": 'Native集成（iOS）',
                    "content": "./docs/qrn/native-integration.md"
                }, {
                    "name": 'Native集成 （Android）',
                    "content": "./docs/qrn/native-integration-adr.md"
                }, {
                    "name": "使用Chrome调试",
                    "content": "./docs/qrn/debug-in-chrome.md"
                }, {
                    "name": "使用Atom调试（实验性）",
                    "content": "./docs/qrn/debug-in-atom.md"
                }, {
                    "name": "调试日志查看",
                    "content": "./docs/qrn/debug-http-log-watch.md"
                }, {
                    "name": "测试部署",
                    "content": "./docs/qrn/test-and-deploy.md"
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
                "index": './Libraries/qunar-extension/INTRO.md',
                "pages": [{
                    "name": "滚动和列表"
                }, {
                    "name": "ScrollView",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/ScrollView/ScrollView.js"
                }, {
                    "name": "RefreshControl",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/RefreshControl/RefreshControl.js"
                }, {
                    "name": "LoadControl",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/LoadControl/LoadControl.js"
                }, {
                    "name": "ListView",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/ListView/QListView.js"
                }, {
                    "name": "InfiniteListView",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/ListView/InfiniteListView.js"
                }, {
                    "name": "状态"
                }, {
                    "name": "Loading",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Loading/Loading.js"
                }, {
                    "name": "ProgressView",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/ProgressView/QProgressView.js"
                }, {
                    "name": "QLoading",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/QLoading/QLoading.js"
                }, {
                    "name": "QLoadingError",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/QLoadingError/QLoadingError.js"
                }, {
                    "name": "元素"
                }, {
                    "name": "Button",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Button/Button.js"
                }, {
                    "name": "Checked",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Checked/Checked.js"
                }, {
                    "name": "Radio",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Radio/Radio.js"
                }, {
                    "name": "分段"
                }, {
                    "name": "Tab",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Tab/Tab.js"
                }, {
                    "name": "TabBar",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/TabBar/QTabBar.js"
                }, {
                    "name": "TabBarItem",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/TabBarItem/QTabBarItem.js"
                }, {
                    "name": "其他"
                }, {
                    "name": "Slider",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Slider/QSlider.js"
                }, {
                    "name": "TimePicker",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/QTimePicker/QTimePicker.js"
                }, {
                    "name": "Modal",
                    "sub": true,
                    "content": "./Libraries/qunar-extension/libs/Modal/Modal.js"
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
                "index": './docs/ui/INTRO.md',
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [{
                        "name": "Accordion",
                        "content": "./docs/ui/Accordion.md"
                    }, {
                        "name": "Calendar",
                        "content": "./docs/ui/Calendar.md"
                    }, {
                        "name": "Carousel",
                        "content": "./docs/ui/Carousel.md"
                    }, {
                        "name": "Dialog",
                        "content": "./docs/ui/Dialog.md"
                    }, {
                        "name": "Dropdown",
                        "content": "./docs/ui/Dropdown.md"
                    }, {
                        "name": "Numbers",
                        "content": "./docs/ui/Numbers.md"
                    }, {
                        "name": "Popover",
                        "content": "./docs/ui/Popover.md"
                    }, {
                        "name": "RangeSlider",
                        "content": "./docs/ui/RangeSlider.md"
                    }, {
                        "name": "Rating",
                        "content": "./docs/ui/Rating.md"
                    }, {
                        "name": "SliderMenu",
                        "content": "./docs/ui/SliderMenu.md"
                    }, {
                        "name": "Suggest",
                        "content": "./docs/ui/Suggest.md"
                    }, {
                        "name": "Tooltip",
                        "content": "./docs/ui/Tooltip.md"
                    }, {
                        "name": "SwipeListView",
                        "content": "./docs/ui/SwipeListView.md"
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
                "index": './docs/qrn/api-intro.md',
                "pages": [{
                    "name": "DeviceInfo",
                    "content": "./docs/qrn/api-deviceinfo.md"
                }, {
                    "name": "LoginManager",
                    "content": "./docs/qrn/api-loginManager.md"
                }, {
                    "name": "CookieManager",
                    "content": "./docs/qrn/api-cookieManager.md"
                }, {
                    "name": "CameraRoll",
                    "content": "./docs/qrn/api-cameraRoll.md"
                }, {
                    "name": "ImageUploader",
                    "content": "./docs/qrn/api-imageUploader.md"
                }, {
                    "name": "Toast",
                    "content": "./docs/qrn/api-toast.md"
                }, {
                    "name": "QHotDogNetWork",
                    "content": "./docs/qrn/api-QHotDogNetWork.md"
                }, {
                    "name": "MapUtils",
                    "content": "./docs/qrn/api-mapUtils.md"
                }, {
                    "name": "UELog",
                    "content":"./docs/qrn/api-uelog.md"
                }, {
                    "name": "CVParam",
                    "content":"./docs/qrn/api-cvparam.md"
                }, {
                    name: "GeoLocation",
                    content: "./docs/qrn/api-location.md"
                }, {
                    name: "QStatusBar",
                    content: "./docs/qrn/api-statusBar.md"
                }, {
                    name: "ABTest",
                    content: "./docs/qrn/api-abTest.md"
                }, {
                    name: "QShare",
                    content:"./docs/qrn/api-qshare.md"
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
                "index": './docs/ext/ext.md',
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [{
                        "name": "Router",
                        "content": "./docs/ext/router.md",
                        "options": {
                            "menuLevel": 2
                        }
                    }, {
                        "name": "WebX",
                        "content": "./docs/ext/webx.md"
                    }, {
                        "name": "Redux",
                        "content": "./docs/ext/redux.md",
                        "options": {
                            "menuLevel": 2
                        }
                    }, {
                        "name": "Fetch",
                        "content": "./docs/ext/fetch.md"
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
                "index": "./docs/qrn/extending.md",
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "pages": [
                    {
                        "name": "Native组件开发(iOS)",
                        "content": "./docs/qrn/native-module-ios.md"
                    },
                    {
                        "name": "Native组件开发(Android)",
                        "content": "./docs/qrn/native-module-adr.md"
                    },
                    {
                        "name": "js调用Native组件",
                        "content": "./docs/qrn/native-module-js.md"
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
            "content": "./docs/qrn/demo.md"
        }, {
            "name": "faq",
            "title": "FAQ",
            "banner": {
                "title": "Qunar React Native 常见问题",
                "description": "开发中经常见到的一些坑"
            },
            "content": "./docs/qrn/faq.md"
        }, {
            "name": "releases",
            "title": "Releases",
            "banner": {
                "title": "Qunar React Native Releases",
                "description": "Releases"
            },
            "content": "./docs/qrn/releases.md",
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
