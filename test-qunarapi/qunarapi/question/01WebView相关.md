####	Q: 我希望在hytive的webView中使用一些特殊的标签协议，比如SMS、mailto、tel，是否支持

A: 现在大客户端中是支持这些特殊的标签的，使用的方法如下：
```html
<a href="SMS:13000000000">发送短信到xxx</a>
<a href="SMS:13000000000&body=123">发送短信到xxx，内容为xx</a>
<a href="mailto:xxx@qunar.com">发送邮件到xxx</a>
<a href="tel:13000000000">打电话给xxx</a>
```
但是现在还存在一些问题，`SMS:`在iOS中body不能设置为中文，如果设置为中文会导致在点击后出现页面卡死的情况，因此需要中文得先使用encodeURI()转码，同时在界面的切换上也存在一些问题。`mailto:`还不支持参数的设置，后续还需要排期来完善
<br/>



#### Q: hytive的webView在加载的时候有个loading加载动画页面，但是页面中也使用html5写了一个loading加载动画用来控制页面的加载请求，因此会导致页面看起来有2个加载的动画，怎样来解决这个问题呢？

A: webView在开始加载资源的时候会出现白屏的情况，因此我们添加了一个loading动画的页面。双loading动画的根源在于前端需要通过loading页面来控制加载请求，而前端对于native端loading页面关闭的时间是不可控的。如果前端可以控制native隐藏loading动画的时间就不再需要使用html5来写一个新的loading页面。   

为了控制native端的loading动画关闭时间需要使用2个QunarAPI：[QunarAPI.onLoadingClose](http://hy.qunar.com/docs/qunarapi-api.html#WebView事件-QunarAPI-onLoadingClose) 和[QunarAPI.hideLoadView](http://hy.qunar.com/docs/qunarapi-api.html#界面操作接口-QunarAPI-hideLoadView)
```js
// 先在页面一开始调用如下api设置navtive的loading页面由前端来关闭
QunarAPI.onLoadingClose({
success: function( data, callback){
    callback( {data: true} );
});


//在需要关闭loading页面的时候调用下面的api就可以关闭loading页面
QunarAPI.hideLoadView({})
```



#### Q: 如何判断去哪儿客户端中的webview是普通的webview还是支持qunarAPI的webiew
A: 有三种方法：   
* 如果有QApp和QApp-Hy的话，用QApp.hy.sniff.hyApp判断   
* 如果没有的话，自己写一个

```js
document.addEventListener('WebViewJavascriptBridgeReady', function (event) {
 	// 进了这个就说明是hy的
}
```

* 或者判断

```js
if(typeof ___WebViewJavascriptBridgeReady___ === 'undefined'){
	// 说明是不支持hy的webView，不过这个有可能是hy环境没有注入完成，所以在页面加载完成一段时间后判断比较准确
}
```