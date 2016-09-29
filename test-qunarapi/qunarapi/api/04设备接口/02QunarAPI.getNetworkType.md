* 功能描述：获取网络状态
* 对应native接口：`network.getType`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011090<br/>独立客户端 HytiveLib 1.0.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.hy + HY.browser</td>
        <td>大客户端hy vid: 11+ <br/> hy Nexus vid: 1.1.5+ <br/> 大客户端browser vid: 20+ </td>
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
QunarAPI.getNetworkType({
    success: function(res){
        // 返回网络类型2g，3g，2g/3g，4g，wifi，unknown
        var networkType = res.networkType;
        alert('当前网络连接方式为：' + networkType)
    },
    fail: function(){
        alert(JSON.stringify(arguments))
    }
})

```