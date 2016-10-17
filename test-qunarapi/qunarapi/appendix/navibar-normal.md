当webView的type类型为navibar-normal时，`navigation`参数各字段详细解释如下：

``` js
navigation:{
    color: colorOptions     // 颜色属性
    title: titleOptions,    // 导航栏标题位置配置
    left: leftOptions,      // 导航栏左侧按钮配置
    right: rightOptions,    // 导航栏右侧按钮配置
}
```
### 颜色属性
`color` 字段用于设定导航栏以及导航栏上按钮的颜色, 所有的color都是**可选的**，不设置则使用的是默认值

```js
color: {
    backgroundColor: '#000000', //背景颜色
    textColor: {
        normal: '#FF0000', //文字普通颜色
        selected: '#8464E3' //文字选中颜色
    }
}
```

`title`、`left`、`right`字段都可以设置color属性，背景颜色和文字颜色设置优先级为：元素内部color结构>外部默认color结构>框架默认颜色。
left和right可以为数组，数组的每一项都支持 color:{} 参数设置的结构。这个结构为默认统一的结构。如下：

```js
color: {
    backgroundColor: '#xxxxxx', //背景颜色 (因为iOS中按钮不存在背景颜色，所以在iOS中不起作用)
    textColor: {
        normal: '#xxxxxx', //文字普通颜色
        selected: '#xxxxxxx' //文字选中颜色
    }
}
```

当title里面的style为segment时，title里面的color结构比较特殊。为导航条特别设置的color结构。如下：

```js
color: {
    backgroundColor: {
        normal: '#xxxxxx', //背景普通颜色
        selected: '#xxxxxx' //背景选中颜色
    },
    textColor: {
        normal: '#xxxxxx', //文字普通颜色
        selected: '#xxxxxx' //文字选中颜色 (iOS中不能设置,iOS中segment选中按钮的文字为透明，显示的颜色为navigationBar的颜色)
    }
}
```

### title字段

`title` 字段用于定义导航栏标题区域。可以有以下几种取值：

- 文字标题  
![](source/images/navtitle1.png)

```js
title: {
    style: 'text',
    text: '标题',
    color: { //和外层color相同，优先级高于外层，图中是没有设置color，使用的默认颜色
        backgroundColor: '#xxxxxx', //背景普通颜色
        textColor: {
            normal: '#xxxxxx', //文字普通颜色
            selected: '#xxxxxx' //文字选中颜色
        }
    }
}
```

- 位置类标题  
![](source/images/navtitle2.png)

``` js
title: {
    style: 'location',
    text: '北京',
    color: { //和外层color相同，优先级高于外层，图中是没有设置color，使用的默认颜色
        backgroundColor: '#xxxxxx', //背景普通颜色
        textColor: {
            normal: '#xxxxxx', //文字普通颜色
            selected: '#xxxxxx' //文字选中颜色
        }
    }
}
```

- 分段选择按钮   
![](source/images/navSegmentTitle.png)

```js
title: { // 指定标题
    style: 'segment',
    segments: [{
        title: 'A',
        name: 'a'
    }, {
        title: 'B',
        name: 'b'
    }],
    color: { //和外层color相同，优先级高于外层，图中是没有设置color，使用的默认颜色
        backgroundColor: {
            normal: '#xxxxxx', //背景普通颜色
            selected: '#xxxxxx' //背景选中颜色
        },
        textColor: {
            normal: '#xxxxxx', //文字普通颜色
            selected: '#xxxxxxx' //文字选中颜色
        }
    }
}
```


### left字段
`left`字段用于定义导航栏左侧区域。可以有以下几种取值：

- native返回  
![](source/images/navbutton1.png)  
不写left字段即可
- 文字按钮

**left和right的文字的长度限制：ios最多显示四个汉字，adr最多显示两个汉字。如果想显示更多的文字，可以考虑不使用native的header。**

![](source/images/navbutton2.png)  

``` js

left: {
    style: 'text',
    text: '按钮',
    name: 'leftButton', // 可选，不设置则默认为left
    color: { //和外层color相同，优先级高于外层，图中是没有设置color，使用的默认颜色
        backgroundColor: {      // iOS中按钮无背景，故设置无效
            normal: '#xxxxxx',  //背景普通颜色
            selected: '#xxxxxx' //背景选中颜色
        },
        textColor: {
            normal: '#xxxxxx', //文字普通颜色
            selected: '#xxxxxx' //文字选中颜色
        }
    }
}

```
- 图标按钮  
![](source/images/navbutton3.png)  

``` js
left:{
    style: 'icon',
    icon: '\uF067',
    //icon类型 设置color无效
}
```  
icon按钮需要事先向应用中嵌入相应的web font字体文件。[icon编码查看](http://iconfont.corp.qunar.com/)

### right字段
`right`字段用于定义导航栏右侧区域。除去不具备native返回功能之外，与`left`字段相同。

**left和right的文字的长度限制：ios最多显示四个汉字，adr最多显示两个汉字。如果想显示更多的文字，可以考虑不使用native的header。**

除此之外，对于左右按钮可以通过action指定其完成特定的native功能：

```js
right:{
    style: 'icon',
    icon: '\uf0cc',
    action: 'share'
}
```
`right`字段也支持数组来设置多个按钮

```js
right: [{
    style: 'icon',
    icon: '\uf0cc',
    action: 'share'
}, {
    style: 'text',
    text: '第二个按钮',
    name: 'button2', // 可选，不设置则默认为right，通过调用 QunarAPI.hy.onNavClick 可以监听到按钮的点击，根据按钮的名字就可以定位到被点击的按钮
}]
```
目前支持的action取值： `share`，弹出分享界面。