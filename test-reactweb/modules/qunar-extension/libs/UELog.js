/**
 * @providesModule UELog
 * @author qianjun.yang
 */
 /**
 * UELog
 *
 * @component UELog
 * @description `UELog` UELog的web端实现，用来做客户端埋点log,require("qunar-react-native").UELog
 * 
 * 注：实现依赖于`QunarApi.uelog`,仅支持Hy,H5模式下暂不支持。
 */



module.exports = {
     /**
     * @method log 
     * @type function
     * @param {array} logs 埋点信息数组
     * @description 同时埋点多条信息，多条信息会使用'*'连接在一起
     */
    log(logs){
        QunarAPI.checkJsApi({
            jsApiList: ['uelog'],
            success(res){        
                if(res.uelog || (res.checkResult && res.checkResult.uelog)){
                    QunarAPI.hy.uelog({
                        data: logs.join('*'),
                        success(res) {
                            // alert('uelog success'+JSON.stringify(res));
                        },
                        fail(res){
                            // alert('uelog fail'+JSON.stringify(res));
                        }
                    });
                }
            }
        });  
    },
    /**
     * @method logOrigin 
     * @type function
     * @param {string or object} log 埋点信息
     * @description 埋点单条信息
     */
    logOrigin(log){
        QunarAPI.checkJsApi({
            jsApiList: ['uelog'],
            success(res){        
                if(res.uelog || (res.checkResult && res.checkResult.uelog)){
                    QunarAPI.hy.uelog({
                        data: log,
                        success(res) {
                            // alert('uelog success'+JSON.stringify(res));
                        },
                        fail(res){
                            // alert('uelog fail'+JSON.stringify(res));
                        }
                    });
                }
            }
        });  
    },
}