# Kami起步

#### Kami开发前须知

Kami组件依赖于Yo样式，因此引入组件的同时需要引入同名Yo样式，若非如此则需用户重写相关组件样式。

+ [使用Yo进行移动端开发](http://ued.qunar.com/mobile/yo/doc/)


#### CMD规范下的Kami组件使用方式

基于kami的开发首先需要安装Kami构建工具， kami构建工具依赖fekit，如需使用默认样式则需要安装Yo构建工具。

+ [如何安装fekit](http://wiki.corp.qunar.com/pages/viewpage.action?pageId=42273573)
+ [如何安装构建工具](tool.html)
+ [如何安装Yo构建工具](http://ued.qunar.com/mobile/yo/doc/)

在使用构建工具安装完组件和相应的样式以后，用户在需要引入组件的JS文件中`require`方式直接引用即可。如下：

```
var KamiAlert = require('./kami/scripts/alert/index.js');

```

#### 引入脚本文件的Kami组件使用方式

+  下载Kami组件和Yo样式压缩文件
+  直接在页面引入这两个文件


```
<link rel="stylesheet" type="text/css" href="http://ued.qunar.com/mobile/source/kami/release/1.0.0/kami.css"/>
<script src="http://ued.qunar.com/mobile/source/kami/release/1.0.0/kami.js" /></script>
```

+ 使用组件


```
var alert = new window.Kami.Alert({
    title: "提示",
    content: "test"
});
```
> **注意:**
> 所有组件，均在 *window.Kami* 命名空间中

#### 基于QApp的Kami组件使用方式

QApp作为一套完善的移动端框架提供了组件生命周期的管理，Kami组件使用适配器的方式来使用户无需关心组件的销毁。
 [使用QApp进行移动端开发](http://ued.qunar.com/mobile/qapp/doc/)


+ 安装Kami-QApp适配器

```
fekit install QApp-plugin-kami-adapter
```

+ 引入Kami组件

```
var KamiPagelist = require('Kami/scripts/pagelist/index.js');
```

+ 注册Kami组件到QApp上

```
QApp.util.KamiAdapterFactory.register('pagelist', KamiPagelist);
```

+ 为QApp上设置Kami组件默认配置

```
QApp.util.KamiAdapterFactory.setDefaultOptions('pagelist', { 
   refreshTpl: refreshTpl,
    loadmoreTpl: loadmoreTpl,
    // 刷新激活高度
    refreshActiveY: 40,
    // 加载更多容器高度
    loadmoreContY: 40,
    preventDefault: false,
    tapInterval: 1000,
    infinite: false
});
```

+ 在QApp中使用Kami组件


```
var pageList = QApp.showWidget('pagelist', {
        container: self.doms.list,
        datasource: err ? [] : data.shopList,
        checkedClass: 'item-on',
        pagesize: PAGE_SIZE,
        template: listWrapperTpl,
        itemTpl: listItemTpl,
        infinite: true,
        nodataTpl: noDataTpl,
        activeClass: 'item-light'
});
pageList.on('loadmore', function() {});
```

> **注意:**
> 使用Kami组件时请在QAppView生命周期处于Show时使用


+ 禁用Kami组件的`Tap`事件


由于Kami内部实现了Tap事件，QApp内部也实现了Tap事件，避免事件冲突所以需要禁用掉Kami的Tap事件


```
window.Kami.disableTapEvent = true;
```

+ 设置全局样式


```
window.Kami.theme = 'yo';
```


>** 附加:**
>QMB作为QApp项目构建管理工具，可以安装管理Kami组件。使用QApp的用户使用QMB项目的构建工具上配置Kami组价。

+ dhfudhfuhd