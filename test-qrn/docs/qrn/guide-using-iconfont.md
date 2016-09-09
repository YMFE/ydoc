# 使用 iconfont

通过[项目创建](index-项目创建.html)流程创建项目后，会在项目中生成`QFontSet.js`和`QImageSet.js`两个文件，用于管理 iconfont 和静态图片资源。

如果项目中没有这两个文件，可以在[这里](http://gitlab.corp.qunar.com/react_native/js_template/tree/release)找到模板文件。

由命令行生成的项目，应该会在 index.js 中包含如下注释：

``` js
/**
 * @includesModules QFontSet, QImageSet
 */
```

## 确定 hybridId

由于字体的加载流程与 hybridId 相关，因此务必在使用 iconfont 前申请好 hybridId ，并使用此 hybridId 继续。

申请好之后，修改项目的`index.yaml`文件，替换其`hybridid`字段。

## 生成 iconfont

前往 [iconfont 平台](http://iconfont.corp.qunar.com/)，选择要使用的 icon 。完成后，可以在网站右上的“待选图标”中看到已经选择的 icon 。

选择“保存为项目”，会提示输入项目名称。**此处的项目名称必须为项目的 hybridId 或 hybridId_xxxxxx。** 比如，当前项目的 hybridId 为`myHybridId`，则字体的项目名称必须是 `myHybridId` 或 `myHybridId_xxxxxx`。

生成项目之后，可以下载 iconfont 字体文件。对于客户端来说，只需要 ttf 格式的字体即可。

## 上传 iconfont

QRN 对于 iconfont 使用 http url 的形式加载。因此需要将字体上传至外网可访问的位置，推荐使用 [Source](http://wiki.corp.qunar.com/display/corpux/Source) 。

在项目发布时，已注册的字体会由发布系统打包进应用，不会直接连接线上下载。

## 向项目添加 iconfont

以 hybridId 为 myHybridId 为例，在项目的`QFontSet.js`中，按照如下形式加入字体：

``` js
module.exports = {
  // "字体的项目名称" : "字体的线上 URL"
  // 可以添加多项
  // 推荐在字体存放的时候，加上一层字体的版本目录，这样方便做版本控制，想要升级的时候，把这里的目录改成1.1.0就行了，不用改动别的地方。
  "myHybridId": "http://s.qunarzz.com/.../1.0.0/myHybridId.ttf",
  // 如果一个项目（即一个hybridId）对应多个字体文件，可以通过加后缀的方式进行区分。
  "myHybridId_font" : "http://s.qunarzz.com/.../1.0.0/myHybridId_font.ttf"
}
```

## 使用 iconfont

直接在`<Text>`标签中引用字体的名称作为`fontFamily`即可：

``` html
<Text style={{fontFamily: "myHybridId"}}>&#xf00b;</Text>
<Text style={{fontFamily: "myHybridId_font"}}>&#xf00b;</Text>
```

icon 的书写形式有两种：

- 一种如上面的例子，使用 html 实体来写，如`&#x1234;`。这种写法只能写在 JSX 中。
- 一种使用 js 的书写方式，如`'\u1234'`。这种写法只能写在 js 代码中。
