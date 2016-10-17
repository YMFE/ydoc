Qunar React Web
=============
React Web是Qunar React Native的Web端实现，通过实现所有能在Web上实现的Native接口，实现一份业务代码，既可以在Native上，也能在touch上运行。

React Web适用于开发Touch或者Hybrid Webview的项目。


## 优势

- 内置于Qunar React Native，提供一致的开发、构建体验。
- 基本实现了所有Qunar React Native的接口与组件。
- 在框架内部解决浏览器兼容问题。

## 技术支持

- QTalk: qincheng.zhong, qianjun.yang, wangxiaoyu.wang, zhenying.liu
- Issues: http://gitlab.corp.qunar.com/react_native/qunar_react_native/issues

## 开发进展

这里汇总了当前 React Native for Web 与 React Native 官方和 Qunar React Native 组件之间的差距，每次 Qunar React Native 更新后都在这里更新状态，作为参考。

对于 Qunar React Native 中进行过扩展的 React Native 组件或 API，以 Qunar React Native 中的状态为准。

**状态说明：**

- `(X)`：表示尚未实现
- `(M)`：表示不完全实现，或正在正在进行中（middle）
- `(D)`：表示该接口或者 API 已经过期（deprecated）
- `(QRN)`：表示 Qunar React Native 进行了扩展，以 Qunar React Native 中状态为准
- ~~不支持~~：使用删除线表示不支持
- 无任何标记，表示已经完成

#### React Native 的基础组件和 API(RN 0.32)

** 组件 **

- ActivityIndicator
- ActivityIndicatorIOS
- DatePickerIOS
- ~~DrawerLayoutAndroid~~
- Image
- ListView(QRN)
- ListView.DataSource(QRN)
- MapView (X)
- Modal（QRN)
- Navigator
- NavigatorIOS
- Picker
- PickerIOS
- ProgressBarAndroid (M)
- ProgressViewIOS (alias ProgressView)
- RefreshControl (QRN)
- ScrollView（QRN）
- SegmentedControlIOS
- Slider (QRN)
- SliderIOS
- ~~StatusBar~~ （控制状态栏, web 端目前无法实现）
- ~~SnapshotViewIOS~~
- Switch
- TabBarIOS(X)
- TabBarIOS.Item(X)
- Text
- TextInput
- ~~ToolbarAndroid~~
- TouchableHighlight
- TouchableNativeFeedback (X)
- TouchableOpacity
- TouchableWithoutFeedback
- View
- ViewPagerAndroid
- WebView

** API **

- ActionSheetIOS
- ~~AdSupportIOS~~
- Alert
- AlertIOS
- Animated
- AppRegistry
- AppState
- AsyncStorage
- BackAndroid (X)
- CameraRoll (QRN)
- Clipboard
- DatePickerAndroid (X)
- Dimensions
- Easing
- Geolocation
- ImageEditor
- ImagePickerIOS(alias ImagePicker)
- ImageStore
- IntentAndroid (X)
- InteractionManager (X)
- LayoutAnimation (M)
- Linking
- NativeMethodsMixin
- NetInfo
- PanResponder
- PixelRatio
- PushNotificationIOS (X)
- Setting(X)
- StatusBarIOS (X)
- StyleSheet
- Systrace(X)
- TimePickerAndroid (X)
- ToastAndroid
- Vibration
- VibrationIOS

#### QRN 中扩展的组件 和 API

** 组件 **

- ScrollView
- RefreshControl
- LoadControl
- ListView
- InfiniteListView
- Loading
- ProgressView
- QLoading
- QLoadingError
- Button
- Checked
- Radio
- Tab
- TabBar
- TabBarItem
- Slider
- TimePicker
- Modal

** API **


- DeviceInfo
- LoginManager
- CookieManager
- CameraRoll
- ImageUploader
- Toast
- QHotDogNetWork
- MapUtils
- UELog
- CVParam
- GeoLocation
- QStatusBar
- ABTest
- QShare

** 注意 ** 由于平台的差异性，API中有些功能无法完全实现，详情请参考具体文档。
