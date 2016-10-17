
## 1、下载脚本

fekit工程安装


`fekit install QunarAPI`


还可以[点击我下载](http://hy.qunar.com/source/test/src/QunarAPI.js)

**备注**：支持使用 AMD/CMD 标准模块加载方法加载，也可以在fekit中直接require   

[QunarAPI测试页](http://hy.qunar.com/source/demo/unittest.html)可以检测支持的QunarAPI接口
## 2、通过config接口注入配置信息

	QunarAPI.config({
	    debug: true // 目前只支持 debug 参数
	    // 以下兼容wechat时必填
	    appId: '', // 必填，公众号的唯一标识
	    timestamp: , // 必填，生成签名的时间戳
	    nonceStr: '', // 必填，生成签名的随机串
	    signature: '',// 必填，签名
	    jsApiList: [] // 必填，需要使用的JS接口列表
	})

	QunarAPI.checkJsApi({
	    jsApiList: ['chooseImage'], // 需要检测的JS接口列表
	    success: function(res) {
	        // 以键值对的形式返回，可用的api值true，不可用为false
	        // HY
	        // res: {"chooseImage": true}
	        // wechat
	        // res：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
	    }
	});

## 3、调用ready接口，在回调函数中调用QunarAPI提供的各种接口

	QunarAPI.ready(function() {
	    // 调用QunarAPI提供的各种接口
	})
