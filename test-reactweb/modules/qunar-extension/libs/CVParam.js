/**
 * @providesModule CVParam
 * @author qianjun.yang
 */
 /**
  * CVParam
  *
  * @component CVParam
  * @description CVParam 在 web 端的空实现，`require("qunar-react-native").CVParam`
  */
module.exports = {
    /**
     * @param object data
     * @param function callback
     * @param function errorCallback
     **/
    getCVParam: function(data, callback, errorCallback) {
        errorCallback && errorCallback({message: "暂不支持"})
    }
}
