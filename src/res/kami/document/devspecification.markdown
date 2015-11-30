
# Kami组件开发规范

#### 0.如何基于开发Kami的组件

[安装kamibuilder](http://ued.qunar.com/mobile/kami/doc/tool.html)
    
    //fekit kami init TestWidget
    $ fekit kami init [组件名]

  ...

    //引用Widget
    //Kami是Kami组件所在为路径的alias

    var Widget = require('Kami/scripts/core/index.js');
    //创建TestWidget UI组件
    var TestWidget =  Widget.extend({
        options : {
            type: 'widgetName',
            container: '组件的容器',
            template: '组件的模板如果需要'//和ui的唯一样式命名空间

        },
        //组件的事件，需要代理到this._widgetEl上，其中this._widgetEl是在解析模板后获得的
        // 'tap [data-role="list-item"]': 'handler'
        events: {
            '<eventType> <selector>': '<functionName | eventHandlerFunction>'
        },
        //当前组件的模板解析，返回解析好的模板字符串
        parseTemplate: function(tpl) {

        },
        //处理组件的数据
        init: function() {},
        //将组件渲染到容器中，默认基类提供渲染
        render: function() {
            //组件自有的处理逻辑
            //...
            //调用父类的方法，将组件渲染到文档中
            TestWidget.superClass.render.call(this);
        },
        //销毁组件，默认不需要写，基类提供销毁方法，如果组件有自己内部的事件，需要在destroy时销毁事件或者定时器.然后调用父类destroy方法即可
        destroy: function() {
            //销毁组件自身的定时器或者事件
            //....

            //调用父类的方法，将组件销毁
            TestWidget.superClass.destroy.call(this);
        }
    });

#### 1.组件样式组织

kami中的组件样式默认是依赖[Yo](http://ued.qunar.com/mobile/yo/doc/index.html)的。

 * 开发新组件`{widget}`时，需要提供同名的`{widget}.scss`文件
 
#### 2.目录规范


可以通过使用脚手架来完成新组件的创建，脚手架基于fekit，请先安装fekit

    0. [sudo] npm install fekit -g
    1. [sudo] npm install fekit-extension-kami [-g]
    2. fekit kami init <widgetName>



一个组件的目录结构如下：

    
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
    
    


##### 2.1 `HISTORY.md` 文件

组件的更新历史记录。

##### 2.2 `README.md` 文件

组件使用说明，包括 Web 组件 API 介绍、使用技巧、注意事项等。

##### 2.3 `index.js` 文件

组件的入口文件，默认引用src/{widget}.js

##### 2.4 `kami.config` 文件

组件的说明和配置


    {
        //组件的集合名称，默认都为kami
        "family": "kami",
        
        //组件的名称
        "name": "base",

        //组件的分类，core，primary, business, tool, external
        "category": "core",

        //组建的版本号
        "version": "1.0.0",

        //组件的依赖
        "dependance": {
            "class": "1.0.0"
        },

        //组件的描述
        "description": "非ui类的组件工具的基类",

        //组件的默认的git仓库地址
        "repository": {
            "git": "git@gitlab.corp.qunar.com:kami/base.git"
        }
    }


**组件的分类**

* core 核心库
* external 外部组件封装
* tool 工具类组件
* primary 基础组件
* business 业务组件

##### 2.5 `src` 文件夹

`src` 目录包含 Web 组件的模板（string）、交互（js）,默认所有的模板(string)都需要放到`tpl`文件夹下

###### 2.5.1 `{widget}.js` 文件

组件的交互逻辑。组件默认开发使用CMD规范。工具类组件默认继承`Base`，UI类组件默认继承`Widget`，组件内部的选择器通过`data-role`来实现，例如：

    data-role="scroll"

###### 2.5.2 tpl 文件夹，存放组件需要的模板文件

* 组件的模板文件默认用`.string`拓展名
* `yo-{组件名}`为组件的基础标识符，组件的所有子元素的样式都基于此命名
* 模板默认语法

如下：

    //条件语句
    {{#if}} {{#else if}} {{/if}}
    //循环语句
    {{#each}}{{/each}}
    //变量输出
    {{value}}
    //html转义
    {{#htmlString}}

具体模板例如：


    <div class="yo-calendar yo-select {{className}}">
        {{#each list as section}}
        <div class="{{itemClass}} yo-select-item" data-role="item">
            {{#if section.tag}}
            <span class="{{tagClass}} yo-select-item-tag">{{section.tag}}</span>
            {{/if}}
        </div>
        {{/each}}
        <div class="mask" data-role="mask"></div>
    </div>


##### 2.5 `test` 文件夹

用于存放用户的测试demo的测试用例

### 3.命名规范

##### 3.1 文件和文件夹命名


1. 所有文件或者文件夹的命名都只能包含 **[a-zA-Z]**，除`HISTORY.md`和 `README.md`外，其他文件都必须小写 例如pagelist、pagelist.js

##### 3.2 变量、常量、方法命名

1. 类名首字母必须大写，遵守Pascal命名规范，如 `Base`、`Widget`等
2. 模板文件名称首字母必须大写，遵守Pascal命名规范， 如 `LoadingTpl`
3. 常量需要全部大写，并且中间使用`_`连接， 如 `EVENT_PREFIX`
4. 默认选项必须全部大写并且中间使用`_`连接， 如 `DEFAULT_OPT`
5. 私有变量和方法以`_`开始， 如 `_cacheWidget` 私有方法、 `_widgetMap`私有变量
6. 其他变量和方法遵守驼峰，如 `parentNode` 变量、 `getClassNamePrefix`方法




### 4.历史记录书写规范

记录组件变更，如果有issue最好和issue进行绑定

   
    
    ### 1.1.0
    *  #18 修复了 XXX 问题
    * [fixed] #29 修复了 YYY 问题
    * [add] #12 增加了 ZZZ 功能
    * [modify] #23 优化了 BBB 代码
    ### 1.0.0
    * [new] 第一个发布版本
    

### 5.注释规范

所有注释都必须使用多行注释

    /**
     * 
     */

目前支持的注释标签 

 * @class 标签表明当前对象是个js的类
 * @constructor 标签表明当前的方法是个构造函数
 * @namespace 标签表明当前的对象是个命名空间
 * @event 标签表明当前function是一个事件
 * @function 标签表明当前的对象是一个`@function`
 * @property 标签表明当前的对象是一个属性，可用于class或者`@namespace`
 * @extends 标签表明当前对象继承用于`@class`对象
 * @mixin 标签表明当前对象混入了哪些`@class`或者`@namespace`对象
 * @category 标签用于标明js对象的分类，目前用于`@class`和`@namespace`
 * @name 标签用来表示当前对象的名称
 * @param 标签表示当前是个参数对象
 * @paramDetails 标签用于和@param使用用来说明`@param`的具体内容
 * @memberOf 标签所有的`@function`,`@event`, `property`都需要只通过`@memberOf`来指定
 * @private 标签默认只支持`@class`,`@namespace`,`@function`
 * @demo 标签默认支持`@class`,`@namespace`
 * @example 标签默认支持`@class`,`@namespace`,`@function`,`@event`
 * @template 标签用来表示当前是个模板对象
    
##### 5.1 `class`类

使用@class

    /**
     * @class className
     * @constructor
     * @extends extendClassName
     * @category cactegoryName
     * @demo demoLinkAddress
     */

##### 5.2 `namespace`命名空间

使用@namespace

    /**
     * @namespace namespaceName
     * 命名空间的描述
     * @name {Object} namespaceName
     * @private
     */
    
##### 5.3 `function`函数

使用@function
函数必须使用`@memberOf`来标记当前函数是属于那个类或者命名空间

```
    /**
     * 函数描述
     * 
     * @function functionName
     * @memberOf  memberOf
     * @private
     * @param  {paramType} paramName paramDescription
     */
```

##### 5.3 `event`事件

使用@event

```
    /**
     * 事件描述
     * @event eventName
     * @param  {paramType} paramName paramDescription
     * @memberOf memberOf
     */
``` 

##### 5.4 `example`例子

使用@example

```
    /**
     * @function functionName 
     * @example
     * Alert.show({
     *     content: 'aaa',
     * });
     */
```

##### 5.5 `property`属性

使用@property

```
    /**
     * @property {propertyType} propertyName propertyDescription
     * @property {propertyType} propertyName propertyDescription
     * @memberOf memberOf
     */
<<<<<<< HEAD
```
=======
    
##### 5.5 `template`属性

使用@template

    /**
     *
     * @template itemTpl
     * 列表选项的模板，该模板自定义时，itemTpl的模板
     * 必须含有data-role="list-item" 和 data-index={{dataIndex}}两个属性
     * @memberOf Pagelist
     * @path ./tpl/pagelist-item.string
     * 
     */

@path表示当前模板的相对路径，@path必须写在注释块最后
>>>>>>> 494b4723fcaa97f08485e701bacd6ac67f97bc7c
