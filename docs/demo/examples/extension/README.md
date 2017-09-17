## 扩展示例配置说明

### 效果
在控制台中查看Console有两个js文件的输出。

在控制台中查看Elements有两个css文件的样式。

在控制台中查看Network可以看到自定义的扩展文件。

### 关键配置

`resources` 中配置路径，可以拷贝文件夹到生成文档的目录中.

其中`scripts`与`plugins`字段配置的文件将分别以js/css文件的形式被引入到每个页面的尾部。

* 注意: `3.2.0` 版本后无需配置 `options` 即可使用文件拷贝功能。

```
"resources": { //将配置的文件夹拷贝至生成文档的文件夹下
    "img": "./images", // key值为source
    "styles": "./styles/", // 指定insertCSS后，配置css的目录
    "scripts": "./scripts/" // 指定insertJS后，配置js的目录
},
```
