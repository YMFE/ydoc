Hytive是一款移动端Web Runtime的跨平台开发方案，支持基于HTML5和Javascript创建类似于移动端原生应用。该方案主要对Web运行环境进行优化，最大限度的挖掘Web性能，以及提供丰富的原生APIs供Javascript调用(或监听)。

Hytive能让Web的用户界面体验和交互能力跟Native媲美。操作性能是web中体验最薄弱的一环，具体而言，这包括：转场动画不流畅、DOM结构过于复杂导致卡顿，用Javascript实现固定头尾布局性能较差等。

因而我们用Hybrid技术来达到Javascript达不到的目的，同时我们选择了最易理解的方式：让前端开发人员可以操作多个Webview，让Native和WebView很好的配合使用。

* 多Webview互相配合。 让一个webapp拆到多个webview中运行，并能通过javascript来调度，解决了页面过大导致卡顿的问题。界面切换由Native实现，解决了界面切换时动画不流畅的问题。

* 超强的扩展能力。通过Plugin，HYView等接口，可以扩展Hytive，实现业务特有的功能。

* 丰富的Hytive基础插件。 Hytive本身已经提供了丰富的插件，针对各种业务场景，都有相应的插件来帮助webapp实现相应的功能，同时我们提供了一套通用的api，即[QunarApi](qunarapi-api.html)

* 完善的开发工具支持。
    * 针对前端，在开发阶段可以使用[Chrome 扩展](tools.html#Chrome扩展工具)模拟Hytive bridge，可以在Chrome中完成所有开发。
    * 在Native客户端还有完善的[debug 工具](tools.html#Debug工具)，可以配置hosts等。

支持过多个项目，比如[外卖](project.html#实战项目-外卖)，[客栈青旅](project.html#实战项目-客栈民宿)等等。touch端是基于 [QApp](http://ued.qunar.com/mobile/qapp/doc/)、[Yo](http://ued.qunar.com/mobile/yo/doc/)、[Kami](http://ued.qunar.com/mobile/kami/doc/) 等框架开发完成。

总之，我们保持了所有web的风格和灵活性。
