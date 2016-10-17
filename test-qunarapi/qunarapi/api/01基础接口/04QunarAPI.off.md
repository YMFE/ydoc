* 功能描述：off掉通过on绑定的事件，即：将那些通过`name`里有`on`字段的接口绑定的事件解绑
* 使用场景：在某些场景，需要解绑一些一些事件
* 使用说明：
	* 此处解绑的事件，必须指定为绑定时的那个事件（调用`QunarAPI.onXXX`的时候，会返回该事件）
	* 解绑的必须是通过 `QunarAPI.onXXX` 绑定的事件
	* 接口的第一个参数是需要解绑的接口名称，并不需要带上命名空间（比如：`QunarAPI.hy.onNavClick` -> `onNavClick`， `QunarAPI.bnb.onXXX` -> `onXXX`）

```js
var testEvent;

···

QunarAPI.ready(function(){
	testEvent = QunarAPI.onSomething({
		success: function(res){
			
		}
	});
});

···

QunarAPI.ready(function(){
	QunarAPI.off(onSomething, testEvent);
});

```