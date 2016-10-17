* 功能描述：设置webview是否支持ios的后退手势
* 使用场景：需要单独开启或关闭ios的后退手势时
* 对应native接口：`qunarnative.gesturesView`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYWebVC</td>
        <td>大客户端 vid >= 80011089</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>不支持</td>
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
QunarAPI.hy.enableBackGesture({
    enable: true/false  // true为开启，false为禁止
});
```