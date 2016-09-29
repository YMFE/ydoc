* 功能描述：QunarAPI.hy.schemeForResult
* 对应native接口：`schemeForResult`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011118</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 41+</td>
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
QunarAPI.hy.schemeForResult({
    //调用Native的scheme，比如打开日历的scheme，必填
    scheme: 'qunariphone://xxxxx', 

    //Native回调成功（success()是否调用取决于Native代码是否回调）
    success: function(data) {
        //data 是通过scheme调用Native后，Native返回的数据
        //需要注意的是这个data的结构是由Native逻辑所决定的，
        //因此如果iOS和安卓的Native代码实现不一致，该data的结构也会不一致！！！
    },

    //scheme打开失败或者参数错误 
    fail: function(err) {
        alert(JSON.stringify(err))
    },
})
```