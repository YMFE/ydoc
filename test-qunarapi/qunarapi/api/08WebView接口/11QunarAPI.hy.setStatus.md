* 功能描述：设置状态栏颜色
* 使用场景：希望修改状态栏颜色，比如页面是黑色，希望设置状态栏颜色为白色
* 对应native接口：`qunarnative.status`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>cook 新大客户端</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>暂未发布</td>
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
QunarAPI.hy.setStatus({
    // 设置状态栏颜色
    style: 'light', //状态栏颜色，只能为default（黑色）或者light（白色），不传参数（不代表style为空）时默认为default。

    success: function(res){
        console.log(res.style);//设置成功的状态栏颜色
    },
    fail: function(res){
        console.log('%s %s', res.code, res.errmsg);
    }
})
```