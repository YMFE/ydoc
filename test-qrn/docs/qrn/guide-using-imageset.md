# 使用 ImageSet

通过[项目创建](index-项目创建.html)流程创建项目后，会在项目中生成`QFontSet.js`和`QImageSet.js`两个文件，用于管理 iconfont 和静态图片资源。

如果项目中没有这两个文件，可以在[这里](http://gitlab.corp.qunar.com/react_native/js_template/tree/release)找到模板文件。

由命令行生成的项目，应该会在 index.js 中包含如下注释：

``` js
/**
 * @includesModules QFontSet, QImageSet
 */
```

## 上传图片

QRN 对于 ImageSet 使用 http url 的形式加载。因此需要将图片上传至外网可访问的位置，推荐使用 [Source](http://wiki.corp.qunar.com/display/corpux/Source) 。

在项目发布时，QImageSet 中的所有图片会由发布系统打包进应用，不会直接连接线上下载。

## 向 ImageSet 添加图片

打开项目的`QImageSet.js`，按照如下形式加入字体：

``` js
module.exports = {
  // "图片名称" : "图片的线上 URL" 
  // 可以添加多项
  // 暂不支持@2x等后缀
  "icon1" : "http://s.qunarzz.com/qrn_demo/test_hybridId_icon1.png"
}
```

## 使用 ImageSet 中的图片

直接在`<Image>`标签中通过source引用图片：

``` js
let Images = require('QImageSet');

<Image style={{width: 40, height: 40}} source={{uri: Images.icon1}} />
```

