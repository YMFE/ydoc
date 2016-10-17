H在 iOS 上开发 Hytive 插件并不是一件复杂的事情，下面从 “Hello world” 开始，逐步进行说明。

```objc
#import "HYPlugin.h"
// 一个插件类，应该是继承自 HYPlugin
@interface HYHelloWorldPlugin : HYPlugin  

@end
```
   

```objc
#import "HYHelloWorldPlugin.h"

@implementation HYHelloWorldPlugin

// 这个标志会把插件注册到 Hytive 中， 从而 Hytive 知道了这个类属于一个插件
HY_LAZY_LOAD_PLUGIN()

// 方法的定义比较特殊，需要按照插件规定的格式写，只有按规定格式写方法签名，才能得到正确的参数，从而 JS 和 Native 可以很好的传参或回调
- (void)hello:(NSDictionary *)data callback:(HYJavaScriptCallback)responseCallback {
    // HANDLE_NAME 相当关键，确定了和前端约定的 api
    HANDLE_NAME(hello);
    
    //data为前端调用navtive时传递的参数，responseCallback为回调前端函数

    if (data && [data objectForKey:@"value"]) {
        id value = [data objectForKey:@"value"];
        NSDictionary *responseDict = @{@"result": [NSString stringWithFormat:@"Hello, %@", value]};

        // 这是一个成功的回调
        // 给 js 返回数据的 callback，数据格式是 NSDictionary
        responseCallback(JSResponseSuccess(), responseDict);
    }else{
      // 这是一个失败的回调，需要传递errcode,和errmsg
        responseCallback(JSResponseFail(-1, @"参数为空"), @{});
    }
}

@end
```

麻雀虽小五脏俱全，上面插件就是一个 Hytive 完整的插件， 前端调用方式。

```js
WebViewJavascriptBridge.invoke('hello', function(data){console.log(data)}, {value='world'});
// 可以返回 Hello, world
```
