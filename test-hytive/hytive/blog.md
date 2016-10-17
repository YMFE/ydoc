### [改头换面——通过修改类名防止外部符号冲突](source/blog/mangle-classname.html)
制作静态库时，经常会引用各种第三方代码。

对于一些普遍使用的库，当引用了相同的第三方代码时，就会因为符号与静态库中重复而导致冲突。

### [初窥XCode Project文件](http://gitlab.corp.qunar.com/chao.meng/wagonguide/blob/master/ios/inside-xcode-project.md)

iOS应用通过XCode工程和xcodebuild工具进行构建，因此要维护自动化的构建服务，必须操作XCode工程，而不像Android一样直接操作build.gradle即可。

XCode项目内部实际上是一个上古时代的plist格式，比较难以阅读，所以维护起来比较蛋疼= =

### [iOS项目中静态库Framework的打包](http://gitlab.corp.qunar.com/chao.meng/wagonguide/blob/master/ios/ios-framework-package.md)
iOS SDK自身的一些库大多使用Framework的形式提供。Framework的好处都有啥，谁说对了就给他：

* 将头文件和库文件绑到一起，只要把Framework拖进项目，基本可以做到开箱即用；
* 可以将多个版本的库文件打包到Framework中，而且可以进行切换。
本文简要介绍了如何手动打包一个Framework的方法。

### [一些或许有用的开源项目](http://gitlab.corp.qunar.com/chao.meng/wagonguide/blob/master/ios/open-source.md)
针对Wagon，值得参考的开源项目。
