/*
 * @providesModule Geolocation
 */


/**
 * Geolocation 接口
 * @version >= v1.4
 * @component Geolocation
 * @example ./Geolocation.js
 * @description Geolocation 接口提供了获取位置信息的一组方法
 */

/**
 * @property getCurrentPosition
 * @type function
 * @param {function} onSuccess 获取位置成功后调用，调用时被传入一个 `Position` 对象
 * @param {function} onError 获取位置失败后调用，调用时被传入一个 `PositionError` 对象
 * @param {object} options 获取位置时的配置信息
 * @description `Geolocation.getCurrentPosition()` 用来获取设备当前的位置，调用方法如下：
 *
 * ```javascript
 * Geolocation.getCurrentPosition(onSuccess, onError, options)
 * ```
 *
 * 其中 options 中可以包含下列三项：
 * - enableHighAccuracy：一个 boolean 值，表示是否获取高精度的位置信息，如果该设备能够提供高精度的位置信息，
 * 那么就会返回高精度位置信息，但同时这也加剧了 GPS 芯片的工作量，可能导致响应速度变慢的情况。
 * - timeout：一个正值，表示最长允许设备用于返回结果的时间, 单位为 ms ，默认值是 Infinity。
 * - maximumAge：表示获取到的位置信息的最大有效时间, 单位为 ms ，在有效时间范围内，在此获取位置信息，将会返回缓存下来的值，
 * 默认值为 0 ，意味值永不使用缓存。
 *
 * Position 对象包含下列项:
 * - coords: 一个对象,包含下列信息
 *   - latitude: 纬度
 *   - longitude: 经度
 *   - altitude: 海拔
 *   - accuracy: 经纬度精确度
 *   - altitudeAccuracy: 海拔精确度
 *   - heading: 角度, 0 代表正北, 90 代表正东, 180 代表正南, 270 代表正西, 如果速度为 0 ,那么该值为 NaN
 *   - speed: 设备的移动速度, 可能为 null
 * - timestamp: 当前的时间戳
 *
 *
 * PositionError 对象包含下列项:
 * - code: 包含了错误码, 可能是 PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
 * - message: 一个可读的错误信息
 */

/**
 * @property watchPosition
 * @type function
 * @param {function} onSuccess 获取位置成功后调用，调用时被传入一个 `Position` 对象
 * @param {function} onError 获取位置失败后调用，调用时被传入一个 `PositionError` 对象
 * @param {object} options 获取位置时的配置信息
 * @description `Geolocation.watchPosition()` 用于注册一个回调函数，每当设备的位置改变，
 * 该函数就会自动调用 onSuccess 或者 onError（获取位置失败时）。这个函数返回一个 id ，
 * 通过将此 id 传入 `Geolocation.clearWatch()` 来取消这个回调。
 */

/**
 * @property clearWatch
 * @type function
 * @param {number} id 一个由 `Geolocation.watchPosition()` 返回的 id
 * @description  `Geolocation.clearWatch()` 用于取消持续定位
 */

var errorMessage = '该浏览器不支持定位';

let Geolocation = navigator.geolocation ? navigator.geolocation : {
    getCurrentPosition: function(onSuccess, onError){
        console.warn(errorMessage);
        onError(errorMessage);
    },
    watchPosition: function(onSuccess, onError){
        console.warn(errorMessage);
        onError(errorMessage);
    },
    clearWatch: function(){
        console.warn(errorMessage);
    }
};

Geolocation.stopObserving = function(){};

module.exports = Geolocation;
