* 功能描述：设置当前view导航状态，隐藏或者显示（仅仅在设置有导航栏的情况下有效）
* 使用场景：需要暂时隐藏导航栏或者把隐藏的导航栏显示出来的时候使用
* 对应native接口：`navigation.display`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYViewController</td>
        <td>大客户端 vid >= 80011105</td>
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
QunarAPI.hy.setNavDisplayStatus({

    action:"hide",  //需要设置的状态，只能为"hide"和"show"
    animate:"movetop", //暂时支持2个值，"none"为无动画，"movetop"为移动动画。可选，无值则默认为"none"
    time:0.4, //动画的持续时间，单位为秒，只有当animate不为"none"是有效。可选，无值则默认为0.4
    hideStatusBar:true,// 当action为"hide"时是否隐藏状态栏，仅支持iOS。可选，无值则默认为false
    success: function(){
        // do something  动画完成后想要执行的操作
    },
    fail: function(res){
        console.log('%s %s', res.code, res.errmsg);
    }
})
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
        <td>action</td>
        <td>string</td>
        <td>要设置的状态</td>
        <td rowspan="3">√</td>
        <td rowspan="3">√</td>
        <td rowspan="3">X</td>
        <td rowspan="3">X</td>
    </tr>      
    <tr>
        <td>animate</td>
        <td>string</td>
        <td>使用的动画，暂时支持"none"(无动画)和"movetop"(移动动画)。可选，默认为"none"。</td>
    </tr>      
    <tr>
        <td>time</td>
        <td>number</td>
        <td>动画持续时间，单位为秒。可选，默认为0.4</td>
    </tr> 
    <tr>
        <td>hideStatusBar</td>
        <td>BOOL</td>
        <td>当action为"hide"时是否隐藏状态栏。<br/>为true时，状态栏也会被隐藏。可选，默认为false</td>
        <td>√</td>
        <td>X</td>
        <td>X</td>
        <td>X</td>
    </tr> 
</table>
