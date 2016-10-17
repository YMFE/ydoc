let ReactNative = require('qunar-react-native');
let {ABTest} = ReactNative;

let abId = 'id'; //实验ID
let simpleName = 'vcName'; //使用该策略信息的来源

ABTest.abTest(abId, simpleName,
    (ABTestInfo) => {
        //获取成功的回调
        // ABTestInfo.ab_type: 策略类型
        // ABTestInfo.ab_achieve: 策略信息
    }, (err)=>{
        //获取失败的回调
        console.log(err.message);
    });
