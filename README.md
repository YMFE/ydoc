qdoc
=============================
依赖于fekit

## 安装
    
    npm install fekit-extension-qdoc -g

## 使用流程
1. 在需要项目使用目录下执行 fekit qdoc init 命令,将在该下生成一个docfile.config文件
2. 安装demo配置docfile.config文件
3. 使用fekit qdoc build生成文档站


## init命令参数介绍 
### --demo || -d 在当前目录下生成一个有demo的 docfile.config 文件，内容如下：
     {
         "destDir": "yo-docs",    //生成的文档目录
         "webSiteUrl": "http://ued.qunar.com/mobile/yo/doc/", //项目连接地址
         "template_js": "./template/template_js.html",   //js文件模板
         "template_scss": "./template/template_scss.html",  //scss文件模板
         "template_static": "./template/template_static.html", //静态文件代码模板
         "project": {
             "title": "YO Document",
             "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2015<br /> Style Build By <a href='http://bootcss.com'>Bootstrap</a>",
             "version": "1.1.0",
             "banner": {
                 "title": "Yo 简介",
                 "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
             },
             "pages": [
                 {
                     "name": "index",
                     "title": "起步",
                     "type": "markdown",  
                     "content": "./README.md"
                 },
                 {
                     "name": "changelog",
                     "title": "历史",
                     "type": "markdown",
                     "content": "./changelog.md"
                 },
                 {
                     "name": "api",
                     "title": "文档",
                     "type": "scss",
                     "content": "./lib/**/*.scss"
                 },
                 {
                     "name": "api",
                     "title": "文档",
                     "url": "http://ued.qunar.com/mobile/yo/demo/"
                 }
             ]
         },
         "version": "0.0.1"
     }

### --mudule || -m 获取模板文件 
* 使用条件，当提供的模板不足以满足项目需求时，获取并修改
* 使用方式， fekit qdoc init -m 下载模板文件到项目根
* 然后编辑template下的模板文件
* 编辑  docfile.config 文件   


## build命令
fekit qdoc build 


##私有命令 kami  yo

### Kami 专门为Kami项目创建文档站使用，具体使用如下：

```
进入到 kamiall/src/kami/scripts 目录下执行 [sudo] fekit qdoc kami
```

## Kami 专门为Yo项目创建文档站使用，具体使用如下：


```
进入到 Yo 根目录下执行 [sudo] fekit qdoc yo
```

## CSS文件注释规则(具体参考Yo注释)

### 注释规范

```
    /**
     * @module 一级分类 module
     * @class 二级分类
     * @skip 是否解析改注释块,有此标签为不解析
     * @method 方法名
     * @description 描述信息
     * @demo demo描述 demo地址（空格区分）
     * @param {type} $name param描述 &版本支持 （空格区分，版本号为&区分）
     * @param {Color} {type} $name param描述 &版本支持  #废除不推荐版本 （空格区分 版本号为&区分 废除不推荐版本为#区分）
     * @private 改方法是否标示为私有
     * @version 此method在yo的哪个版本以上支持
     * @example example描述|example code （|区分）
     */
```

### 注释示例

```
    /**
     * @module ani
     * @class fade
     * @skip
     * @method yo-checked
     * @description 构造单选多选的自定义使用方法，可同时作用于 checkbox 与 radio
     * @demo 使用方法，详见 http://doyoe.github.io/Yo/demo/element/yo-checked.html
     * @param {String} $name 为新的扩展定义一个名称
     * @param {String} $content 标记（对勾，圆点或者任意字符，可以是webfonts的编码）
     * @param {Length} $size 元件大小 &1.1.0
     * @param {Length} $font-size 标记大小 &1.1.0
     * @param {Length} $border-width 边框厚度
     * @param {Color} $bordercolor 边框色
     * @param {Color} $bgcolor 背景色
     * @param {Color} $color 标记色
     * @param {Color} $on-bordercolor 选中时的边框色
     * @param {Color} $on-bgcolor 选中时的背景色
     * @param {Color} $on-color 选中时的标记色 &1.1.0+

     * @param {Length} $radius 圆角半径长度
     * @private
     * @demo dfasdfas http://doyoe.github.io/Yo/demo/element/yo-checked.html
     * @version 1.1.1
     * @example 实例代码描述拓展yo-checked | @include .yo-checked(
     *   $name: default,
     *   $content: default,
     *   $size: default,
     *   $on-bgcolor: default)
     *
     */
```


## JS文件注释规则(具体参考kami项目注释)

### 注释规范

```
    /**
     * @category 一级分类 module
     * @extends 二级分类
     * @skip 是否解析改注释块,有此标签为不解析
     * @class 类名
     * @description 描述信息
     * @property {type} name property描述
     * @demo demo地址
     * @param {type} $name param描述 &版本支持 （空格区分，版本号为&区分）
     * @param {Color} {type} $name param描述 &版本支持  #废除不推荐版本 （空格区分 版本号为&区分 废除不推荐版本为#区分）
     * @example example描述|example code （|区分）
     */
```

```
    /**
     * @property {type} name property描述
     * @property {type} name property描述
     * @memberOf 类名
    */
```

```
    /**
     * 事件描述
     * @event 事件名
     * @memberOf 类名
    */
```

```
     /**
      * 方法说明
      * @function 方法名
      * @memberOf 类名
      * @private 
      * @example ****
      */
```

### 注释示例

```
    /**
     * @category primary
     * @extends Widget
     * @class Alert
     * @description 描述信息
     * @demo http://ued.qunar.com/mobile/kami/demos/src/html/alert/index.html     
     */
```
```   
   /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {String| HTMLElement} content 弹窗的内容
     * @property {String}  extraClass 会额外添加到组件根节点的样式
     * @property {Boolean} align 组件的对齐方式，center、bottom、top，默认为center
     * @property {Boolean} resizable 是否会根据窗口大小重新调整位置，默认为true
     * @property {String| HTMLElement} okText 确定按钮的文案
     * @memberOf Alert
     */
``` 
```
    /**
     * 处理组件数据
     * @function init
     * @memberOf Alert
     * @private
     */
```
```     
     /**
      * 按钮点击触发的事件
      * @event ok
      * @memberOf Alert
      */
```

# TODO

* 把所有静态文件统一放到一个站点
* 模板以及配置文件可配