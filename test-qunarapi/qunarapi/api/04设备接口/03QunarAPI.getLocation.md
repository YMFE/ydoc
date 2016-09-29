* 功能描述：获取地理位置接口
* 对应native接口：`geolocation.getCurrentPosition`

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
        <td>HY.browser</td>
        <td>大客户端browser vid: 20+ </td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>支持</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>支持</td>
    </tr>
</table>


```js
QunarAPI.getLocation({
    // type 参数支持wechat，hy未实现
    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    timeout: 5000,  // 非必填。当定位时间超出此限制时，调用失败回调。单位：ms
    maximumAge: 3000, // 非必填。可以接受的缓存定位结果时间，当上次定位的时间距今在设定值的范围内，则直接使用上次的定位结果。可用于快速定位、对精度要求不高的场景。单位：ms
    success: function(res){
        // TODO: 与微信的结构不一致
        // res 结构
        res = {
            "type": "baidu", // gps , baidu
            "coords": {
                "latitude": 1,  // 纬度，浮点数，范围为90 ~ -90
                "longitude": 1, // 经度，浮点数，范围为180 ~ -180。
                "accuracy": 1, // 位置精度
                "timestamp": "111111", // 格式不统一
                "type": '' // GPS, baidu (未上线)
            }
        }
    },
    fail: function(){
        alert(JSON.stringify(arguments))
    }
})
```
<table>
    <tr>
        <th>参数名</th>
        <th>类型</th>
        <th>必填</th>
        <th>默认值</th>
        <th width="220">描述</th>
        <th width="80">支持版本</th>
    </tr>
    <tr>
        <td>timeout</td>
        <td>Number</td>
        <td>非必填</td>
        <td>5000</td>
        <td>当定位时间超出此限制时，调用失败回调。单位：ms</td>
        <td>iOS: 4.7.2 Android: 待定</td>
    </tr>
    <tr>
        <td>maximumAge</td>
        <td>Number</td>
        <td>非必填</td>
        <td>3000</td>
        <td>可以接受的缓存定位结果时间，当上次定位的时间距今在设定值的范围内，则直接使用上次的定位结果。可用于快速定位、对精度要求不高的场景。单位：ms</td>
        <td>iOS: 4.7.2 Android: 待定</td>
    </tr>
</table>
