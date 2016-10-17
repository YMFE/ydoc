/**
 * @providesModule QNativeModules
 */
/**
 * NativeModules
 *
 * @component NativeModules
 * @version >=v1.4.0
 * @description 和Native通信的一些接口，一般不直接调用
 * 
 */
require('QunarAPI')
var NativeModules = require('NativeModules'),
    isHy = QunarAPI.sniff.qunar,
    Location = window.location,
    utils = require('AppRegistry').utils,
    DeviceInfo = require('DeviceInfo'),
    undefine
function unSupport (key) {
    console.warn && console.warn('不支持 ' + key)
}
/**
 * @property UrlMapping
 * @type object
 * @description 仅在react-web h5情形下供sendScheme内部调用，业务需要在UrlMapping注册自己的规则，根据参数转换成对应url地址，实现在h5上的正常跳转，例如：
 * ```
 *  var {UrlMapping} = require('qunar-react-native').NativeModules
 *  UrlMapping[hybridId] = {
 *      $moduleName: function(obj) {
 *          var {url, touchUrl, m, data} = obj // url是scheme，touchUrl是hy页面的url
 *          if (obj.m === 'openNewVC') return {url: 'http://xxx.com', openNew: true}
 *          if (obj.m !== 'openNewVC') return {url: 'http://xxx.com', openNew: false}
 *          // 返回的url是跳转或者打开页面的地址，如果是跳转，请在改url对应的页面内完成回跳逻辑，如果return false则不会跳转或者新开页面，业务方可以自己执行任何逻辑操作。
 *      } 
 *  }
 * ```
 */ 
var UrlMapping = NativeModules.UrlMapping = {
}
function mappingObjToUrl(obj) {
    var {hybridId, moduleName} = obj,
        _o = UrlMapping[hybridId]
    _o = _o && _o[moduleName]
    _o = _o && _o(obj)
    return _o
}
/**
 * @property QRCTBroadCastManager
 * @type object
 * @description 挂靠在NativeModules上的QRCTBroadCastManager。
 */ 
NativeModules.QRCTBroadCastManager = {
    /**
     * @method NativeModules.QRCTBroadCastManager.sendBroadcast
     * @type function
     * @param {string} name name
     * @param {object} data data
     * @param {string} hybridId hybridId
     * @description 然而在hy和h5上都没有实现，如有调用，会打印警告
     */
    sendBroadcast: (name, data, hybridId = '')=>unSupport('sendBroadcast')
}
/**
 * @property QRCTVCManager
 * @type object
 * @description 挂靠在NativeModules上的QRCTVCManager。
 */ 
NativeModules.QRCTVCManager =  {
    /**
     * @method NativeModules.QRCTVCManager.backToReactVC
     * @type function
     * @param {string} hybridId hybridId
     * @param {number} index ReactViewIndex
     * @param {string} adrToken adrToken
     * @param {object} opts 选项
     * @description 然而在hy和h5上都没有实现，如有调用，会打印警告【也许可以通过react/biz来发送消息】
     */
    backToReactVC: (hybridId = '', index, adrToken = '', opts = {}) => unSupport('backToReactVC'),
    /**
     * @method NativeModules.QRCTVCManager.closeCurrentVC
     * @type function
     * @description 为了不混淆hy和RN，h5和hy都不实现，如有调用，打印警告
     */
    closeCurrentVC: () => unSupport('closeCurrentVC'),
    // closeCurrentVC: isHy ? function() {
    //     QunarAPI.hy.closeWebView({})
    // } : () => unSupport('closeCurrentVC'),
    /**
     * @method NativeModules.QRCTVCManager.openNewVC
     * @type function
     * @param {string} hybridId hybridId
     * @param {string} moduleName moduleName
     * @param {object} initProps initProps
     * @param {string} adrToken adrToken
     * @description h5和hy上面会通过 DeviceInfo.scheme + '://react/open?hybridId=' + hybridId + '&moduleName=' + moduleName + 
                '&initProps=' + encodeURIComponent(JSON.stringify(initProps)) 只能打开react！！如果需要打开hy，请调用QRCTJumpHandleManager.sendScheme
     */
    openNewVC: function(hybridId, moduleName, initProps = {}, adrToken = '') {
        var url = DeviceInfo.scheme + '://react/open?hybridId=' + hybridId + '&moduleName=' + moduleName + 
                '&initProps=' + encodeURIComponent(JSON.stringify(initProps))
        NativeModules.QRCTJumpHandleManager.sendScheme(url, 
            {}, '', (info)=>console.log('openNewVC failed:' + JSON.stringify(info)), 'openNewVC')
    },
    /**
     * @method NativeModules.QRCTVCManager.closeActivity
     * @type function
     * @param {string} adrToken adrToken
     * @description 然而在hy和h5上都没有实现，如有调用，会打印警告
     */
    closeActivity: (adrToken) => unSupport('closeActivity'),
    /**
     * @method NativeModules.QRCTVCManager.setSwipeBackEnabled
     * @type function
     * @param {bool} isEnabled isEnabled
     * @param {number} vcIndex ReactViewIndex
     * @param {function} cb 回调
     * @description 然而在hy和h5上都没有实现，如有调用，会打印警告
     */
    setSwipeBackEnabled: (isEnabled, vcIndex, cb) => {
        cb && cb({message: '不支持'});
        unSupport('setSwipeBackEnabled')
    }
}
/**
 * @property QRCTNativeCallbackManager
 * @type object
 * @description 挂靠在NativeModules上的QRCTNativeCallbackManager。
 */ 
NativeModules.QRCTNativeCallbackManager = {
    /**
     * @method NativeModules.QRCTNativeCallbackManager.sendNativeEvents
     * @type function
     * @param {string} id id
     * @param {object} data data
     * @description 然而在hy和h5上都没有实现，如有调用，会打印警告
     */
    sendNativeEvents: (id, data = {}) => unSupport('sendNativeEvents')
}
/**
 * @property QRCTJumpHandleManager
 * @type object
 * @description 挂靠在NativeModules上的QRCTJumpHandleManager。
 */ 
NativeModules.QRCTJumpHandleManager = {
    /**
     * @method NativeModules.QRCTJumpHandleManager.sendScheme
     * @type function
     * @param {string} url url
     * @param {object} data data
     * @param {string} adrToken adrToken
     * @param {function} cb 回调
     * @description h5会不做任何处理，直接赋值给loaction.href跳转，业务需要自己决定传递的url类型来决定是唤起nativ应用还是touch页面之间跳转【在UrlMapping上配置】；hy则会通过QunarAPI.hy.schemeForResult处理
     */
    sendScheme: function(url, data, adrToken, cb, method = 'sendScheme') {
        if (isHy) {
            QunarAPI.hy.schemeForResult({
                scheme: url,
                success: cb,
                fail: cb
            })
        } else {
            var touchUrl = url.match(/url=([^&]+)/) || ['', ''], // hy打开的话，会带一个url
                objPassToMapping = {url, data, adrToken, m: method}
            if (touchUrl[1]) objPassToMapping.touchUrl = decodeURIComponent(touchUrl[1])
            var mappingUrl = mappingObjToUrl(objPassToMapping)
            if (mappingUrl === false) return console.log(method + ' rejected:return false')
            var urlToOpen = mappingUrl && mappingUrl.url || mappingUrl || url,
                openNew = mappingUrl && mappingUrl.openNew
            if (method === 'openNewVC') {
                openNew = true
            }
            console.log('opening scheme:' + urlToOpen)
            if (openNew) return window.open(urlToOpen)
            Location.href = urlToOpen
        }
    }
}

    /**
     * @method NativeModules.QRCTJumpHandleManager.sendSchema
     * @type function
     * @description 已过时，请使用NativeModules.QRCTJumpHandleManager.sendScheme
     */
NativeModules.QRCTJumpHandleManager.sendSchema = NativeModules.QRCTJumpHandleManager.sendScheme

// sendScheme回调
if (isHy) {

}