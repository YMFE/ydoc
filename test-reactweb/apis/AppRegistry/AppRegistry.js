/*
 *
 * @providesModule AppRegistry
 */
//必须放在最前面,处理nodejs的专有变量
require('../process/index')
window.QunarAPI = require('QunarAPI')
var React = require('react')
var ReactDOM = require('ReactDOM')


var webViews = window.webViews = {}
var empty = function () {
    window.console && window.console.warn("todos")
}
function parseDataFromUrl(Location) {
    var search = Location.search.trim().match(/(qInitView|name|hybridId|moduleName|opts|initProps)+=[^\?&]*/g) || [], res = {}
    search.forEach(function(_item) {
        try {
            var item = decodeURIComponent(_item).match(/([^=]+)=([\S\s]*)$/)
            if (item) {
                res[item[1]] = item[1] === 'initProps' || item[1] === 'opts' ? JSON.parse(item[2]) : item[2]
            }
        } catch(e) {
            console.warn('解析 ' + _item + ' 失败')
        }
    })
    if (('qInitView' in res) && !('name' in res)) res.name = res.qInitView
    if (('initProps' in res) && !('opts' in res)) res.opts = res.initProps
    return res
}

function jsonToQuery(json, ignoreKeys = {}) {
    var res = []
    for (var i in json) {
        var type = typeof json[i]
        if (!(i in ignoreKeys) && type !== 'function') res.push(i + '=' + encodeURIComponent(type.match(/array|object/i) ? JSON.stringify(json[i]) : json[i]))
    }
    return res.join('&')
}



/**
 * @component AppRegistry
 * @version >=v1.4.0
 * @description `AppRegistry` 是 JS 运行所有 React Native 应用的入口。应用的根组件需要
 * 使用 `AppRegistry.registerComponent` 注册，而后原生系统才能加载打包的代码，在启动完成后通过
 * `AppRegistry.runApplication` 来运行应用。
 *
 * 要终止应用并销毁视图的时候，要调用 `AppRegistry.unmountApplicationComponentAtRootTag`
 * 方法并传入在 `runApplication` 中使用到的标签名。
 *
 * `AppRegistry` 应该尽早地被 require ，以确保 JS 运行环境在其他模块之前被准备好。
 */
var AppRegistry = {
    _defMd: null,
    _curMd: null,

    /**
     * @method registerConfig
     * @param  {obj} config description
     */
    registerConfig: function(config) {
        for (var i = 0; i < config.length; ++i) {
            var appConfig = config[i];
            if (appConfig.run) {
                AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);
            } else {
                // invariant(appConfig.component, 'No component provider passed in');
                // AppRegistry.registerComponent(appConfig.appKey, appConfig.component);
            }
        }
    },

    /**
     * @method registerRunnable
     * @param  {type} appKey description
     * @param  {type} func      description
     * @return {type}           description
     */
    registerRunnable: function(appKey, func) {
        webViews[appKey] = {run: (node, data)=>{
            AppRegistry._curMd = appKey
            return func(node, data)
        }}
        return appKey
    },

    /**
     * @method runApplication
     * @param  {string} appKey  注册组件时传入的 webViewId
     * @param  {any} parameters 携带的附加参数
     * @description 运行应用
     */
    runApplication: function(appKey, parameters) {
        var app = webViews[appKey || AppRegistry._defMd]
        if (!app) {
            alert(appKey + '未注册')
        } else {
            app.run(parameters)
        }
        
    },

    /**
     * anonymous function - description
     *
     * @return {type}  description
     */
    getappKeys: function () {
        return Object.keys(webViews)
    },

    /**
     * @method registerComponent
     * @param  {string} appKey 标示页面的一个 id
     * @param  {function} ComponentProvider 一个返回一个组件的函数
     * @description 组件需要使用此方法来注册自己，然后才能够运行。
     */
    registerComponent: function (appKey, ComponentProvider) {
        if (!webViews[appKey]) {
            webViews[appKey] = {
                run: function(parameters) {
                    AppRegistry._curMd = appKey
                    renderApplication(ComponentProvider, {...parameters}, parameters && parameters.rootTag)
                }
            }
            ComponentProvider.appKey = appKey
            if (!this._defMd) this._defMd = appKey
        }
        return appKey;
    },
    /**
     * @method unmountApplicationComponentAtRootTag
     * @description 销毁
     */
    unmountApplicationComponentAtRootTag: function() {
        try {
            // window.close()
            ReactDOM.unmountComponentAtNode(rootTag);
        } catch(e) {
            console.log(e)
        }
    }
}

var RootContainer = React.createClass({
    render: function() {
        var {Component, initProps} = this.props
        return (
            <div className="rn-root">
                <Component {...initProps} isQRCTDefCreate={true}/>
            </div>
        )
    },
})

function renderApplication(ComponentProvider, props, rootTag) {
    props = props || {}
    rootTag = rootTag || document.getElementById('rootTag')
    document.title = ComponentProvider.appKey
    ReactDOM.render(
        <RootContainer
            Component={ComponentProvider()}
            initProps={props}
        />
    , rootTag)
}

function addContainer(tag, props) {
    var ele = document.createElement(tag);
    for (var pro in props) {
        ele[pro] = props[pro]
    }
    document.body.appendChild(ele)
    return ele
}
var ReactWebReadyed
window.ReactWebReady = function(data) {
    var DeviceInfo = require('DeviceInfo')
    for (var key in data) DeviceInfo[key] = data[key]
    QunarAPI.ready(function() {
        require('qunar-react-native').StyleSheet.initStyle()
        if (!ReactWebReadyed) {
            DeviceInfo.init()
            addContainer('div', {id: "rootTag", className: "root-tag"})
            addContainer('div', {id: "globalComponentRoot", className: "rn-flex rn-component-root"})
            ReactWebReadyed = true
        }
        var initData = parseDataFromUrl({
                search: document.location.hash
            }), 
            {moduleName} = initData, // 可以多moduleName
            app = webViews[moduleName] || webViews[AppRegistry._defMd]
        function run(initProps) {
            app && app.run({
                rootTag: document.getElementById('rootTag'),
                initProps
            })
        }
        if (QunarAPI.sniff.wechat || QunarAPI.sniff.h5) return run(initData.initProps)
        QunarAPI.hy.getInitData({
            success: run,
            fail: function(){
                run(initData.initProps)
            }
        })
    })
}

module.exports = AppRegistry

var GlobalGid= NaN,
    GlobalComponentRootInstance,
    GlobalComponentRoot = React.createClass({
        getInitialState: function() {
            GlobalComponentRootInstance = this
            this._data = this.props.initProps || {}
            return {
                visible: this.props.visible,
            }
        },
        update: function(Component, data, visible) {
            this.Component = Component
            this._data = data
            this.setState({
                visible: visible,
            })
        },
        render: function() {
            if (!this.state.visible) return null
            var Component = this.Component || this.props.Component || null,
                initProps = this.props.initProps
            if (typeof Component === 'function') {
                Component = <Component {...this._data}/>
            }
            return (
                <div className="rn-root">
                    {Component}
                </div>
            )
        }
    })
var lastProps = {}, _cnt = 1
var utils = module.exports.utils = {
    gid: function() {
        return _cnt++
    },
    render: function(Component, gid, props, visible, _props) {
        lastProps = _props || {}
        GlobalGid = gid
        if (typeof visible === 'undefined') visible = true
        if (GlobalComponentRootInstance) {
            GlobalComponentRootInstance.update(Component, props, visible)
        } else {
            ReactDOM.render(
                <GlobalComponentRoot 
                    visible={true} 
                    Component={Component}
                    initProps={props||{}}
                />
            , utils.getContainer())
        }
        utils.showContainer()
        lastProps.onShow && lastProps.onShow()
    },
    getContainer: function() {
        return document.getElementById('globalComponentRoot')
    },
    showContainer: function() {
        utils.getContainer().style.zIndex = 2
    },
    hideContainer: function(gid, force) {
        if ((GlobalGid !== gid || !gid) && force !== true) return // gid不匹配不响应
        lastProps.onHide && lastProps.onHide()
        utils.getContainer().style.zIndex = -1
        if (GlobalGid)
        GlobalComponentRootInstance && GlobalComponentRootInstance.setState({visible: false})
    },
    addContainer: addContainer,
    addClass: function(ele, className) {
        if(ele) ele.className = ele.className.replace(className, '').trim().replace(/[\s]{2,}/g, ' ') + ' ' + className
    },
    removeClass: function(ele, className) {
        if(ele) ele.className = ele.className.replace(className, '').trim().replace(/[\s]{2,}/g, ' ')
    },
    parseDataFromUrl: parseDataFromUrl,
    jsonToQuery: jsonToQuery,
}
