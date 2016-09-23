/**
 * @providesModule QStorageManager
 * @author qianjun.yang
 */
var AsyncStorage = require('AsyncStorage'),
    div = "@`@",
    undefine,
    noop = function() {}
/**
 * 存储
 *
 * @component QStorageManager
 * @description `QStorageManager` 基于AsyncStorage封装的QStorageManager web端实现，require("qunar-react-native").QStorageManager
 */
module.exports = {
    /**
     * @method saveData
     * @param {String} ns0 一级namespace
     * @param {String} ns1 二级namespace
     * @param {Function} callback 成功回调
     * @param {Function} failback 失败回调
     * @description 存储数据
     *
     * ```
     * require("qunar-react-native").QStorageManager.saveData('hotel', 'manage', callback, failback);
     * ```
     */
    saveData: function(ns0, ns1, data, callback = noop, failback = noop) {
        AsyncStorage.setItem(ns0 + div + ns1, JSON.stringify(data)).then(callback, failback)
    },
    /**
     * @method removeData
     * @param {String} ns0 一级namespace
     * @param {String} ns1 二级namespace，如果缺省，则会删除ns0下所有数据
     * @param {Function} callback 成功回调
     * @param {Function} failback 失败回调
     * @description 删除数据
     *
     * ```
     * require("qunar-react-native").QStorageManager.removeData('hotel', 'manage', callback, failback);
     * ```
     */
    removeData: function(ns0, ns1, callback = noop, failback = noop) {
        AsyncStorage.getAllKeys().then(function(keys) {
            var keystoRemove = []
            for (var i in keys) {
                var key = keys[i].split(div)
                if (key[0] === ns0) {
                    if (ns1 !== undefine && key[1] !== ns1) {
                        continue
                    }
                    keystoRemove.push(keys[i])
                    break
                }
            }
            if (keystoRemove.length) {
                AsyncStorage.multiRemove(keystoRemove).then(callback, failback)
            } else {
                callback()
            }
        }, failback)
    },
    /**
     * @method getData
     * @param {String} ns0 一级namespace
     * @param {String} ns1 二级namespace
     * @param {Function} callback 成功回调
     * @param {Function} failback 失败回调
     * @description 删除数据
     *
     * ```
     * require("qunar-react-native").QStorageManager.getData('hotel', 'manage', callback, failback);
     * ```
     */
    getData: function (ns0, ns1, dataType, callback = noop, failback = noop) {
        AsyncStorage.getItem(ns0 + div + ns1).then(function(data) {
            if (dataType.toLowerCase() === "json") {
                try {
                    data = JSON.parse(data)
                } catch(e) {
                    data = {}
                }
            }
            callback(data)
        }, failback)
    }
}