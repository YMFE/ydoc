# 首页使用 markdown

默认主题的首页使用的是 jsx 文件，这个文件可以替换成 markdown/html 文件。

## 用法

删除 ```examples/homepage/docs/``` 目录下的 ```index.jsx``` 文件，然后在这个目录下新建 ```index.md``` 文件，随意写一些内容。

然后执行：

```
ydoc build
```

即可看到首页已经换成了 markdown 文件中编写的内容啦，**html 文件也是同理**