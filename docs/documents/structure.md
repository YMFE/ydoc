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
| `index.jsx` | 首页 ( [查看 [pages.md](pages.md#home)) (**必需**) |
| `nav.md` | 导航 (查看 [nav.md](nav.md)) (**必需**) |
| `book/index.md` | 文档首页([查看 [pages.md](pages.md#page)]) (**必需**) |
| `book/summary.md` | 文档目录，summary.md 引用的所有 markdown 文件将会被转换成 html 文件， (查看 [pages.md](pages.md)) (__可选__) |


### 静态文件和图片

所有在 docs 目录下且不在 summary.md 引用的的静态文件，将会被复制到 build 目录。

