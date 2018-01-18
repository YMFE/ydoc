# 目录结构

一个基本的 ydoc 目录结构如下:

```
├── index.jsx
├── nav.md
├── book-1/
|   ├── index.md
|   └── summary.md
└── book-2/
    ├── index.md
    └── summary.md
```

以下是他们的功能描述:

| 文件 | 描述 |
| -------- | ----------- |
| `index.jsx` | 首页 ( [文档](home.md)) (**必需**) |
| `nav.md` | 导航 (See [Nav](nav.md)) (**必需**) |
| `book/index.md` | 文档首页 (**必需**) |
| `book/summary.md` | 文档目录，summary.md 引用的所有 markdown 文件将会被转换成 html 文件， (查看 [内容和目录](pages.md)) (__可选__) |


### 静态文件和图片

所有在 docs 目录下的静态文件，将会被复制到 build 目录，这也就是说可以在文档执行引用这些静态文件的相对路径。

