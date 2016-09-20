
## Kami Adapter Plugin For QApp

为在QApp使用Kami，提供给了统一个适配器，取代之前的每个组件对应一个适配器的问题。使用方式如下:

### 如何使用适配器，注册组件

1. 引用Kami组件，并且赋值给一个变量
2. 使用`QApp.util.KamiAdapterFactory`提供的`register`方法来注册组件到QApp中。

```

    //Kami是Kami组件所在的地址，在fekit.config中配置的别名
    //1.引用Kami组件，并且赋值给一个变量
    //2.使用QApp.util.KamiAdapterFactory提供的register方法来注册组件到QApp中。
    //


    //引用组件
    var KamiBizvericodedialog = require('Kami/scripts/bizvericodedialog/index.js');
    var KamiConfirm = require('Kami/scripts/confirm/index.js');
    var KamiAlert = require('Kami/scripts/alert/index.js');
    var KamiLoading = require('Kami/scripts/loading/index.js');

    var KamiSelectlist = require('Kami/adapter/qapp/src/selectlist.js');
    var KamiSwitchable = require('Kami/adapter/qapp/src/switchable.js');
    var KamiTips = require('Kami/adapter/qapp/src/tips.js');


    //注册组件
    QApp.util.KamiAdapterFactory.register('bizvericodedialog', KamiBizvericodedialog);
    QApp.util.KamiAdapterFactory.register('confirm', KamiConfirm);
    QApp.util.KamiAdapterFactory.register('alert', KamiAlert);
    QApp.util.KamiAdapterFactory.register('loading', KamiLoading);


```

### 使用组件

目前在QApp中有两种使用Kami组件的形式。

1. 通过在view里调用方法来使用组件，在view的show事件里面通过 `QApp.showWidget('name', option)`的方式来初始化组件，方法返回的是组件的实例
2. 通过解析节点属性来使用组件

#### 通过在view里调用方法来使用组件

对于单例组件：`loading`、 `tips`、`confirm`、`alert` 可以使用`QApp.showWidget(name)`或者`QApp.Kami`来直接调用。

```

    //使用loading,通过QApp.showWiget来使用loading
    var loading = QApp.showWidget('loading');
    var options = {};
    loading.show(options);

    //使用全局变量调用
    var options = {};
    QApp.Kami.loading.show(options);
```

其他组件，如`pagelist`调用方式

```
    var options = {};
    var pagelist = QApp.showWidget('pagelist', options)
    pagelist.on('selectitem', function() {});

```

#### 通过解析节点属性来使用组件

```
    <!-- html 节点 -->
    <div class="" qapp-widget="switch" data-switch-id="isInvoice" data-switch-value="0"></div>
```

```
    view.on('show', function() {
        //注册组件的changevalue事件
        view.widgets.isInvoice.on('change:value', function() {});
    })
```



### 为组件设置默认参数

在开发中，会存在为同一个类型的组件设置统一默认参数的需求，适配器提供了`setDefaultOptions`这个方法。

```
    //设置默认options
    var DEFAULT_OPTIONS = {

        useRefresh: false,
        // 是否启用加载更多功能
        useLoadmore: false
    };
    //设置后对所有pagelist的组件都会生效
    QApp.util.KamiAdapterFactory.setDefaultOptions('pagelist', DEFAULT_OPTIONS);
```