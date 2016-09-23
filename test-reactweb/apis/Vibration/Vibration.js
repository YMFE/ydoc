/**
 * @providesModule Vibration
 */

/**
 * Vibration 接口
 *
 * @component Vibration
 * @example ./Vibration.js[1-34]
 * @version >=v1.4.0
 * @description Vibration提供了控制设备震动的方法。
 *
 *
 */


 var Vibration = module.exports = {
    /**
     * @method vibrate
     * @param {number|array} ms 震动时间毫秒数，默认值为1000ms，或者是一个时间序列数组。
     * @description 震动设备
     *
     * 注：在web端，此方法依赖于window.navigator.vibrate()。
     */
    vibrate: function (ms) {
        try {
            return window.navigator.vibrate(ms || 1000)
        } catch(e) {
            return false
        }
    },
    /**
     * @method cancel
     * @description 停止震动设备
     *
     * 注：在web端，此方法依赖于window.navigator.vibrate(0)。
     */
    cancel: function() {
        try {
            navigator.vibrate(0)
        } catch(e) {

        }
    }
 }
