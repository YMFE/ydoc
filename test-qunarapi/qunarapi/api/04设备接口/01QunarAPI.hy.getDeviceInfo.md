* 功能描述：获取设备信息
* 对应native接口：`native.getDeviceInfo`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011090<br/>独立客户端 1.3.0+</td>
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
QunarAPI.hy.getDeviceInfo({
    hybridId:"flight_mall_service", //hybridId，大客户端不用，可不填
    success: function(res){
        // 返回的数据
        res = {
            pid: "";  // pid是标识这个是哪个包，比如，iOS、android，ios pro（iOS暂不支持，后面会提供）
            uid: "";  // uid是后端给每个设备分配的唯一标识符
            gid: "";  // gid是设备唯一标识符

            cid: "",
            mac: "",
            sid: "",
            vid: ""

            versioninfo:"" ;// 组件版本信息，仅android大客户端browser vid: 26+ 支持！
        }
    },
    fail: function(){
        alert(JSON.stringify(arguments))
    }
})

```
#### 请求字段说明  
<table style="text-align:center">
    <tr>
        <th width="120">参数</th>
        <th width="80">类型</th>
        <th width="220">说明</th>
        <th width="80">iOS大客户端</th>
        <th width="80">iOS独立客户端</th>
        <th width="80">Android</th>
        <th width="80">touch</th>
        <th width="80">wechat</th>
    </tr>
    <tr>
        <td>hybridId</td>
        <td>string</td>
        <td>请求资源包的hybridId</td>
        <td rowspan="6">X</td>
        <td rowspan="6">√</td>
        <td rowspan="6">√</td>
        <td rowspan="6">X</td>
        <td rowspan="6">X</td>
    </tr>
</table>

#### 返回字段说明   

<table style="text-align:center">
    <tr>
        <th>返回字段</th>
        <th>类型</th>
        <th>说明</th>
        <th width="80">iOS大客户端</th>
        <th width="80">iOS独立客户端</th>
        <th width="80">Android</th>
        <th width="80">touch</th>
        <th width="80">wechat</th>
    </tr>
    <tr>
        <td>pid</td>
        <td rowspan="10">string</td>
        <td>pid是标识这个是哪个包<br/>比如:iOS、android，iOS pro</td>
        <td rowspan="8">√</td>
        <td>√</td>
        <td rowspan="10">√</td>
        <td rowspan="10">X</td>
        <td rowspan="10">X</td>
    </tr>
    <tr>
        <td>uid</td>
        <td>设别唯一标识符</td>
        <td>√</td>
    </tr>
    <tr>
        <td>gid</td>
        <td>后端给每个设备分配的唯一标识符</td>
        <td>不返回</td>
    </tr>
    <tr>
        <td>cid</td>
        <td>渠道号</td>
        <td>√</td>
    </tr>
    <tr>
        <td>mac</td>
        <td>客户端mac地址</td>
        <td>√，iOS7+为:<br/>02-00-00-00-00-00</td>
    </tr>
    <tr>
        <td>sid</td>
        <td>服务器端分配的ID</td>
        <td>不返回</td>
    </tr>
    <tr>
        <td>vid</td>
        <td>vid信息</td>
        <td>√</td>
    </tr>
    <tr>
        <td>qpVersion</td>
        <td>hybridId对应资源包的版本信息</td>
        <td>√</td>
    </tr>     
    <tr>
        <td>versionName</td>
        <td>app版本号</td>
        <td>X</td>
        <td>√</td>
    </tr>     
</table>
