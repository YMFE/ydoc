* 功能描述：打开新的webView
* 使用场景：搞SPA的话native导航栏没法跟h5实现同步的动画效果，故此处将定义导航栏的API加入新开webView的API中，由调用新webView者决定下一页的导航栏样式。
* 对应native接口：`webview.open`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
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
QunarAPI.hy.openWebView({
    url: 'http://address.of.target.url/',

    // 以下参数当位于大客户端时可用：
    // 指定view的名称，可以在新页面返回时跳回指定名称的页面
    name: 'nameOfView',
    // view 通信数据，子view通过getInitData获取（iOS未上线）
    data: {},
    
    // 页面打开的进入的方式，可选，默认为'moveFromRight'，
    //'moveFromRight'为从右边切换进入，'moveFromBottom'为从屏幕底部进入屏幕 
    animate: 'moveFromRight',

    // navigation已经满足不了你了，这不重要
    type: 'navibar-normal',  // navigation样式，自己定制吧;
    /*
     * type:{
     * navibar-normal
     * navibar-transparent, // 透明导航条
     * navibar-none, // 无导航条
     * }
     */ 

    // 调整导航栏的外观，详情见附录1
    navigation: {
        title: { // 指定标题
            style: 'text', // 标题样式: text: 普通文本 | location: 标题右侧带一个小箭头
            text: '我是标题' // 标题文字
        },
        left: { // 指定左侧按钮
            style: 'text', // 按钮样式: text: 文本按钮 | icon: 图标按钮, 不填则保留一个默认的返回按钮
            text: '按钮', // 按钮样式为text时，应用此字段作为按钮文字
            icon: '\uf067' // 按钮样式为icon时，应用此字段作为图标
        },
        right: {
            // 跟left相同，但无默认按钮
        }
    },
    //页面关闭后返回的数据
    onViewBack: function(res){
        // res： 根据用户反馈的数据展示
    }
});
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
        <td>url</td>
        <td rowspan="2">string</td>
        <td>webview的url地址</td>
        <td rowspan="6">√</td>
        <td rowspan="6">√</td>
        <td rowspan="6">X</td>
        <td rowspan="6">X</td>
    </tr>
    <tr>
        <td>name</td>
        <td>view的名字</td>
    </tr>    
    <tr>
        <td>data</td>
        <td>object</td>
        <td>view通信数据，子view通过getInitData获取</td>
    </tr> 
    <tr>
        <td>animate</td>
        <td>string</td>
        <td style="text-align:left">新页面进入的方式，可选<br/>缺省值为moveFromRight<br/>也可为moveFromBottom</td>
    </tr>
    <tr>
        <td>type</td>
        <td>string</td>
        <td style="text-align:left">navibar的类型<br/>缺省值为navibar-normal<br/>也可为navibar-transparent (透明的navibar)、navibar-none (没有navibar)</td>
    </tr>

    <tr>
        <td>navigation</td>
        <td>object</td>
        <td>navigation参数<br/><a href="qunarapi-appendix.html#normal导航栏选项">type为navibar-normal时</a>
            <br/><a href="qunarapi-appendix.html#transparent导航栏选项">type为navibar-transparent时</a></td>
    </tr>    
</table>

