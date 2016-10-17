/*
 * @providesModule DeviceInfo
 */

let QunarAPI = require('QunarAPI');
let assign = require('lodash/object').assign;

/**
 * DeviceInfo 模块
 *
 * @component DeviceInfo
 * @description 该模块提供一个对象, 返回与设备相关的信息, 这里使用了 QunarAPI 提供的接口, 当运行环境为客户端的时候
 * 可以正常获得到下列信息:
 *
 * - vid: string //app vid
 * - pid: string //app pid
 * - cid: string //渠道号
 * - uid: string //设备唯一号
 * - sid: string //服务器下发的标示
 * - gid: string //服务器为每个设备下发的唯一编号
 * - mac: string //mac地址
 * - platform: string // 平台信息, 可能为 android、iOS、unknown
 *
 *
 * 如果当前环境不是在客户端里面, 那么将无法获取到以上信息, 仅获取到下列信息:
 *
 * - isIOS: bool //是否为 iOS, 永远为 false
 * - isAndroid: bool //是否为 android, 永远为 false
 * - isWeb: bool // 是否为 web, 永远为 true
 * - platform: string // 平台信息, 可能为 android、iOS、winPhone、unknown
 */


let ua = navigator.userAgent,
    isWinPhone = ua.match(/(Windows Phone) OS (\d+.\d)/)
    isAndroid = ua.match(/(Android) (\d+\.\d+)/), // 匹配 android
    isIOS = ua.match(/CPU (?:(iPhone|iPad|iPod) )?OS (\d+_\d+)/), // 匹配 iOS
    os = isAndroid || isIOS  || isWinPhone || ['', 'unknown', 'unknown'],
    schemeInfo = ua.toLowerCase().match(/(^|\s)(qunar[^\/]+)\/([\d\.]+)/) || [location.protocol.replace(/:/g, ''), 'unknown']

var deviceInfo = {
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    platform: isAndroid && 'android' || isIOS && 'iOS' || isWinPhone && 'winPhone' || 'unknown',
    osVersion: os[2],
    qrn_version: '',
    releaseType: '',
    scheme: schemeInfo[0]
};

module.exports = deviceInfo;
module.exports.init = function () {
    QunarAPI.checkJsApi({
        jsApiList: ['getDeviceInfo'], // 需要检测的JS接口列表
        success: function(res) {
            // hy || wechat
            if(res.getDeviceInfo || res.checkResult && res.checkResult.getDeviceInfo){
                QunarAPI.hy.getDeviceInfo({
                    hybridId: deviceInfo.hybridId,
                    success: function(res){
                        assign(deviceInfo, res);
                    },
                    fail: function(){
                        assign(deviceInfo, {
                        });
                    }
                });
            }
        }
    });
}
