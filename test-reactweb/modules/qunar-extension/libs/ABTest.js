/**
 * @providesModule ABTest
 */



/**
 * ABTest
 *
 * @component ABTest
 * @example ./ABTest.js
 * @description 获取 abTest 的策略信息, 关于 abTest, 请参见 [ABTest wiki](http://wiki.corp.qunar.com/pages/viewpage.action?pageId=114429300)
 *
 * 注: 仅支持Hy模式，H5模式不支持
 */

let e = {message: "暂不支持"};


module.exports  = {
    /**
     * @property abTest
     * @type function
     * @param {string} abId 实验ID
     * @param {string} simpleName 使用该策略信息的来源
     * @param {function} successCallback 成功回调
     * @param {function} failCallback 失败回调
     * @description 获取成功后会调用 `successCallback` 回调，调用时传入一个对象，其中包含下面两个字段:
     *
     * - ab_type: 策略类型
     * - ab_achieve: 策略信息
     *
     * **注意:** 该接口的实现依赖于 QunarAPI，脱离了客户端环境在 touch 上该接口无法正常使用。
     */
    abTest(abId, simpleName, successCallback, failCallback) {
        QunarAPI.checkJsApi({
            jsApiList: ['abTest'],
            success(res){
                if(res.abTest || (res.checkResult && res.checkResult.abTest)){
                    QunarAPI.abTest({
                        abId: abId,
                        simpleName: simpleName,
                        success(res){
                            successCallback && successCallback(res);
                        },
                        fail(res){
                            failCallback && failCallback(res);
                        }
                    });
                }else{
                    failCallback && failCallback(e)
                }
            }
        });
    }
}
