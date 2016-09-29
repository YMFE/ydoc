当webView的type类型为navibar-transparent时，`navigation`参数各字段详细解释如下：

``` js
navigation: {
    left: [{ 
        //第一个按钮默认为返回键
        icon: '\uf066', 
        name: 'leftButton1',
        
    }, {
        icon: '\uf078', 
        name: 'leftButton1',
    }],
    right: [{
        icon: '\uf067',
        name: 'rightButton1',
    }, {
        icon: '\uf068', 
        name: 'rightButton2',
    }],
}
```
[icon编码查看](http://iconfont.corp.qunar.com/)

使用默认的按钮颜色如下：   
![](source/images/nav-trans-default.png) 


### left字段
`left`字段为***数组***，用于定义导航栏左侧区域的多个按钮，第一个按钮默认为返回键
对按钮的颜色的设置均为选填（PS：android的颜色设置在开发中～）

``` js
// 指定左侧按钮
 left: [{ 
            icon: '\uf066',             // 按钮样式，应用此字段作为图标
            name:'leftButton1',         // 按钮名称，用于区分点击的按钮
            foregroundColor:'#0000FF',  // 图标色，可选
            backgroundColor:'#00FF00',  // 图标填充色，可选
            borderColor:'#FF0000',      // 图标边框颜色，可选
        },{

            icon: '\uf078', 
            name:'leftButton2',         
            foregroundColor:'#0000FF',
            backgroundColor:'#00FF00',
            borderColor:'#FF0000',
            action:'share'              // 点击时的native功能，目前只支持'share'，可选
        }],

```
使用上面的颜色设置的按钮结果为：   
![](source/images/nav-trans.png)
### right字段
`right`字段定义和`left`一致，不过第一个按钮并不是返回键