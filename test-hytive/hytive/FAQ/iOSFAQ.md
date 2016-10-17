### * 页面中嵌入iframe会发生什么？
解答：页面中嵌入iframe，在某些情况下会影响桥的注入。
1、当iframe是非Qunar域的时候，桥正常
2、当iframe是Qunar域的时候，桥可能不正常。
所以建议大家不要在页面中使用qunar域的iframe。最好不用iframe。

### * 嵌入大客户端，业务需要做什么？
解答：业务主要关注三部分：入口，资源，插件
> 入口：不管是通过scheme 还是 通过点击按钮进入子项目，都需要一个Hytive的入口。这个入口其实是一个ViewController，而且这个ViewController和Hytive暂时没有关系，当添加了HYView之后，才真正和Hytive有了关系。
HYView用法和UIWebView类似，他是WebView的封装，添加HYView之后，就可以使用大部分插件了，极少部分设计UI的插件，需要按UI规则自定义插件。
Hytive提供了几个通用的ViewController，分别有HYViewController（自带导航条，参看外卖首页的导航条），HYWebVC（一个类似微信朋友圈的VC）。

> 资源： Hytive设定了资源的打包方式，只要用我们提供的工具打包，放到相应的位置，业务是不用太多关注这部分的。

> 插件： 这部分是Hytive的重头戏，所有的功能扩展都可以在这里进行，和native的 任何通信都可以在这里完成。HYTive已经提供了很多通用的插件:<http://hy.qunar.com/docs/qunarapi-api.html>，如果你能找到符合要求的，就不用再开发了。

### * 自己开发的Plugin为啥会崩溃到webCore线程？
解答： 程序崩溃的原因很多，除去常见的原因，如果你的plugin涉及到UI，则一定要在主线程中执行。

### * Plugin不生效是神马原因？
解答：您可能忘了写HY_LAZY_LOAD_PLUGIN() 或者 HY_AUTO_LOAD_PLUGIN() 了。

### * 针对Pitaya 更新服务器，手动打包，为啥添加之后没有效果？
解答：因为你打包的时候多了一层目录，你应该只打包根目录下面的文件，不信可以通过itools查看。
