* 功能描述：获取当前view导航状态，隐藏还是显示（仅仅在设置有导航栏的情况下有效）
* 使用场景：需要获取当前view的导航栏的状态
* 对应native接口：`navigation.displayStatus`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYViewController</td>
        <td>大客户端 vid >= 80011105
</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 32</td>
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
QunarAPI.hy.getNavDisplayStatus({

    success: function(res){
        var navStatus = res.status;//当前导航栏的状态
        //  导航栏状态可能的值为：
        //  "showed"    显示
        //  "hidden"    隐藏
        //  "showing"   显示动画中
        //  "hiding"    隐藏动画中
    },
    fail: function(res){
        console.log('%s %s', res.code, res.errmsg);
    }
})
```
