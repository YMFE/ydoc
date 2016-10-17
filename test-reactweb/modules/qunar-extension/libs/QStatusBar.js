/**
 * @providesModule QStatusBar
 * @author qianjun.yang
 */
var e = {
    message: "暂不支持"
}
/**
 * 存储
 *
 * @component QStatusBar
 * @description `QStatusBar` QStatusBar的web端空实现，require("qunar-react-native").QStatusBar
 */



/*
* 1 `<meta name="apple-mobile-web-app-status-bar-style" content="black" />
*    <meta name="full-screen" content="yes">
*    <meta name="x5-fullscreen" content="true">` 等需要在一开始时加载才有效
* 2 `<meta name="apple-mobile-web-app-capable" content="yes">` 在IOS9版本有诸多问题无法显示
* 综上 此接口暂时为空实现
* 给出Hy的实现
*/
var isHy = QunarAPI.sniff.qunar

var StatusBar = {
    setHidden: function(hidden, callback, errorCallback) {errorCallback && errorCallback(e)},
    setStyle: function(style, callback, errorCallback) {errorCallback && errorCallback(e)},
    setColor: function(color, animated, callback, errorCallback) {errorCallback && errorCallback(e)},
    setTranslucent: function(translucent, callback, errorCallback) {errorCallback && errorCallback(e)},
}
var QStatusBar = {...StatusBar}
if (isHy) {
    QStatusBar.setHidden = function(hidden, callback, errorCallback) {
        QunarAPI.checkJsApi({
            jsApiList: ['setNavDisplayStatus'],
            success(res){        
                if(res.setNavDisplayStatus || (res.setNavDisplayStatus && res.checkResult.setNavDisplayStatus)){
                    // 重写方法
                    QStatusBar.setHidden = function(hidden, callback, errorCallback) {
                        QunarAPI.hy.setNavDisplayStatus({
                            action: hidden ? 'hide' : 'show',
                            animate: 'none',
                            success: callback,
                            fail: errorCallback
                        })
                    };
                    QStatusBar.setHidden(hidden, callback, errorCallback)
                } else {
                    // 重写方法
                    QStatusBar.setHidden = StatusBar.setHidden
                    QStatusBar.setHidden(hidden, callback, errorCallback)
                }
            }
        })
    }
}

module.exports = QStatusBar