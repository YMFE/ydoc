* 功能描述：获取“去哪儿好友”按钮点击状态及自定义分享内容接口
* 对应native接口：`onMenuShareQunarIM`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>开发中~</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>开发中~</td>
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
QunarAPI.onMenuShareQunarIM({
    title: '分享到去哪儿好友', // 标题
    link: 'http://hy.qunar.com/', // 链接URL
    desc: '分享到去哪儿好友描述', // 描述
    imgUrl: 'http://source.qunarzz.com/common/hf/logo.png', // 分享图标
    // iOS，微信正常触发，Android暂时不触发
    success: function () {
        alert('设置完成')
    },
    fail: function () {
        alert('设置失败')
    }
});
```
