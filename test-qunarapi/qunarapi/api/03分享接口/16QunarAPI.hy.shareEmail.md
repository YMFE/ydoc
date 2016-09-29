* 功能描述：主动调起“邮件”分享内容接口
* 对应native接口：`shareEmail`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011092<br/>独立客户端 HytiveLib 1.1.0</td>
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
QunarAPI.hy.shareEmail({
    title: '分享到邮件', // 标题
    link: 'http://hy.qunar.com/', // 链接URL
    desc: '分享到邮件，描述', // 描述
    imgUrl: 'http://source.qunarzz.com/common/hf/logo.png', // 分享图标
    // 以下方法无效果
    success: function () {
        alert('邮件分享完成')
    },// 用户确认分享后执行的回调函数
    fail: function () {
        alert('邮件分享失败')
    } // 用户取消分享后执行的回调函数
});
```
