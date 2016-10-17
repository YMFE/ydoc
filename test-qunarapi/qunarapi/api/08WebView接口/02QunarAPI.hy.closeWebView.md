* 功能描述：关闭当前view
* 使用场景：用户进行操作后，直接关闭view的接口。可传递数据
* 对应native接口：`webview.back`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYViewController</td>
        <td>大客户端 vid >= 80011089<br/>独立客户端 HytiveLib 1.0.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 20+</td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>不支持</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>不支持</td>
    </tr>
</table>


```js
QunarAPI.hy.closeWebView({
    name: 'nameOfView'  // 非必填。不填回退到上级。如果位于大客户端内，可指定view名称，直接回退到该名称的view上
    // 非必须。view 通信，传递数据到指定view
    ,data: {

    }
});
```
