## 开始使用 DEMO

**所有最新的demo都在master分支上，如果使用的不是master分支，请更新。**

1. 第一步：去 `gitlab` 上弄一个APP，地址如下：[以IOS为例，用master分支就行](http://gitlab.corp.qunar.com/react_native/app_template_ios_mclient)

2. 第二步：去 `app_template_ios_mclient` 工程的目录，在 `xcode` 中运行 `./ios/QRN-Template.xcworkspace` 这个文件，即那个白色图标，然后在 `xcode` 中点击运行按钮在模拟器中运行该APP，就能看到demo了。

如果还想进一步在本地调(wan)试(er)demo，可以通过以下步骤进行。

3. 第三步：去 [这儿，也是用master分支就行](http://gitlab.corp.qunar.com/react_native/qunar_react_native_demo) 弄下来 js 代码。

4. 第四步：去 `qunar_react_native_demo` 工程的根目录，执行 `npm start` （并不需要npm install，因为我们把node_modules提交了）。

5. 第五步：然后，在模拟器打开的APP中，关掉红色的提示，用快捷键 `command+control+z` 唤起配置工具，在『JS Bundle加载方式』中，点击第一项，切换到『Local Server』，配置『Server Host&Port』为 `http://localhost:8081`（应该默认就是这个），然后一路『保存』&『保存并重启』。再次打开APP，重新加载一下js就好了。如果搞不定配置工具，可以参考 [这儿](http://ued.qunar.com/qrn/doc/index-%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.html) 的说明。

    ![devtool-ios-evn](images/devtool-ios-evn.png)
