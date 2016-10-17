* 功能描述：页面loading结束前触发
* 使用场景：解决双loading问题。在loading将要结束时，会触发这个消息，此时显示的还是hy的loading动画页面。前端回调 callback( {data: true} ) 则阻止隐藏当前的loading动画页面，之后可以调用 [QunarAPI.hideLoadView( )](qunarapi-api.html#WebView接口-QunarAPI-hideLoadView) 来隐藏loading动画页面。前端回调callback( {data: false} )则立即隐藏loadingy动画。如果前端没有回调的话，则默认在500ms后关闭loading动画页面。
* 对应native接口：`loadingview.close`

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
        <td>大客户端browser vid: 32+</td>
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
QunarAPI.onLoadingClose({
    success: function( data, callback){
        callback( {data: true} );
        //前端是否阻止隐藏loading动画页面，如果没有调用callback则500ms后关闭loading动画页面
        //{data: true}时loading动画页面会一直显示，隐藏由前端控制。在需要隐藏loading动画页面的时候调用函数 QunarAPI.hideLoadView(); 
        //{data: false}时loading动画页面立即隐藏
    }
});
```