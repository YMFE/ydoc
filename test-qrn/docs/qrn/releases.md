## QRN 发布记录

<style>
.release-date {
  font-size: 1em;
  color: grey;
}
.change-type {
	font-size: 1em;
	color: #0D98AF

}
</style>

### QRN 1.3.0 

<span class="release-date">RC发布时间2016.8.18  <br>正式版本预期时间2016.8.26</span>

<h4> <span class="change-type">General</span></h4>   

##### New feature and enhancements   
* JS运行的异常不会再让APP崩溃，由大客户端崩溃统计组件收集
* `@qnpm/qunar-react-native-ext` 升级到0.2.0
* 新增 `TimePicker` 组件，用于用户选择日期和时间，[查看详情](http://ued.qunar.com/qrn/component-TimePicker.html)
* 新增 `Modal` 模态弹层组件, [查看详情](http://ued.qunar.com/qrn/component-Modal.html)
* 依赖的 `node_module` 模块 `lodash` 固定版本为 `4.13.1`

<h4> <span class="change-type">JS</span></h4>  

##### New feature and enhancements   
* `@qnpm/qunar-react-native-ext` Navigator UI 组件重构，提供下面新特性
  *  `leftButtonText`、`title`、`rightButtonText`参数添加支持接收字符串、JSX、返回JSX的函数作为参数
  *  `leftButtonPress`、`rightButtonPress` 添加 `route` 和 `store` 两个参数
  * 新增 `buttonWidth` 参数用来配置按钮宽度
  * 新增 `statusBarBackgroundColor` 参数用来配置状态栏背景色   
* QRN `ScrollView` 添加 `keyboardShouldPersistTaps` 参数
* `Toast` 添加支持 `duration` 和 `offSet` 属性不传值，支持一个参数的调用了~
* `Switch` 组件 Android 添加支持 `tintColor`、`onTintColor`、`thumbTintColor` 属性
* QRN `TextInput` 废弃 `autoShowKeyboard` 属性
* `RefreshControl` 添加两种状态：刷新加载成功、刷新加载失败，对应的文本设置项：`successContent`、`successIcon`、`failContent`、`failIcon`
* QRN `ScrollView` 
  * 添加支持在 `stopRefreshing` 时设置动画时长和刷新结果
  * 添加 `keyboardShouldPersistTaps` 属性
  * 添加 `onRefresh` 回调用来给上层组件使用
  * 添加在 `scrollTo` 时支持设置动画时长

##### Bug fixes
* `@qnpm/qunar-react-native-ext` 
  * fix `Router.close` 关闭其他VC中的view不生效的问题
  * fix 接受 `biz` 类型的 `scheme` 打开一个尚未 mount 的 RN App 时抛出异常的问题
  * fix `setSwipeBack` 在 `Router.back` 时不生效的问题
* fix ios `DatePicker` 组件的日期传值问题   
* fix `InfiniteListView` 修复在 dev 模式下，`RefreshControl` 引起的报错
* fix `Slider` 的 `maximumValue` 非 `step` 整数倍时引起的浮点数问题
* fix `CookieManager.removeCookie()` 时不传 `value` 属性导致的报错


<h4> <span class="change-type">iOS</span></h4>   

##### New feature and enhancements 
* `Geolocation` 申请的定位权限从后台定位修改为使用期间定位
* 修改了`QRCTViewController` 的 `VCName` 逻辑，`VCName` 的定制支持使用 `@qnpm/qunar-react-native-ext` 的页面

##### Bug fixes
* fix Dev Menu 在VC切换时可能失效的问题
* fix `Image` 中 `capInsets` 属性失效的问题，该属性 Android 暂不支持
* fix `CookieManager.removeCookieForKey()` 方法失效的问题 
* fix `CameraRoll.getPhotosFromGroup()` 方法中第二个参数 `after` 失效的问题
* fix `Toast`在页面有其他`window`时没法正确显示的问题
* fix QRN `TextInput` 切换 `multiline` 属性导致已有内容丢失的问题

<h4> <span class="change-type">Android</span></h4>  

##### New feature and enhancements   
* QRN 初始化时间优化，提高启动速度
* QRN 运行环境销毁回收优化
* `scheme` 接受支持 JSONArray

##### Bug fixes
* fix `CookieManager`若干问题
* fix `CameraRoll.getPhotosFromGroup()` 相册获取结果没有 `page_info.end_cursor` 和 `page_info.has_next_page` 属性的问题


### QRN 1.2.0 

<span class="release-date">2016.7.26</span>

<h4> <span class="change-type">General</span></h4>   

##### New feature and enhancements   
* 添加分享API: `QShare` ，[查看详情](http://ued.qunar.com/qrn/api-QShare.html)
* 添加QAV无埋点统计方案，可以统计点击事件和route事件，业务不需要做任何改动！


<h4> <span class="change-type">JS</span></h4>  

##### New feature and enhancements   
* 新增JS模块`HybridIdRegistry`，可以获取 `hybridId` 标识
* 新增 UI组件 `SwipeListView`，有滑动菜单的ListView，[查看详情](http://ued.qunar.com/qrn/UI-SwipeListView.html)
* `InfiniteListView`  添加 `setNativeProps` 方法
* QRN `ScrollView`   
  * 添加 `keyboardDismissMode` 参数   
  * 添加 `onScrollBeginDrag`、`onScrollEndDrag`、`onMomentumScrollBegin`、`onMomentumScrollEnd` 回调    
  * `Checked` 组件添加支持style属性是数组   
* `ListView`  添加 `setNativeProps` 方法


##### Bug fixes
* 修复 Debug In Chrome 时JS文件对应错误的问题
* `@qnpm/qunar-react-native-ext`   
  * 修复多个native页面都展示同一个QView时，后退操作导致的问题   
  * 修复 `onDidFocus` 时，`route` 报错导致的崩溃问题   
  * 修复安卓物理返回键功能在使用 `redux` 时失效的问题   
* `InfiniteListView`
  * 修复不定高时偶尔白屏的问题
  * 修复下拉刷新时布局错乱的问题
  * 修复当rowData等于0时未渲染的问题
* QRN`ListView`  修复 `stickyHeader` 的渲染问题


<h4> <span class="change-type">iOS</span></h4>     


##### New feature and enhancements
* 调试工具添加打开`QRN Debug VC`，方便跳转打开RN页面

##### Bug fixes   
* QRN `TextInput`  修复调用 `blur` 方法失效的问题

<h4> <span class="change-type">Android</span></h4>    

##### New feature and enhancements
* 离线QP资源包  提供单独的离线资源包注册项目组件

##### Bug fixes
* QRN `ScrollView`  修复动态header功能失效的问题 

###  QRN 1.1.0 

<span class="release-date">2016.6.22</span>

<h4> <span class="change-type">General</span></h4>   

##### New feature and enhancements   

* qunar-react-native-ext 发布0.0.2
* 添加InfiniteListView组件，高性能固定高度的ListView
* JS Bundle中添加打包的tag信息，崩溃信息会包含打包的tag，需要更新nodeModules
* 添加获取APP中hybridId对应的QP包版本模块


<h4> <span class="change-type">JS</span></h4>  

##### New feature and enhancements   

* QRN ScrollView   
添加bounces参数，超出页面范围的时候是否禁止弹性滚动

##### Bug fixes
* QRN ScrollView   
修复indicator的渲染逻辑
* qunar-react-native-ext   
修复router在页面未加载就取消导致的崩溃   
对应崩溃信息`undefined is not an object (evaluating 'x[t].nav')`

<h4> <span class="change-type">iOS</span></h4>       

##### Bug fixes   
* 官方 ScrollView   
重新设置stickHeader后位置错误的问题

<h4> <span class="change-type">Android</span></h4>    

##### New feature and enhancements
* Image   
支持Image的getSize方法获取图片大小
* 用ActivityLifecycleCallbacks替换Instrumentation监听生命周期

##### Bug fixes
* iconfont   
修复htc,zte创建iconfont临时文件失败的情况
* fresco   
fresco的fetch支持使用QP包图片资源



<br/>
### QRN 1.1.0-RC 
<span class="release-date">2016.6.17</span>

<h4> <span class="change-type">General</span></h4>   

##### New feature and enhancements
* JS崩溃添加额外信息，可以追溯崩溃的JS文件，定位崩溃的QP包。  
* Qunar React-Native-Ext 放入框架包中，随框架包升级（**业务JS工程的package.json中需要去掉ext依赖**）。

<h4> <span class="change-type">JS</span></h4>    

##### New feature and enhancements
* QRN ScrollView
Add support for setState basic props(alwaysBounce*, horizontal, pagingEnabled, contentOffset, contentInset, refreshControl)

##### Bug fixes
* QRN ScrollView
优化 indicator render logic
* QRN ListView
优化renderHeader/renderFooter性能，调整pageSize默认为1   

<h4> <span class="change-type">iOS</span></h4>  

##### Bug fixes
* 7.0.x中设置字体大小会崩溃的问题
* QRN ScrollView
stickHeader点击事件穿透的问题
重新设置stickHeader后位置错误的问题

### QRN 1.0.0 
<span class="release-date">2016.6.2</span></h3>

- [Android] 6.0权限适配
- [Android] 优化框架js文件获取不到的异常处理
- [Android] 优化so文件加载失败异常处理
- [Android] 修复酷派手写输入法导致rn touch事件崩溃问题
- [Android] 修复ChoreographerCompat类空指针问题
- [Android] 修复小米getTouchSlop()空指针问题
- [Android] 新增statusbar显示和隐藏功能(QStatusBarModule)
- [Android] 新增ab测试接口(ABTestModule)
- [Android] 新增大客户端数据存储接口(QStorageManager)
- [Android] 新增cv参数接口(CVParamModule)
- [Android] 新增发送广播接口(BroadCastModule)
- [Android] 新增rn的qp注册类
- [Android] 新增deviceinfo的releaseType和atomVersion属性
- [Android] 完善QHttpHelper接口功能
- [Android] 完善单量更新请求的发送功能
- [Android] 修复加载jsBundle失败直接崩溃的问题
- [Android] 增加abTest方法测试
- [iOS] fix 插件block参数中引用到bridge，导致如果存储了block参数后bridge不能正确释放的问题
- [iOS] 修复GIF点击home健后切换回来消失的问题
- [iOS] 修复Modal在iOS7下设置transparent不生效的情况
- [iOS] 修复RN页跳转native，再回来动画效果问题
- [iOS] 修复textField 如果默认文本超过了maxLength则不能删除的问题 同时修复了对表情的支持，在切文本的时候考虑表情的情况
- [iOS] 修复定位超时的问题
- [iOS] 修改QRCTAppInfo的设置方法
- [iOS] 增加abTest方法测试
- [iOS] 更新bridge的hybridId设置方式
- [iOS] 添加了如果对应的QP包更新则在回到主页的时候释放掉bridge
- [iOS] 红屏提示的时候增加hybridId
- [ios] 修复 iOS7 下无法取到平台bundle的静态资源
- [ios] 修复<Image>的`defaultSource`属性不可用
- [ios] 修复Image渲染时的上下文错误
- [ios] 修复初次加载require本地图片不生效
- [js]  feat(ListView): add 	scrollEventThrottle props, default 50
- [js]  feat(ScrollView): add onScrollAnimationEnd api
- [js]  feat(TabBar): add api renderIcon/iconStyle/titleStyle
- [js]  fix(ListView): call setState when ListView unmounted
- [js]  fix(ListView): fix stopRefreshing blank
- [js]  fix(ListView): not showing content at first time if rows not cover screen
- [js]  fix(ListView): optimize first render
- [js]  fix(ListView): scrollTo long distance showing white page
- [js]  fix(ListView): setting wrong y when pushing new line
- [js]  fix(ListView): show white page when scroll too fast
- [js]  fix(ListView): show white part when stopRefreshing sometimes
- [js]  fix(ListView): show white screen when invoking scrollToTop
- [js]  fix(Radio/Checked): fix style problem in android
- [js]  fix(ScrollView): onScrollAnimationEnd use contentOffset
- [js]  fix(Slider): move gesture conflicts with ext
- [js]  fix(Slider): step calculate error
- [js] 临时修复Navigator出现e.some异常
- [js] 修改image path 解析 [ios] 支持线上asset获取
- [js] 增加特性：navigator 暴露接口支持推进页面时后面页面不消失，用以模拟 Modal 组件
- [misc] bundle命令改为多线程打包，加快运行速度
- [misc] react-native命令可以从官版init工程
- [misc] 使用新的build.sh模板入口，由发布脚本来管理node/python环境
- [misc] 修改字体验证规则，允许字体fontFamily等于hybridId
- [misc] 加入编译时的TTF文件验证
- [misc] 增强react-native命令，使之可以更快的初始化或者升级react-native的node_moduels库

### QRN 1.0.0-RC2 
<span class="release-date">2016.5.17</span>

- 修复若干开发模式红屏问题
- 向`QScrollView`添加`scrollEnabled`属性
- 向`QScrollView`添加`pagingEnabled`属性
- 修复`QScrollView`部分情况下无法滚动的bug
- 修复部分动画的鬼畜效果
- 修复`TextInput`使用输入法联想时长度限制不生效的问题
- 添加其他组件

### QRN 1.0.0-RC 
<span class="release-date">2016.4.29</span>

- 正式版本，已支持大客户端多个业务上线
