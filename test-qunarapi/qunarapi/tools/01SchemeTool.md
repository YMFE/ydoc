## 简介
[Scheme Tool](http://ued.qunar.com/mobile/schema/)是利用URL Scheme的[原理](#URLScheme原理)跳转到去哪儿大客户端中打开指定的网站，可以用来测试使用了QunarAPI的页面。   

## 使用说明
在Scheme Tool的Input URL中输入Qunar API的测试页面:<http://hy.qunar.com/source/demo/unittest.html>点击GO就可以调用去哪儿大客户端打开该测试页面，显示客户端支持的QunarAPI，Use Hy开关可以设置是否使用原生的WebView形式来打开URL。   

**备注**：最好使用原生的浏览器打开Scheme Tool页面，第三方浏览器可能会出现不能正确跳转的情况。

<image src = "source/images/schemetool1.png" width="432" height="768"> <br/>
<image src = "source/images/schemetool2.png" width="432" height="768"> <br/>

使用Full Screen Web View打开的情况：   
<image src = "source/images/schemetool3.png" width="432" height="768"> <br/>

<h2 id="URLScheme原理">原理</h2>
URL Scheme 是统一资源标识符（Uniform Resource Identifier ）的命名结构，就是定义一个资源的。但是，这个资源是一个宽泛的概念，并不一定是我们所说的web资源，它可以是你本机的一个文件，也可以是网络上的视频等等。使用URL Scheme可以完成移动端中应用唤起和跳转的作用。

大客户端Hytive Scheme[使用说明](http://wiki.corp.qunar.com/pages/viewpage.action?pageId=96653941)中对大客户端Scheme跳转做了详细的解释，Scheme Tool的作用就是自动生成下图中的URL，从而可以跳转到大客户端打开对应的url。

![schemetool4](source/images/schemetool4.png)

上图中的scheme在iPhone上会替换为qunariphone，Android上会替换为quanraphone,用来指定使用大客户端来打开该URL，具体的参数说明如下：   

1. 包含了scheme和host部分，后面的“？”代表query部分。可以对应为http和www.xxx.com
2. query部分总共有四个参数，分别在2,3,4,5部分
3. 2是url部分（必须的），这部分url需要编码，如果url比较复杂，存在汉字的话，则需要二次编码，javascript上结合encodeURIComponent和encodeURI   
4. 第3部分name是给打开的页面起一个名字，方便路由（可选的）   
5. type目前只有一个类型，navibar-none代表没有导航条，不填会有导航条（可选的）   
6. navigation部分是比较复杂的一部分，这个参数只有在没有type参数时，才会起作用。此参数会对Hytive的导航条进行配置。   
7. navigation的参数可以参考qunarapi。