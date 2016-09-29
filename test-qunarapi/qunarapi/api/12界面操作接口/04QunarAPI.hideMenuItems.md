* 功能描述：批量隐藏功能按钮接口
* 对应native接口：`hideMenuItems`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYWebVC</td>
        <td>不支持</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>不支持</td>
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
QunarAPI.hideMenuItems({
    menuList: [] // 要隐藏的菜单项
})
```