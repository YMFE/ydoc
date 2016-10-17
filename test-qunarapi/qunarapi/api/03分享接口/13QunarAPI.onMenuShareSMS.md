* 功能描述：获取“短信”按钮点击状态及自定义分享内容接口
* 对应native接口：`onMenuShareSMS`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011090<br/>独立客户端 HytiveLib 1.1.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 20+ </td>
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
QunarAPI.onMenuShareSMS({
    title: '分享到短信', // 标题
    link: 'http://hy.qunar.com/', // 链接URL
    desc: '分享到短信，描述', // 描述
    imgUrl: 'http://source.qunarzz.com/common/hf/logo.png', // 分享图标
    success: function () {
        alert('设置完成')
    },
    fail: function () {
        alert('设置失败')
    }
});
```
