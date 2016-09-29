* 功能描述：监听导航条的点击事件
* 使用场景：需要在点击导航条时触发一定条件时调用
* 对应native接口：`navigation.click`

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
QunarAPI.hy.onNavClick({
    success: function( data ){
        switch( data.button ) {
            case 'title':
                alert('title clicked');
                break;
            case 'left':
            case 'right':
                break;
            case 'some_name_specified_before':
                alert('customize name button clicked');
        }
    }
});
```

* 如果为导航条中的组件指定了name属性，则button的值会使用组件对应的name属性的值。
* 如果定制了导航栏左侧按钮的行为，则需要在callback中通知native此事件已处理。
* 如果定制了导航栏左侧按钮的行为，如果未通知，native会在超时500ms后认定h5无法响应，调用关闭webview的方法。

```js
QunarAPI.hy.onNavClick({
    success: function( data, callback){

        switch( data.button ) {
            case 'left':
                // 需要回调客户端，通过通知客户端数据为true告诉native事件已经处理，停止默认事件
                callback( {data: true} );
                // do something
                break;
            default: 
                // do something
        }
    }
});
```
