# React-Native-Ext

React Native 的增强框架。同时适配公司 [Qunar-React-Native](http://gitlab.corp.qunar.com/react_native/qunar_react_native) 框架，共同组成公司 QRN 方案。

## 介绍

![](http://ww2.sinaimg.cn/large/4c8b519dgw1f3p74ps0dwj20z20gkn1m.jpg)

* Ext-Base: 核心、插件机制、Utils
* Router: 路由部分，包括同 Context 内的路由，以及和 Native View 之间的跳转
* Webx: 前端扩展部分，包括对 Style 的扩展和对事件的一些改动
* redux：数据部分，与 Router 结合的单向数据流操作

## 开始

```js
// 引入 ext
import '@qnpm/react-native-ext'

// 定义一个页面
class pageA extends QView {
    // ...
};
// 定义一个组件
class MyComp extends QComponent {
    // ...
};
```

## Demo

### 1. 启动打包服务

在本仓库根目录下执行

```
npm run start -- --root ./example/<demoName>
```

或

```
npm run <demoName>
```

该仓库目前有四个 demo：router、webx、redux 和 waimai。

### 2. 开启应用

打开 app，具体请参考：[QRN 开发工具](http://ued.qunar.com/qrn/doc/index-%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.html)。

#### iOS

克隆[大客户端壳](http://gitlab.corp.qunar.com/react_native/app_template_ios_mclient)至本地，分支 `ext`，在 xcode 中运行 `app_template_ios_mclient/ios/QRN-Template.xcworkspace`。

#### Android

在模拟器或真机上安装[大客户端壳](https://owncloud.corp.qunar.com/public.php?service=files&t=2099f7b89d6c16fa4022ddd4c8df7484)。

## 核心API

### 业务开发者 API

> class React.QView | class React.QComponent

QReact View/Component

开发者可以通过 `class Demo extends QXXX {}` 的方式创建 QReact View 或 Component，并使用 QReact 的插件特性

例：

```js
import {
    QView
} from "react-native";

class Demo extends QView {
    static plugins = ['redux'];
    render() {
        return <Text>Weact</Text>
    }
}
```

> React.Ext.defaults

全局配置，用户可以配置一些全局的设置。

默认配置：

```js
React.Ext.defaults = {
    appName: '',
    globalPlugins: ['webx', 'router']
};
```

#### 插件文档

* [Router](http://gitlab.corp.qunar.com/react_native/qunar_react_native_ext/tree/dev/plugins/router)
* [Redux](http://gitlab.corp.qunar.com/react_native/qunar_react_native_ext/tree/dev/plugins/redux)
* [WebX](http://gitlab.corp.qunar.com/react_native/qunar_react_native_ext/tree/dev/plugins/webx)
* [Fetch](http://gitlab.corp.qunar.com/react_native/qunar_react_native_fetch/tree/dev)


### 插件开发者 API

> React.Ext.addPlugin(name, adapter, ininFn, registerFn);

添加插件
* `name`：`{String}` 插件名
* `adapter`: `{Function}` 适配器
* `ininFn`: `{Function}` QReact-Ext 初始化回调函数
* `registerFn`: `{Function}` QView/QComponent 注册时回调函数

示例

```js
React.Ext.addPlugin('xxx', (Comp, opts, React, isView) => {
    // Comp : React Comp 组件实例
    // opts : 插件配置
    // React : React 对象
    // isView : 是否是 View （有可能是 Component）
}, (React) => {
    // React : React 对象
}, (ExtComp, isView) {
    // ExtComp : QReact Comp 组件 Class (QView/QComponent)
    // isView : 是否是 View （有可能是 Component）
});
```

## for Babel

`babel-preset-qrn`

作用：开发者定义 class XXX extends QView/QComponent 后，会自动将 Class，注册到 QReact-Ext 中。

请手动更改 `node_modules/react-native/packager/react-packager/rn-babelrc.json` 为以下内容。

```json
{
    "presets": ["qrn", "react-native"]
}
```

## Gulp

> gulp all -p webx

启动 example/webx 下的 demo

> gulp clean

清理 打包缓存

> gulp run -p webx

不重启 打包 和 模拟器，切换 demo
