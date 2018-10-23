# markdown-it 插件

在 ydoc.js 配置文件增加 markdownIt 配置项，查看当前项目的配置文件即可看到我们已经配置了 [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub) 配置项：

``` js
module.exports = {
  markdownIt: function(md){
    md.use(require('markdown-it-sub'));
  }
}
```

安装该插件：

``` bash
npm install markdown-it-sub --save-dev
```

最终效果是一个下标2：H~2~0

## 试一试

- 删除
``` js
md.use(require('markdown-it-sub'));
```

这一行，再次执行 ydoc build, 发现 H~2~0 不再有下标，而是两个波浪线。


- 添加一个 markdown-it 插件：
``` bash
npm install markdown-it-super --save-dev
```
在配置文件中新增这个插件
``` js
md.use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'));
```
再次执行 ydoc build，查看下面的文本中的 ```th``` 变成了上标：

29^th^