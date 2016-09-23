QApp 0.2 升级 0.4 说明：

* 在 dom 结构上，去除了 qapp-container 这一层
* 减少一些容易造成混淆的API
* 重新设计的router

### 注意事项：

删除的API：renderHash、addHashSupport
通过hash渲染视图，会在框架中自动进行，不用业务调用。

addHashSupport 是增加hash支持，现在hashRouter默认开启，并且默认所有视图都会有路由
特殊配置可以通过 QApp.config 的 hashSupport 配置

    QApp.config({
        "hashSupport": {
            "all": true,
            "exist": [],  // 白名单 
            "except": []  // 黑名单
        }
    });

用户只需要这样简单的配置，即可支持路由功能，支持浏览器的刷新、前进、后退，并和前端逻辑的一样。

【重要】 在使用 open 时，不建议使用 onComplete 回调，改为使用 receiveData 事件来监听。 `view.on(‘receiveData’, function(data) {});`
data的主要参数为，data.view: 来源的视图名， data.data: 传回的数据。

* 现在也支持 onComplete 的形式，但是兼容性不好，主要因为再任意一个视图，用户有可能都会刷新，如果需要回调数据的视图都不支持hash的话，用onComplete是没有问题的
* 为什么支持Hash时就不行？支持Hash就相当于用户可以进到B。A视图 打开 B视图，B可以回传数据，用onComplete接收。但是如果用户此时在 B 视图刷新，此时，A视图没有渲染，肯定没有open - onComplete，这时B回传的数据，A接收不到。而receiveData能接到所有页面跳回的数据，而且和native的逻辑一致。
* 同样的，在视图回调时，不建议使用 view.complete（data） 了，直接用 view.hide(data) 即可。

Open和Show的区别是，前者基于路由，后者不基于。open多用于视图的切换，表现效果是，新视图从页面右侧划入，在客户端上的表现为新开WebView。show多用于组件的渲染，表现形式为叠层下来等。

另外，视图取消了router事件，然后统一用视图的生命周期来处理相应逻辑，actived（被激活） 和 deactived （取消激活）事件

### 要注意的地方：

* 新的QApp会自动渲染首页视图，所以必须配 QApp.config({indexView: '首页的名称'})，默认是 index，如果用了 QApp-Hy，用QApp.hy.config() 配置过了 indexView，那么你不用再配置了。
* 由于老版本 QApp 不自动渲染首页View，导致业务再入口文件中，自己主动渲染了首页View，现在需要去掉。
* 由于原router不是很好用，很多业务线都把hashRouter置为false，现在已经是默认开启了，请删去false配置。