接入大客户端可参考外卖和客栈民宿

#### 调用 Hy 内置 View Controller 打开 Hybrid 页面

> 示例代码可以参考大客户中的 “外卖” 和 “客栈”。

```objective-c
HYViewController *viewController = [[HYViewController alloc] initWithName:vcName];
viewController.homeNavTitle = title;
viewController.mainUrlString = mainUrl;
[[VCManager mainVCC] pushVC:viewController WithAnimation:[VCAnimationClassic defaultAnimation]];
```

#### 在自定义 View Controller 中嵌入 HYView

如果不想使用 Hy 默认的 VC，可以自己实现一个，只需要把 HYView 嵌入其中即可。

> 完整示例可以参考大客户端 HYWebVC.m

HYView 的使用和普通的 UIView 几乎没有区别，如果不需要设置 Project，只需两步：

```objc
HYView *view = [[HYView alloc] initWithFrame:frame];
[parentView addSubview view];
```

默认情况下，新创建的 HYView 将会被绑定到 `commonProject` 上，基本上可以满足绝大多数的使用场景。
