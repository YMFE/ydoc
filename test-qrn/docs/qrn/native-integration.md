## 在 Native 项目中接入 Qunar React Native

### iOS大客户端中使用

- 在`Podfile`中引入`ReactNativeLib`依赖：
``` ruby
   pod 'ReactNativeLib', '~> 0.beta'
```
- 使用以下代码来打开一个 React Native 页面：
``` objc
#import "QRCTVCCreater.h"
// ...
//在主线程调用
[QRCTVCCreater createVCWithHybridId:hybridId  // 业务的 hybridId
                         moduleName:module    // 业务的 module name
                  initialProperties:initProps // 传入的初始属性
                  completionHandler:^(QRCTViewController *qrctVC, NSError *error) {
                      //回调为主线程
                      if (error) {
                          // handle error
                          return;
                      }
                      [VCController pushVC:homeVC WithAnimation:nil];
                  }];
```

- 如果仅是想要在已有的 Native 页面中嵌入一个 React Native 界面，则可使用`QRCTViewCreater`：
``` objc
#import "QRCTViewCreater.h"
//  ...
//在主线程调用
[QRCTViewCreater createViewWithHybridId:hybridId  // 业务的 hybridId
                               moduleName:module    // 业务的 module name
                        initialProperties:initProps // 传入的初始属性
                        completionHandler:^(RCTRootView *rootView, NSError *error) {
                            //回调为主线程
                            if (error) {
                                // handle error
                                return;
                            }
                            [theMainView addSubview:rootView];
                        }];
```

### Bridge
Qunar React Native会对RCTBridge进行缓存和复用的管理，因此不要去自己操作bridge，如果需要给自己业务的bridge发送消息可以使用`QRCTEventSender`
```objective-c
//可以在任意的线程调用
[QRCTEventSender sendToHybridId:@"hybridId"     //RN业务hybridId
                      eventName:@"JSEventName"  //JSEventName
                       withData:data];          //发送的数据
```

JS如果需要监听该广播，使用下面的方法：
```js
RCTDeviceEventEmitter.addListener(JSEventName, (data) => {
  //Do something  
});
```
