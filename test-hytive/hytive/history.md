
wiki地址：<http://wiki.corp.qunar.com/pages/viewpage.action?pageId=78573960>

### 2015-06-01
#### iOS
> feature

* InvoiceTitle插件
* GestureView插件
* 替换桥为ios-bridge@86f11340c6d744e441b93a1c0cfaaefc
* Login插件添加uuid参数

> fix bug

* 修复WGBridge 中变量循环引用 引起的崩溃问题

### 2015-05-26
#### iOS
> feature

* QunarApi：分享、定位、网络状态、扫一扫、新开webview、登录、导航条、设备信息
* 通用的Schema，提供了Schema接口
* 支持Pitaya的通用ViewController（WGPitayaViewController）
* 添加WGTimer类，方便打印执行时间
* 删除了配置文件，项目中可以不用配置文件
* 白名单通过Referer等策略动态根据项目添加
* 支持静态资源打包到ipa中
* 替换桥为ios-bridge@3effe135ce1c75623fde108367d816dc
* response 头加Access-Control-Allow-Origin
* 规范wagon lib使用方式，所有外面使用，都必须通过wagon.h 头文件

> fix bug

* NSStream 引起黑屏问题, 且NSStream具有性能问题，故而采用NSData处理
