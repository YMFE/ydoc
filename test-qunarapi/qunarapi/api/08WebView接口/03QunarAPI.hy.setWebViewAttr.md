* 功能描述：设置当前view的属性
* 使用场景：用户需要改变当前view的展示属性时
* 对应native接口：`webview.attribute`

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
QunarAPI.hy.setWebViewAttr({
    // webView是否可以滚动
    scrollEnabled: true, //是否允许native滚动（Android无效）
    // iOS滑动出document区域，展示出的背景颜色
    backgroundColor: '#fff', Hytive 1.0 // webview的背景颜色（Android无效）
    name:'name' // Hytive 1.0
});
```
