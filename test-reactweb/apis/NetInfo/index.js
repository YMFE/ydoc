/*
 * @providesModule NetInfo
 */

let QunarAPI = require('QunarAPI');
/**
 * NetInfo 接口
 *
 * @component NetInfo
 * @version >= v1.4
 * @example ./NetInfo.js
 * @description NetInfo 是一个用来获取当前设备的网络状态的一组 API
 */


// 存放回调函数
const CALLBACKS = {
    isConnected: {},
    status: {}
};

function createInterface(callbacks){
    return {
        /**
         * @property addEventListener
         * @type function
         * @param {String} evt 该值为固定值（ change ），表示事件的名称
         * @param {function} callback 需要添加的回调，当网络变化时被调用
         * @description 用来添加网络变化时的回调
         */
        addEventListener: function(evt, callback) {
            if (!callbacks[evt]){
                callbacks[evt] = [];
            }
            callbacks[evt].push(callback);
        },
        /**
         * @property removeEventListener
         * @type function
         * @param {String} evt 该值为固定值（ change ），表示事件的名称
         * @param {function} callback 需要移除的回调
         * @description 用来删除网络变化时的回调
         */
        removeEventListener: function(evt, callback) {
            if (!callbacks[evt]){
                return;
            }
            var index = callbacks[evt].indexOf(callback);
            if (index !== -1){
                callbacks[evt].splice(index, 1);
            }
        },
        /**
         * @property fetch
         * @type function
         * @description 该方法返回一个 Promise 对象，resolve 的时候会传入网络连接状态，
         * 在大客户端环境下, 借助于 QuanrAPI 可以获取到网络类型, 网络状态可能是 2g，3g，2g/3g，4g，wifi，unknown 。
         * 但是在浏览器中打开时, 没有办法获取到网络连接的方式, 网络状态只能是 unknown。
         *
         */
        fetch: function() {
            return new Promise((resolve, reject) => {
                QunarAPI.getNetworkType({
                    success: function(res){
                        // 返回网络类型2g，3g，2g/3g，4g，wifi，unknown
                        resolve(res.networkType);
                    },
                    fail: function(){
                        resolve('unknown');
                    }
                });
            });
        },
        /**
         * @property isConnectionExpensive
         * @type function
         * @description 用来获知当前的网络连接是否付费, 这里认为所有非 wifi 的环境均需要付费。
         *
         */
        isConnectionExpensive(callback) {
            NetInfo.fetch().then(networkType => {
                // 只要不会 wifi 都认为是付费连接, 虽然在浏览器中时获取到的是 'unknown' 但仍认为是付费连接
                callback(networkType !== 'wifi');
            });
        }
    };
}

let NetInfo = createInterface(CALLBACKS.status);

/**
 * @property isConnected
 * @type object
 * @description 该对象同样提供了一组同 NetInfo 上具有的方法，不同的是该对象上挂载的方法仅仅
 * 告诉回调当前设备是否在线。比如使用 `NetInfo.isConnected.addEventListener` 添加的回调，
 * 在网络状态变化时候，会以 true 或 false 来调用回调函数，表示当前是否在线。
 */
NetInfo.isConnected = createInterface(CALLBACKS.isConnected);

// override
NetInfo.isConnected.fetch = function() {
    return new Promise((resolve) => {
        resolve(window.navigator.onLine);
    });
};


function handleChange(status){
    if (CALLBACKS.status.change){
        CALLBACKS.status.change.forEach(callback => {
            callback(status);
        });
    }
    if (CALLBACKS.isConnected.change){
        CALLBACKS.isConnected.change.forEach(callback => {
            callback(status === 'online');
        });
    }
}


window.addEventListener('online', function(){
    handleChange('online');
}, false);


window.addEventListener('offline', function(){
    handleChange('offline');
}, false);

module.exports = NetInfo;
