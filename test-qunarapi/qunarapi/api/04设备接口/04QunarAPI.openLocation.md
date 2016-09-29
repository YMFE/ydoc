* 功能描述：使用经纬度打开本地地图
* 对应native接口：`openLocation`
	
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
        <td>未上线</td>
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
QunarAPI.openLocation({
    // 微信特有属性
    name: 'ha', // 位置名
    address: 'hah', // 地址详情说明
    scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
    infoUrl: 'http://qunar.com', // 在查看位置界面底部显示的超链接,可点击跳转
    // 公用
    latitude: '39.983667', // 纬度，浮点数，范围为90 ~ -90
    longitude: '116.312638' // 经度，浮点数，范围为180 ~ -180。
})
```