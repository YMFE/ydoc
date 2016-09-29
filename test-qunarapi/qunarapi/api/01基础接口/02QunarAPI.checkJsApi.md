* 功能描述：判断当前客户端版本是否支持指定JS接口
* 使用场景：在不确定当前客户端对API支持情况下检测
* HY不支持的验证方法：onShow、onHide、onReceiveData、onceReceiveData、onCloseWebView、onceCloseWebView、onNavClick
* 对应native接口：`checkJsApi`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011090<br/>独立客户端 HYLib 1.0.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
		<td>大客户端browser vid: 20+</td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>API: 1.0.6</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>API: 1.0.0 (回调函数的参数格式不匹配)</td>
    </tr>
</table>

```js
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
```