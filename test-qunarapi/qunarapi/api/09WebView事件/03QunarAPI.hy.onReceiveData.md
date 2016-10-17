* 功能描述：子view关闭后接收数据触发。
* 使用场景：需要接收子view反馈数据时绑定该事件。作为父view，子view关闭后被触发。
* 对应native接口：`webview.onReceiveData`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYViewController</td>
        <td>大客户端 vid >= 80011092<br/>独立客户端 HytiveLib 1.1.0</td>
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
QunarAPI.hy.onReceiveData({
    success: function(){
        // Do something
    }
});
```
