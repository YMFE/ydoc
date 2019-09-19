# 标准插件

请访问 [ydoc 官网 - 插件](https://hellosean1025.github.io/ydoc/plugin/index.html) 浏览插件。

## 试一试

现在我们来安装 [edit-page 插件](https://www.npmjs.com/package/ydoc-plugin-edit-page)

首先 install 这个模块：

```bash
npm install --save-dev ydoc-plugin-demo
```

在 ydoc.json 中配置该插件：
``` json
{
  "plugins": ["edit-page"],
  "pluginsConfig": {
    "edit-page": {
      prefix: "https://github.com/YMFE/ydoc/tree/master/docs"
    }
  }
}
```

## 插件配置
上面配置的 ```"edit-page"``` 插件使用了自定义配置, 对于该插件的配置，可以在 ydoc.json 中的 ```"pluginsConfig"``` 字段添加如下配置：

```json
{
  "pluginsConfig": {
    "edit-page": {
      prefix: "https://github.com/YMFE/ydoc/tree/master/docs"
    }
  }
}
```

这时使用 ```ydoc serve``` 命令启动本地服务，即可在浏览器中的页面底部看到 "编辑此页面" 的链接 (ydoc build 命令由于生成的是静态地址，因此不会生成此链接)