* 功能描述：通过register扩展接口
* 使用场景：业务线有新的非公共HY插件，扩展到QunarAPI

*** 注：本接口不依赖`QunarAPI.ready`，一定记得先注册再使用，否则会报`undefined`。 ***

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>所有版本</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.hy + HY.browser</td>
        <td>大客户端hy vid: 11+ <br/> hy Nexus vid: 1.1.5+ <br/> 大客户端browser vid: 20+ </td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>支持</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>不支持</td>
    </tr>
</table>

*** 注：***

native的桥有三种调用方式：

* 如果`name`里有`once`，会用`once`的方式来调用native的桥（即监听并且只触发一次）。
* 如果`name`里有`on`，则会用`on`的方式来调用native的桥（即监听）。
* 默认会用`invoke`的方式来调用native的桥（即触发）。
* `on`绑定的事件，可以通过`off`来解绑，具体可以看`QunarAPI.off`。
	
```js
QunarAPI.register(
    name,            //接口名称
    key,             //bridge名称
    namespace        //命名空间，业务方建议使用自己的命名空间
);

// trigger的方式，每次触发
QunarAPI.register('doSomething', 'doSomething', 'xxx');

// once的方式，触发一次
QunarAPI.register('onceDoSomething', 'onceDoSomething', 'xxx');

// on的方式，监听
QunarAPI.register('onChangeSomething', 'onChangeSomething', 'xxx');


// 注册
// QunarAPI.register('openWebView', 'webview.open', 'hy');
// 调用 
// QunarAPI.hy.openWebView({
//    success : function(){},
//    fail : function(){}
//  }) 
```
