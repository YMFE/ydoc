* 功能描述：设置通用分享内容接口。自定义通用分享内容，并获取分享状态
* 对应native接口：`onMenuShare`

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
        <td>支持</td>
    </tr>
</table>


```js
QunarAPI.onMenuShare({
    title: '通用分享', // 标题
    link: 'http://hy.qunar.com/', // 链接URL
    desc: '通用分享，描述', // 描述
    imgUrl: 'http://source.qunarzz.com/common/hf/logo.png', // 分享图标
    success: function () {
        alert('设置完成')
    },
    fail: function () {
        alert('设置失败')
    }
});
```
