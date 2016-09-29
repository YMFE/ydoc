Hy 是移动跨平台移动应用程序解决方案，目前支持 Android 和 iOS，她不单可以让前端开发人员无缝开发 Native 应用程序，还可以使用 Native 端各种感应器，并结合 Server 可以达到静默升级；结合 QApp、Kami、Yo 来实现类 Native 的 JS 交互。另外 Native 开发人员也可以实现 Hy 插件来扩充 Hy 功能。

大体结构如下：
![image](source/images/imsgagdfaf.png)

> Biz H5 Zip：HTML的打包文件，Wagon Lib会通过检测Server版本信息来升级  
> Biz Plugin：扩展Wagon的功能  
> Wagon Lib：Wagon库文件  