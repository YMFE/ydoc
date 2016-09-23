## Android RN 接入
***
引入aar
```java
atomCompile 'com.qunar.spider:react:1.2.0@aar'
compile 'com.qunar.3dparty:infer-annotations:1.5.0'

//这个在自己的独立模块运行需要添加，在正式打大客户端的时候需要去掉。
compile ('com.qunar.react:qunar-react-native-dependence:0.9.1'){
        exclude group: 'com.facebook.fresco', module: 'imagepipeline'
        exclude group: 'com.facebook.fresco', module: 'fbcore'
    }
```
atom
```java
{
        "packageName": "com.mqunar.react",
        "versionCode": "10"
}
```
注：如果想要在自己的独立模块运行，需要初始化rn。测试的时候，你可以直接继承ReacApplication,里面的onCreate()会初始化rn。你也可以把里面的初始化方法在自己的Application里面调用。
***
### 1.跳转到rn页面
##### 通过发送scheme跳转到rn页面：
qunaraphone://react/open?hybridId=xxx&moduleName=xxx&qInitView=xxx&initProps=encode({})
##### 通过代码调用打开rn页面,类QReactNative：
直接打开rn页面，第一次创建ReactContext会有默认loading.

```java
public static void startReactActivity(Activity mActivity, String hybridid, String module, Bundle initProps)
```
如果不希望使用默认loading,你也可以调用接口创建ReactContext显示自己的loading.
在调用接口创建ReactContext之前显示自己的loadingng,在回调的接口里面隐藏自己的loading.
然后调用startReactActivity()打开rn页面。

```java
public static void createReactInstanceWithCallBack(String hybridid,QReactInstanceCreateCallBack back)
```
### 2.使用ReactRootView内置到自己的Activity（不推荐）
##### 使用ReactRootView同时Activity继承我们的QReactBaseActivity：
```java
    /**
     * 创建ReactRootView
     * 回调函数为js加载成功或者失败以及view渲染成功。
     * 如果js加载成功,在页面渲染完成的时候，会回调onViewShow().可以在里面隐藏自己的loading。
     */
    QReactNative.createRootViewUseBaseActivityWithListener(
      hybridid, module, initProps, this, new QReactNative.QReactInstanceEventListener() {
        @Override
        public void onJsLoadingSuccess(View view) {
          //ReactContext创建完成，js加载成功，返回ReactRootView.可以添加到自己的actiivty
          frameLayout.addView(view);
        }

        @Override
        public void onJsLoadingFailure() {
          //js加载失败，取消loading页。重试
          progressDialog.dismiss();
        }

        @Override
        public void onViewShow() {
          //页面渲染完成，取消loading
          progressDialog.dismiss();

        }
      });
```
##### 使用ReactRootView，使用QRnActivityHelper：
如果希望继承自己的Actiivty而不是我们的QReactBaseActivity。可以这样写。使用我们的QRnActivityHelper。
```java
    QReactNative.createRootViewUseHelperWithListener(hybridid, module,
      initProps, this, this, qRnActivityHelper, new QReactNative.QReactInstanceEventListener() {
        @Override
        public void onJsLoadingSuccess(View view) {
          //使用view布局
          frameLayout.addView(view);
        }

        @Override
        public void onJsLoadingFailure() {
          //重试
          progressDialog.dismiss();
        }

        @Override
        public void onViewShow() {
          //页面渲染完成，取消loading
          progressDialog.dismiss();

        }
      });
```
### 3.注册自己的Module和ViewManager
我们支持业务注册自己的Module和ViewManager。在打开自己的RN页面之前调用QReactNative的方法注册进来。

```java
public static void registerReactPackage(String hybridid, ReactPackage reactPackage)
```
### 4.Debug调试
通过发送scheme可以打开debug页面：qunaraphone://react/debug
长按大客户端的Qbug的第三个按钮会发送这个scheme进入Debug页面。
可以设置js加载方式。查看Log日志等功能。
### 5.Demo实例
上面说了这么多还不如来个demo来的直观。
demo地址：<http://gitlab.corp.qunar.com/react_native/qunar_react_native/tree/adr_April_release/Examples/Playground/android/src/main/java/com/mqunar/react/test/androiddemo>
里面的MainAdActivity有rn的各种使用方式和注释。

