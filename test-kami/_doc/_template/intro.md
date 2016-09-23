## 起步

#### 1. 获取Kami

- 方法一：**（推荐方式）**通过 [QMB2](http://ued.qunar.com/qmb2/) 在 `Hy` 项目中安装
- 方法二：通过 [KamiBuilder](./tool.html) 安装

作为 `Hy` 框架的一部分，推荐使用 `QMB2` 工具来管理 `Kami` 组件。

#### 2. 使用Kami


我们从一个简单的示例开始：

```
var Switch = require('./kami/scripts/switch');  // 引用组件

var switch = new Switch({  // 创建实例
    container: '.js_switch_container'
});

switch.render();  // 调用render方法

```

想要使用 `Kami` 组件，只需要：

1. 创建一个组件实例
2. 调用该实例的 `render` 方法。

---------------

再来看一个稍微复杂一点的示例：

```
var Switch = require('./kami/scripts/switch');  // 引用组件

var switch = new Switch({  // 创建实例
    container: '.js_switch_container',
    onchangevalue: function(value, prevValue) {  // 监听组件的changevalue事件
        // doSomething
    }
});
switch.render();  // 调用render方法
switch.on('changevalue', function(value, prevValue) {  // 监听组件的changevalue事件
    // doSomething
});
switch.setState(false);  // 调用组件实例的方法

```

作为一个组件，`Kami` 提供了组件事件监听和调用实例方法的方式。

事件监听的方式有两种：

1. 创建实例时，添加 `onXXX: function(){}` 参数来绑定
2. 创建实例后，通过 `.on('XXX', function(){})` 的方式绑定

#### 3. 通过QApp使用Kami

`Kami` 不仅可以单独使用，也提供了适配其他框架的使用方式。

`QApp` 作为 `Hy框架` 的核心，提供了一套完善的视图和组件生命周期机制。`Kami` 可以通过 `QApp-plugin-kami-adapter` 插件来适配到 `QApp` 中。在 `QApp` 中，可以通过两种方式来使用 `Kami`。

```
<div class="js_switch_container" qapp-widget="switch"
    data-switch-id="switch_demo"
    data-switch-state="false"
    data-switch-onchangevalue="switchValueChange"
></div>
```

方法一：如上面的html代码所示，组件可以通过 `qapp-widget` 的方式直接在html中使用。组件的配置项则通过 `data-widgetName-paramName` 的方式来添加。这种使用方式的好处在于，能够更加直观的使用组件。

```
var switch = QApp.showWidget('switch', {
    container: '.js_switch_container',
    onchangevalue: function(value, prevValue) {
        // doSomething
    }
});
switch.on('changevalue', function(value, prevValue) {
    // doSomething
});
```

方法二：如上面的js代码所示，组件可以通过 `QApp.showWidget` 的方式使用。

但是有一些需要注意的地方：

1. 这种方式不需要通过 `.render()` 的方式来渲染：如果调用了，会出现组件被渲染两次，所有的事件都被绑定了两次的现象
2. 使用这种方式，必须是在对应的视图 `ready` 之后

## 更多信息

更多信息，请参考 [组件文档](./widget.html) 和 [示例](http://ued.qunar.com/kami/demo/)。