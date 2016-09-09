#### 简介

**QApp** 对 **Hy** 的适配器，只要简单配置，即可让 **Touch** 页正常运行在 **Hy** 环境的大客户端里，并适配到多种环境（包括 **微信**）。


#### 使用场景

QApp-Hy 和 QunarAPI 都是对 Hy 的 WebViewJavascriptBridge 的封装，前者专注于 QApp View 和 Hytive View 的适配，后者专注于桥的封装和多环境的适配，并且包括对微信的JSSDK的封装等。

故：
* QApp-Hy 主要使用在基于 QApp 构建的项目中，用于配置 **视图** 的展现方式、监听 **视图相关** 的事件、处理 **视图相关** 的逻辑。
* QunarAPI，开发者主要使用它调用 Native 功能，例如 地理位置、分享 等。同时，在非 QApp 的项目中，监听页面生命周期的相关事件、打开新WebView等操作。更详细的使用说明请参看 QunarAPI 文档：[QunarAPI](http://hy.qunar.com/docs/qunarapi-api.html)

在基于 QApp 构建的项目中，QApp-Hy 提供的功能，单独使用 QunarAPI 也可以实现，但是需要业务写一些特殊的逻辑。但是这些逻辑在 QApp-Hy  中都进行了封装，如果开发者使用QApp-Hy可以直接通过简单配置完成以下这些逻辑：

1. 视图切换和配置
2. 视图周期事件
3. 原生导航（Native Header）配置和事件
4. 登录跳转

#### 封装的逻辑和API

QApp-Hy 对视图切换(openWebView、closeWebView等)、视图周期事件(onShow、onHide等)、导航配置(navRefresh)及导航事件(onNavClick)等进行了封装。

##### 1. 视图切换和配置

SPA 的项目，在 Touch 上展现是，在一个窗口通过 JS/CSS3 的动画切换视图。而适配到 Hy 环境的客户端中，考虑到效率和体验，项目每个视图将会在 **新开的WebView** 中渲染。

QApp-Hy 调用 openWebView 新开一个 Webview，然后通过 url 上的 hash 定位到指定的视图，并设定了 WebView 的一些属性。

此逻辑封装了 QunarAPI 中的 `openWebView`，`closeWebView`，`setWebViewAttr` 等逻辑。

##### 2. 视图周期事件

每个视图都有自己的生命周期，QApp 的视图有自身的 [生命周期事件](http://ued.qunar.com/mobile/qapp/doc/api.html#Event-View)。

QApp-Hy 适配了 Hy 的客户端 WebView 的生命周期，并和 QApp 视图的生命周期统一。

此逻辑封装了 QunarAPI 中的 `onShow`，`onHide`，`onReceiveData` 等逻辑，其中 `onShow` 适配 QApp 视图的 `actived`，`onHide` 适配 QApp 视图的 `deactived`。

##### 3. 原生导航（Native Header）配置和事件

用户使用 Hy 的原生导航条时，会遇到导航配置的问题。包括标题、左右按钮的内容和形式。

在开发过程中，业务方的视图是包含 H5 的 Header 的，在 touch 上是显示 H5 Header 的。 QApp-Hy 在适配的过程中，自动用 `margin-top` 将 H5 Header 偏移出去，并被 Native Header 覆盖（一般是 `-0.44rem`）。

用户可以通过 `viewOptions` 内的每个视图的 `nav` 选项配置标题、左右按钮的内容和形式。

同时，Native Header （包括 安卓的物理返回键）的事件监听，QApp-Hy 也做了处理，可以在 QApp-Hy 全局 和 每个 `ViewOptions` 内的每个视图的 `bindEvents` 里以 `nav:类型` 的方式监听。

同时，为了让业务可以无缝适配，QApp-Hy 在监听到 Native Header 事件时，模拟触发 H5 Header 的 `tap` 事件。按钮元素的选择，遵循 [Yo](http://ued.qunar.com/mobile/yo/) 的设计，选择器如下：（如果不同，可以另行配置）

```
{
    left: 'header .regret', // 导航栏左侧按钮
    title: 'header .title', // 标题
    right: 'header .affirm' // 导航栏右侧按钮
}
```

此逻辑封装了 QunarAPI 中的 `navRefresh`、`onNavClick` 逻辑和 `openWebView` 中的 `navigation` 配置。

*Native Header，在 WebView 内的代码出现问题时，用户仍然可以通过原生的后退键返回，不会造成 App 死掉。而不使用 Native Header，用户则可以控制全屏的 WebView 来实现更好的体验。*

##### 4. 登录

QunarAPI 提供了 去哪儿大客户端 和 Touch 端的登录功能。但是没有视图的依赖，有些情况下支持得不是特别好。

因此，QApp-Hy 根据 QApp 项目的情况，又封装了一步。支持 去哪儿大客户端、独立客户端（新开 WebView 使用 Touch 登录）、Touch登录（登录完成后，自动 history 回退，不影响之前的路由）等。

此逻辑封装了 QunarAPI 中的 `login` 逻辑。

#### 使用方式

> QApp.hy.config(opts)

配置后，正常使用 `QApp` 即可，会自动适配Hy环境

#### 示例

    // 一般的配置，一般情况下，用户只需要配置这两项即可，有特殊需求的，才需要多配置
    QApp.hy.config({
         indexView: 'index',
         viewOptions: {
            // 相见下方详细配置实例
         }
    });

    // 基础配置信息
    QApp.hy.config({
        // 指定首视图。值为视图的名字
        indexView: 'index',
        // hybrid Id，会自动读取 url 上的 hybridid 参数
        hybridId: 'hy',
        // 自定义的客户端 UA 标识，默认有攻略客户端
        schemaProtocols: ['qunartraveliphone', 'qunartravelaphone'],
        // iOS全屏WebView时，头部预留的状态栏的高度（版本需 >= 0.2.4）
        barHeight: 20,
        // Header的高度，单位 px，会根据 window.dpr 缩放。同时支持 function 类型参数，业务自行计算。
        hdHeight: 44,
        // WebView 类型 navibar-normal 为有原生导航栏（默认），navibar-none 为 WebView 全屏模式。更多类型，已 Hytive 文档为准。
        webViewType: 'navibar-normal',
        // Hytive Loading 方式控制，默认为 auto，效果是自动关闭；可设置为 hold，此时 Loading 不会关闭，前端可以通过 view.hideLoading() 关闭 loading
        loadViewType: 'auto',
        // 是否使用 JSON 形式转换参数（参数以 json 字符串形式添加在 Hash 上）
        jsonParam: false,
        // 是否在刷新 Native Header 同时刷新 H5 Header
        refreshH5Header: false,
        // 构建 H5 Header 的方法
        buildNavHTML: null
        // 在第三方 App (例如，微信)中是否使用 App 的 Header
        // true，表示使用使用 App 的 Header 并隐藏 H5 的 Header。这种情况下，建议在 Header 上只有 后退 和 展示Title 的逻辑
        // false，表示同时存在 App 的 Header 和 H5 的 Header
        useAppHeader: true,
        // 是否使用跳转
        // true，表示在第三方App和浏览器，例如微信和Safari里使用跳转形式，降级为多页（缺点是下一页需要重新加载）
        // false，表示不实用跳转形式，使用单页形式。（缺点是微信手势回退会把所有 view 都关闭等别的手势问题）
        useTransfer: true,
        // 页面配置信息。
        viewOptions: {
            // 配置 'index' 页
            index: {
                // 窗口类型
                type: 'navibar-normal', // 默认为 webViewType 配置，可为单独的视图配置
                // 是否支持IOS的后退手势
                disableBackGestrue: true, // 默认为 false
                // 导航栏配置信息
                nav: {
                    // 中央标题配置信息
                    title: {
                        style: 'location',  // 显示位置图标
                        text: '这是标题'       // 文字内容
                    },
                    // 左侧区域配置信息。
                    left: {
                        style: 'icon',  // 显示图标
                        icon: 'f001', // 图标
                    },
                    // 右侧区域配置信息。
                    right: {
                        style: 'text', // 显示文字
                        text: '分享'  // 文字内容,
                        action: 'share' // 特殊操作，以 hytive 支持列表为准，share 为调起 native 分享
                    }
                },
                // 绑定事件 （只在 hytive 环境触发）
                bindEvents: {
                    // 页面显示时触发的回调
                    show: function() {

                    },
                    // 页面激活时触发的回调
                    actived: function() {

                    },
                    // 页面失活时触发的回调
                    deactived: function() {

                    },
                    // 监听右键点击，支持 left, title, right 等
                    'nav:left': function() {
                        return false; // 阻止 Native 默认逻辑，例如回退逻辑
                        // 在模拟点击的元素上，加 preventNative 标记属性，也可以是此效果
                    }
                },
                // 特殊逻辑的配置 （只在 Hytive 环境触发）
                render: function(options, showCallback, hideCallback) {
                }
            },
            // 将 view.a 映射成 url，使用 QApp.open('view.a') 相当于打开此 url
            'view.a': {
                loadViewType: 'hold',
                url: 'http://waimai.qunar.com/index.jsp'
            },
            // 将 view.b 映射成 schema，使用 QApp.open('view.b') 相当于调用此 schema
            'view.b': {
                schema: '//hotel/main'
            }
        }
        // 全局的绑定
        bindEvents: {},
        // ready 回调
        ready: function() {},
        // 按钮选择器，当用户点击原生组件的按钮时，QApp-Hy 会模拟触发 H5 对相应按钮的 tap 事件
        buttons: {
            left: 'header .regret', // 导航栏左侧按钮
            title: 'header .title', // 标题
            right: 'header .affirm' // 导航栏右侧按钮
        }
    });

    // 环境嗅探 由于 Hy 环境时异步判定，所以请在 QApp.ready 后使用。
    QApp.hy.sniff = {
        app: true,  // 是否在 App 中
        qunarApp: false, // 是否是 QunarApp（原 WebView）
        hyApp: true, // 是否是 HyApp
        independent: false, // 是否是 独立客户端
        touch: false, // 是否是 Touch
        pc: false // 是否是在 PC 上模拟
    };

    // 设备信息 从 QN241 Cookie 中获取
    QApp.hy.deviceInfo = {
        cid: "C1001",
        lt: 0,
        uid: "FDDB3B58-41DE-4093-A4A0-DA62C21897EC",
        gid: "D23DF3A0-F33F-FF54-F2A8-3561836485C3",
        pid: "10010",
        vid: "80011091"  // 客户端版本号，ios 为 8 开头，adr 为 6 开头
    };

    // 获取的登录信息
    // 包括
    // nickName 昵称
    // userName 用户名
    // 不包括登录状态
    var loginInfo = QApp.hy.getLoginInfo();

    // 登录
    // 兼容 touch 、 Hy 和 独立客户端
    // 需要升级 QApp 到 0.4.2
    // 在客户端内，有 回调
    // doCheck 选择是否先通过公共接口查询登录状态
    QApp.hy.login(function(ret) {
        // ret 为登录信息
    }, doCheck);

    // 通过公共接口获取登录状态
    QApp.hy.checkLogin(function(ret) {
         // 登录状态
    });
