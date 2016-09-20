# Kami相关更新及发布

Kami更新如下

+ Kami 文档站
+ Kami Demo
+ Kami buildertool
+ Kami 1.0稳定版

## 1、 Kami 文档站

新版Kami文档站上线了，地址 [http://ued.qunar.com/mobile/qapp/doc/](http://ued.qunar.com/mobile/qapp/doc/)

## 2、 Kami Demo

新版Kami1.0 Demo上线了

+ [下载地址](http://ued.qunar.com/mobile/kami/demos/kami.zip)
+ [扫码看Demo](http://ued.qunar.com/mobile/kami/demos)


![http://simg2.qunarzz.com/mobile-fe/kami/demo2.png](http://simg2.qunarzz.com/mobile-fe/kami/demo2.png)

## 3、 Kami builertool

新版的Kami buildertool 0.2.7 发布拉~

#### 安装构建工具


    $ [sudo] npm install fekit-extension-kami



#### 初始化组件


    $ fekit kami init [组件名]


其中 `组件名` 是可选。如果不加 `组件名` ，则在当前目录下初始化组件目录及文件。否则，在当前目录下，会创建一个新的名为 `组件名` 的目录，在它下面初始化目录及文件。

*初始化的结构如下：*


    {widget}
    ├── HISTORY.md
    ├── README.md
    ├── build.sh
    ├── index.js
    ├── kami.config
    ├── test
    └── src
        ├── {widget}.js
        └── tpl
            ├── {widget}.string



#### 安装组件


+ 安装组件，会读取根目录下kami.config，如果不存在或格式错误，则安装失败。

```$ fekit kami install
```

+ 安装线上所有组件，忽略根目录下的kami.config

```$ fekit kami install --all
```

+ 安装指定组件

```$ fekit kami install [组件名/组件名@版本号] [--save]
```

#### 显示安装组件


    $ fekit kami list [--remote]

[--remote] 参数显示线上目前支持的组件

加入 `--remove` 参数，直接显示线上所有组件。

#### 移除组件


    $ fekit kami remove 组件名/组件名@版本号 [--save]


加入 `--save` 参数，移除组件的同时，也从kami.config的依赖项中移除（只针对组件，删除包含版本号的组件不起作用）

#### 更新组件

```$ fekit kami update 组件名/组件名@版本号
```

只更新入口文件。如果组件不存在，返回更新失败。


## 4、Kami组件 1.0 

Kami 1.0稳定版发布啦~~~

### changelog

#### 删除
 * `iscroll 组件`，iscroll的功能由panel和pagelist来提供
 * `numbers 组件`，更名为number组件
 * `tips 组件`， 更名为tip组件
 * `demo 组件`，demo不在kami组件内部维护，通过[查看demo](http://ued.qunar.com/mobile/kami/demos/index.html)

#### 修改
 * `alert 组件`，提供单例和多例两种形式，兼容老版本的单例用法，也可以通过new 来创建实例
 * `confirm 组件`，提供单例和多例两种形式，兼容老版本的单例用法，也可以通过new 来创建实例
 * `tip 组件`，提供单例和多例两种形式，兼容老版本的单例用法，也可以通过new来创建实例
 * `loading 组件`，提供单例和多例两种形式，兼容老版本的单例用法，也可以通过new 来创建实例
 * `overlay 组件`，组件显示和隐藏触发的事件分别由aftershow变更为show, afterhide变更为hide
 * `doublelist组件`，依赖的样式由yo-dblist 更改为yo-doublelist
 * `事件命名规范修改`，事件名称统一为小写，取消事件的命名空间，如change:value 通过修改为changevalue
 * `组件事件绑定方式`， 推荐使用`on`的形式来实现，例如:
 	
 	widgetInstance.on('eventName', function() {});
 	
 * `template模板引擎`，bugfix，支持arttemplate语法，支持html转义

    * 条件语句

        ```
        {{#if}}{{/if}}
        ```

    * 循环语句

        ```
        {{#each}}{{/each}}
        ```
        
    * 变量输出

        ```
        {{value}}
        ```
    * 变量输出(html转义)

         ```
        {{#value}}
        ```

#### 新增
 * `datepicker 组件`，官方提供了`datepicker`组件 [demo地址](http://ued.qunar.com/mobile/kami/demos/src/html/datepicker/index.html)
 * 提供编译并压缩后的 CSS、JavaScript 文件

 [点击下载kami.js](http://ued.qunar.com/mobile/source/kami/release/1.0.0/kami.js)

 [点击下载kami.css](http://ued.qunar.com/mobile/source/kami/release/1.0.0/kami.css)

```
    //引入kami.css
    <link rel=stylesheet href="kami.css">
    //引入kami.js
    <script src="kami.js"></script>
```
#### 和QApp相关的


 * `QApp的适配`统一由`QApp-plugin-kami-adapter`完成，通过fekit进行管理，使用新版本的adapter后，Kami在QApp中使用方式统一，完整的使用说明参考[http://l-registry.fe.dev.cn6.qunar.com/view/QApp-plugin-kami-adapter/0.0.6](http://l-registry.fe.dev.cn6.qunar.com/view/QApp-plugin-kami-adapter/0.0.6)，相对老版本的适配使用方式上变动如下：

```
fekit install QApp-plugin-kami-adapter
```

+ 引入Kami组件


```
//Kami是Kami组件所在的实际路径的别名
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
//挂载事件
pageList.on('loadmore', function() {});
```