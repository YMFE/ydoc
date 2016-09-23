## 开发 QRN 项目

### 配置开发环境

首先需要配置开发环境，在手机或模拟器中安装客户端并配置好开发工具，请参考 [开发工具](index-开发工具.html) 中的详细说明。

### 开发建议

在配置完环境之后，就可以愉快的开始Coding了。

- 在 `RN` 的基础上，`QRN` 新增和修改了许多 [基础组件](component.html) 和 [API](api.html)。
- 为了更流程的开发，`QRN` 提供了增强的框架 [QRN-Ext](extension.html)。内容包括：
    - 插件机制、Utils
    - 增强的路由方案 [Router](extension-Router.html)
    - 增强的前端扩展 [Webx](extension-WebX.html)
    - 数据流 [Redux](extension-Redux.html)
- 调试方面，推荐使用 [chrome调试](index-使用Chrome调试.html) 或 [Atom调试](index-使用Atom调试（实验性）.html)
- 编程规范在 [这里](http://gitlab.corp.qunar.com/react_native/react-native-code-guide/tree/master)

**最重要的是，我们有Demo哦！**[Demo在这儿](demo.html)

### 静态资源的使用

在项目的 `./src/scripts/assets` 文件夹中有 `QFontSet.js` 和 `QImageSet.js` 两个文件，分别用来注册字体和图片资源的，只有在这两个文件中注册过的静态资源才能被打包工具打包。

![dev-resource](images/dev-resource.png)

**字体示例**

```
<Text style={{fontFamily:'hybridId_font1'}}>{'\uf089'}</Text>
```

**字体使用注意事项**

1. 上图中的 `hybridId_font1` 和 `hybridId_font2` 指的是字体文件本身的font-name，也是在项目中使用时的fontFamily。这个名称必须以 `hybridid_` 开头，否则打包文件会报错。
2. 可以使用 [iconfont服务](http://iconfont.corp.qunar.com/) 来创建项目字体，每个字体项目生成的字体文件的font-name就是对应的项目名。
3. 字体icon的编码是这么转化来的：

   ![dev-icon](images/dev-icon.png)

**图片示例**

```
<Image style={{height: 800, width: 600}} source={{uri: require('QImageSet').img1}} />
```


Coding之后，可以进入测试发布环节了。

[下一步：Testing with QRN Now](index-测试部署.html)
