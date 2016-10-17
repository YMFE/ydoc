* 功能描述：获取abTest的策略信息，用于
* 对应native接口：`abTest.getCase`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011117</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 40+</td>
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
QunarAPI.abTest({
    abId: 160616_ho_xxx_xxx, //实验id
    simpleName: hotel_xxxx//使用该策略信息的来源(e.g. : vc name or class name),用于记录Log，有利于筛选日志。
    success: function(res) {
      //  res = {
      //      ab_type:ab_type , //策略类型
      //      ab_achieve:ab_achieve //策略信息
      //   }
    }
});
```
