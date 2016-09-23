QApp ( QApp Mobile Framework )，
**简洁** 、 **轻量** 、 **实用** 的 **移动前端开发框架**，
统一管理视图的 **创建** 、 **切换** 、 **通信** 、 **嵌套** 、 **销毁** 等操作，
并辅以 **模板引擎** 、 **动画效果** 、 **事件代理** 、 **数据存储** 等一系列实用性 **插件** 和 **组件**，
最终形成一套一体化的 **移动前端 SPA 解决方案**。

查看示例，请访问 [http://ued.qunar.com/hy/qapp/demo/](http://ued.qunar.com/hy/qapp/demo/)

### 默认配置

```js
QApp.config({
    // 默认的首屏 View
    indexView: 'index',
    // 默认的动画
    defaultAnimate: 'moveEnter',
    // 是否自动初始化视图
    autoInit: true,
    // 是否开启 hash router
    hashRouter: true,
    hashSupport: {
        // 是否默认全部
        all: true,
        // 白名单
        exist: [],
        // 黑名单
        except: [],
        // 是否使用 path 变换（需要服务端支持）
        usePath: false
    },
    // 是否使用 json 形式参数
    jsonParam: false,
    screen: {
        // 是否支持屏幕旋转
        rotate: false,
        // 检测屏幕大小变换
        autoResize: true
    },
    gesture: {
        // 是否开启手势
        open: true,
        // 是否开启手势控制 (在 View 切换时，禁用手势)
        ctrl: true,
        // 长按是否触发 Tap 事件
        longTap: true,
        // 自动控制元素失去焦点
        autoBlur: true
    }
});
```

### 默认样式

```css
qapp-app {
    position: absolute;
    overflow: hidden;
}

qapp-view {
    display: block;
    float: left;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
}

// 用于 moveEnter 的手势操作
qapp-view .touch-opacity {
    top: 0.44rem; // 根据实际情况设置 0.44rem 为 header 高度，避免返回按钮点击不上。
    bottom: 0;
}
```

### 版本信息

最新版本 `1.0.0`


### 项目地址

> `Git` : [http://gitlab.corp.qunar.com/qapp/QApp](http://gitlab.corp.qunar.com/qapp/QApp)

### 插件说明

插件的设计是基于视图的，其 **主要的** 宿主对象就是视图。

插件是可插拔的，通过配置，在创建视图时，将插件加载进去。

插件的实现形式是重写宿主视图的方法或者根据宿主的事件进行相关针对宿主视图的操作。

除了基于视图的，也提供基于 `App` 以及工具类的插件。

现在提供的插件列表如下: [Plugin List](plugins.html)。

开发者可以通过 [QApp.addPlugin](api.html#QApp-plugin-add) 方法自行添加插件。

### 组件说明

组件部分的设计比较 **灵活** 、**开放**， 几乎任何形式的组件都可以通过适配的方式添加到 `QApp` 中。

把组件归为两类：

- 一类是渲染式（render），当节点渲染时启用组件，例如 `Switch`。
- 一类是事件触发式（event），当触发某一事件时启动组件，例如 `dialog`。

使用方法有两种：

- 标签法，在元素上添加 `qapp-widget` 属性。
- 通过 `showWidget` 接口调用

使用 `qapp-widget` 时，可以通过 `data-{widget-name}-{option-key}` 来配置组件。
其中 `data-{widget-name}-id` 会指定组件的 `id`，开发者可以从 `View.widgets` 里通过 `id` 获取组件实例。

开发者可以通过 [QApp.addWidget](api.html#QApp-widget-add) 方法自行添加组件。

### 备注

关于视图切换动画的一些说明，可以参考 [QApp-plugin-basic](plugins.html#QApp-plugin-basic) 插件
