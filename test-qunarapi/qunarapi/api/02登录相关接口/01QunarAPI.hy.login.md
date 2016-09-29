* 功能描述：唤起登录状态或者登录框
* 使用场景：登录
* 对应native接口：`login.start`
	
<table style="text-align:center">
    <tr>
        <th >运行环境</th>
        <th >环境配置</th>
        <th >支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011090<br/>独立客户端 不支持</td>
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
        <td>不支持</td>
    </tr>
</table>

```js
// 获取登录状态
QunarAPI.hy.login({
    shouldOpenLogin: false, // 获取登录状态
    success: function(res) {
        // 登录成功
    },
    fail: function(res){
        // 未登录返回的数据
        res = {
            "0": {
                "errcode": 1,
                "errmsg": "登录失败",
                "ret": false
            }
        }
    }
});
```

```js
// 唤起登录界面
QunarAPI.hy.login({
    shouldOpenLogin: true, // 指示是否允许弹登录界面，不允许时未登录直接返回登录失败,true=允许, false=不允许
    success: function(res) {
        // 返回的数据
        res = 
        {
            "userAvatar": "http://img1.qunarzz.com",
            "userEmail": "",
            "userID": "123123",
            "userName": "",
            "userNickname": "gtts",
            "userUserID": "s_sdfsdfsdfsdf"
        }
    },
    fail: function(res){
        console.log('%s %s', res.code, res.errmsg);
    }
});
```