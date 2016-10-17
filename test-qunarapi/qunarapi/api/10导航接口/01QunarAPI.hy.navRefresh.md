* 功能描述：改变当前view导航样式
* 使用场景：当导航样式需要在用户交互发生改变的情况下调用
* 对应native接口：`navigation.refresh`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYViewController</td>
        <td>大客户端 vid >= 80011089<br/>独立客户端 HytiveLib 1.0.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 20+</td>
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
QunarAPI.hy.navRefresh(
    // 与openWebview中的navigation字段相同，详情见附录1。
    {
        title: {
            style: 'location',
            text: '北京'
        }
    }
)
```

#### 请求参数说明
<table style="text-align:center">
    <tr>
        <th width="100">参数</th>
        <th width="80">类型</th>
        <th width="220">说明</th>
        <th width="80">iOS</th>
        <th width="80">Android</th>
        <th width="80">touch</th>
        <th width="80">wechat</th>
    </tr>
    <tr>
        <td></td>
        <td>object</td>
        <td>navigation参数，见<a href="http://hy.qunar.com/docs/qunarapi-appendix.html#附录1-导航栏选项">附录1</a></td>
        <td>√</td>
        <td>√</td>
        <td>X</td>
        <td>X</td>
    </tr>  
</table>
