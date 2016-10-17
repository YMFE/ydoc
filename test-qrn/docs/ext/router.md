# Router - Ext Plugin

## 介绍

**Router** 作为 **Ext** 的内置插件，为其提供更加强大好用的路由功能。

**Router** 具有如下特点：

1. 封装原生的 `Navigator` 组件，提供更加友好的接口。

2. 和 `view` 耦合，无需手动配置路由映射关系。

3. 强大、自由的导航栏配置。

4. 传参、动画等拓展功能。

5. 简洁直观的生命周期。

6. 可以在含有 native 页面的混合应用中灵活地跳转。

## 开始

引用与配置：

```js

// 配置业务 hybridId，在多业务跳转时会用到
Ext.defaults.hybridId = 'hotel';
// 配置应用名（可以不配置，默认为 'Naive'）
Ext.defaults.appName = 'extDemo';
// 配置首页（可以不配置，默认为 require 的第一个页面）
Ext.defaults.indexView = 'base';

// 引入页面
import './views/base'
import './views/pageA'
import './views/pageB'
```

注意：

- Router 会自动根据配置去调 `AppRegistry.registerComponent()` 方法。

使用 **Router**：

```js
class base extends QView {
    styles = styles;
    render = render;

    // Actions
    // Router 方法调用
    open() {
        Ext.open('pageA', {
            // 传递参数
            param: {
                api: 'open',
                from: 'base',
                to: 'pageA'
            },
            // 配置动画
            sceneConfigs: 'VerticalUpSwipeJump'
        });
    };
    goto() {
        Ext.goto('pageB', {
            param: {
                api: 'goto',
                from: 'base',
                to: 'pageB'
            }
        });
    };
    back() {
        Ext.back({
            param: {
                api: 'back',
                from: 'pageA',
                to: 'base'
            }
        });
    };
    home() {
        Ext.home({
            param: {
                api: 'home',
                from: 'base',
                to: 'base'
            }
        });
    };
    close() {
        Ext.close();
    };

    // Events
    // Router 生命周期回调注册
    bindEvents = {
        ready() {
            console.log('[base][ready]', this.props);
        },
        actived(param) {
            console.log('[base][actived]', param);
        },
        deactived() {
            console.log('[base][deactived]');
        },
        destroy() {
            console.log('[base][destroy]');
        }
    };
});
```

## 文档

### API

#### `open(name[, opts])`

打开一个新的页面（新建历史）。

- `name` String 目标页面的名字

- `opts` Object 配置项

    - `opts.param` Object 需要传递的参数

    - `opts.sceneConfigs` Object|String 场景配置项或预设动画名（参考：[Navigator – React Native | A framework for building native apps using React](https://facebook.github.io/react-native/docs/navigator.html)）   



#### `back([opts])`

回到上一个页面。

- `opts` Object 配置项

    - `opts.param` Object 需要传递的参数

#### `backTo(name[, opts])`

回到指定页面。

- `name` String 目标页面的名字

- `opts` Object 配置项

    - `opts.param` Object 需要传递的参数

#### `goto(name[, opts])`

前往指定页面（历史中有则回退，没有则新建历史）。

- `name` String 目标页面的名字

- `opts` Object 配置项

    - `opts.param` Object 需要传递的参数

    - `opts.sceneConfigs` Object|String 场景配置项或预设动画名（如果是返回动作，此配置项无效）

#### `home([opts])`

回到首页。

- `opts` Object 配置项

    - `opts.param` Object 需要传递的参数

#### `close(name)`

关闭指定页面。默认关闭当前页，返回上一页。

- `name` String 目标页面的名字

### 生命周期

![](http://ww3.sinaimg.cn/large/4c8b519dgw1f281rs22ryj213m0s4794.jpg)

#### 可注册的回调函数

以下所有注册回调函数内部 `this` 均为当前页面。

##### `ready()`

页面准备完成时。通过 `this.porps.param` 可以获取 `open(name, opts)` 时传入的参数。

> 举例：从 A 页面打开 B 页面，此时 B 页面就准备完成了。

##### `actived(param)`

页面激活时。`param` 为来源页携带的参数。

> 举例：B 页面是从 A 页面打开的，现在从 B 页面返回 A 页面，此时 A 页面就被激活了。

##### `deactived()`

页面失活时。

> 举例：从 A 页面打开 B 页面，此时 A 页面就失活了。

##### `destroy()`

页面销毁时。

> 举例：B 页面是从 A 页面打开的，现在从 B 页面返回 A 页面，此时 B 页面就被销毁了。

#### 和原生周期的关系

Router 生命周期 | 原生生命周期
:-: | :-:
`ready` | `componentDidMount`
`actived` | 无
`deactived` | 无
`destroy` | `componentWillUnmount`


### API 和生命周期的关系

API | 触发的生命周期回调
:-: | :-:
`open` | 当前页面的 `deactive` 和下一页面的 `ready`、`actived`
`goto` | 若新建历史：当前页面的 `deactive` 和下一页面的 `ready`、`actived`；若回到历史：当前页面的 `deactive`、`destroy` 和下一页面的 `actived`
`back` | 当前页面的 `deactive`、`destroy` 和下一页面的 `actived`
`backTo` | 当前页面的 `deactive`、`destroy` 和下一页面的 `actived`
`home` | 当前页面的 `deactive`、`destroy` 和下一页面的 `actived`
`close` | 若关闭当前页面：当前页面的 `deactive`、`destroy` 和下一页面的 `actived`

### 导航栏

Router 默认提供了接近 iOS 原生样式的导航栏（类似 NavigatorIOS）。可以通过配置 `Ext.defaults.navBar.isShow = true` 来使用。

#### 全局配置

```js
// 配置全局导航栏
Ext.defaults.navBar = {
    // 是否显示，默认为 false，不显示
    isShow: true,
    // 背景色，默认 Qunar 蓝
    backgroundColor: 'red',
    // 导航栏文字颜色，默认白色
    color: 'black',
    // 导航栏高度,默认44(不包括状态栏高度)
    height: 80,
    //左右按钮宽度,默认60
    buttonWidth:60,
    //状态栏背景色,默认透明
    statusBarBackgroundColor:'transparent',
    // 导航栏按钮点击不透明度，默认 0.6
    activeOpacity: 0.8,
    // 左侧按钮文字,默认'返回'
    leftButtonText: '<back'
};
```

#### 页面级配置

页面的routerPlugin可以覆盖全局配置的任意一项,并且新增了标题,导航栏左右按键的相关配置。

```js
class base extends QView {
    // 配置页面导航栏
    static routerPlugin = {
        // 是否显示导航栏
        isShow: true,
        // 背景色，默认 Qunar 蓝
        backgroundColor: 'red',
        // 文本颜色，默认白色
        color: 'black',
        // 按钮宽度
        buttonWidth:60,
        // 状态栏背景色
        statusBarBackgroundColor:'red',
        // 导航栏高度
        height:80,
        //activeOpacity
        activeOpacity:0.6
        // 标题，默认route.name
        // 支持传入多种参数:
        // 字符串;
        // 返回JSX的函数,接受route和store作为参数:
        // (route,store)=>(<TouchableOpacity onPress={()=>alert('custom jsx')}>
        //    <Text>{route.name}</Text>
        // </TouchableOpacity>)
        // JSX
        title: 'Base',
        // 左侧按钮，默认为字符串'返回'
        // 同样支持传入字符串/函数/JSX
        leftButtonText: <Text>返回</Text>,
        // 左侧按钮点击事件，默认 `Ext.back()`
        // 接受两个参数route和store
        leftButtonPressEvent(route,store) {
            alert('left...')
        },
        // 右侧按钮文字，默认空字符串
        // 同样支持传入字符串/函数/JSX
        rightButtonText(route,store){
          return (
            <Text>{route.name}</Text>
          );
        },
        // 右侧按钮点击事件，默认空函数
        rightButtonPressEvent(route,store) {
            alert('right...');
        },
    };
}
```

#### API

##### `setTitle(title)`

设置当前页面导航栏的标题。

- `title` String/Function/JSX 使用方式与配置里面的title完全一致

举例：

```
//传入字符串
Ext.Router.setTitle('new Title');
//传入JSX
Ext.Router.setTitle(
  <Text>new Title</Text>
);
//传入返回JSX的函数
Ext.Router.setTitle((route,store)=>(
  <Text>{route.name}</Text>
));
```

##### `open(viewName, {title})`

打开新页面并设置新页面的标题。

- `title` String 标题

举例：

```
Ext.open('pageA', {
    title: 'new Title',
});
```

### 桥

Router 封装了 QRN 提供的 Native 桥，Router 自身处理了大部分桥，用户用到只会有以下几种：

#### 广播

##### 发送广播

```js
Ext.Router.Bridge.sendBroadcast({
    // 广播名
    name: 'getSomeMsg',
    // 广播内容
    data: {
        msg: 'i tell u a msg'
    },
    // 指定发送目标，不指定则发给全局
    hybridId: 'hotel',
});
```

##### 接收广播

```js
DeviceEventEmitter.addListener('getSomeMsg', (data) => {
    // 以上面发送广播的 data 为例，接收到的 data 会长这样：
    data = {
        msg: 'i tell u a msg'
    };
});
```

#### 发送 scheme

```js
Ext.Router.Bridge.sendScheme({
    // 地址
    url: '',
    // 安卓透明层标识（只有安卓才有）
    adrToken: '',
    // 数据
    data: {},
}, (res) => {
    // 发送后的回调
    res = {
        // 是否成功
        ret: true,
        // 数据
        data: {},
    };
});
```

### 挂载在 `Ext` 上的对象

**Router** 会通过 `Ext.Router` 暴露出来。除了所有的 API 外，还暴露了内部的历史容器 `Ext.Router._vcs` 和页面容器 `Ext.Router._views`。

## 实战

### Native 页面跳转

Router 极大便利了 RN 页面和 Native 页面（包括 HY 页面）的互跳操作。

在阅读下面内容前强烈建议先了解下与 RN 相关环境下的 Scheme：[传送门](http://gitlab.corp.qunar.com/yayu.wang/wiki/blob/master/react-native-api-in-js-context.md#scheme)。

#### Native -> RN

Native 打开 RN 页面一般有两种方式：

##### 1. 原生方法

通过 native 代码打开，例如 iOS 通过 `QRCTVCCreater` 方法，详情参考 [iOS](http://ued.qunar.com/qrn/doc/index-Native%E9%9B%86%E6%88%90%EF%BC%88iOS%EF%BC%89.html)、[Android](http://ued.qunar.com/qrn/doc/index-Native%E9%9B%86%E6%88%90%20%EF%BC%88Android%EF%BC%89.html)。

如果首页需要获取从 Native 传入的参数，需要通过 `initialProperties.param` 携带。

##### 2. 发送 Scheme

通过发送 Scheme 也能跳转到 RN 页面，以 iOS 为例：

```
@interface JumpHandle : NSObject
/**
 *  通过URL和urlData来调用界面
 *
 *  @param url          跳转到的URL，通常为 qunariphone://hotel/xxx 的形式
 *  @param urldata      处理URL所需使用的数据
 *  @param responseDelg 回调对象
 *  @param userInfo     自定义对象
 *
 *  @return 返回是否有模块接受该URL并进行处理，处理URL可能是异步的，不能保证线程安全
 */
+ (BOOL)jumpHandleOpenURL:(NSURL *)url
              withUrlData:(NSDictionary *)urldata
             responseDelg:(id<JumpHandleResponsePrt>)responseDelg
                 userInfo:(id)userInfo;
@end
```

#### RN -> Native

一般通过发 Scheme 方式，举例：

```js
Ext.Router.Bridge.sendScheme({
    url: 'qunariphone://react/debug',
});
```

以上可以打开一个 native 页面。

#### HY -> RN

通过 `a` 标签进行跳转，举例：

```html
<p>
	<a href="qunariphone://react/open?hybridId=qunar_react_native_ext&qInitView=pageA">open：强制新开</a>
</p>
<p>
	<a href="qunariphone://react/biz?hybridId=qunar_react_native_ext&qInitView=pageA&forceOpen=true&initProps=%7B%22param%22%3A%7B%22name%22%3A%22wyy%22%7D%7D">biz：强制新开</a>
</p>
<p>
	<a href="qunariphone://react/biz?hybridId=qunar_react_native_ext&qInitView=base&initProps=%7B%22param%22%3A%7B%22name%22%3A%22wyy%22%7D%7D">biz：返回 base</a>
</p>
<p>
	<a href="qunariphone://react/biz?hybridId=qunar_react_native_ext&qInitView=pageA&initProps=%7B%22param%22%3A%7B%22name%22%3A%22wyy%22%7D%7D">biz：返回 pageA</a>
</p>
```

具体可以参考 [QRN 配套测试 HY Demo](http://gitlab.corp.qunar.com/yayu.wang/qreact-test-hy/tree/master)

#### RN -> HY

通过调用 `Ext.Router.Bridge.sendScheme` 方法，举例：

```js
let url = 'qunariphone://web/url?url=http%3A%2F%2Fwyy.qunar.com%2Fqreact-test-hy%2Findex.html&loadview=auto';
Ext.Router.Bridge.sendScheme({
    url,
});
```

### 阻止安卓物理返回

组件支持 `onBackPressed` 方法，方法返回 `true` 表示关闭安卓物理返回的响应，`false` 表示恢复安卓物理返回的响应。

```js
class SceneAndroidBack extends QView {

    constructor(props) {
        super(props);
        this.preventBackByAndroidKey = false;
    }

    onBackPressed() {
        return this.preventBackByAndroidKey;
    }

    setPreventBack(value) {
        this.preventBackByAndroidKey = value;
    }

    render() {
        return (
            <View>
                <Text
                    onPress={this.setPreventBack.bind(this, true)}>
                    阻止安卓物理返回
                </Text>
                <Text
                    onPress={this.setPreventBack.bind(this, false)}>
                    恢复安卓物理返回
                </Text>
            </View>
        );
    }

}
```
