# 目录结构

一个基本的 ydoc 目录结构如下:

```
├── docs/
    ├── index.jsx
    ├── NAV.md
    ├── book-1/
        ├── index.md
        └── SUMMARY.md
    └── book-2/
        ├── index.md
        ├── SUMMARY.md
```

以下是他们的功能描述:

| 文件 | 描述 |
| -------- | ----------- |
| `index.jsx` | [首页](pages-index.md) (**必需**) |
| `NAV.md` | [导航](nav.md)) (**必需**) |
| `book/index.md` | [文档页首页](pages-book.md#页面)] (**必需**) |
| `book/SUMMARY.md` | [文档目录](pages-book.md#目录)，SUMMARY.md 引用的所有 markdown 文件将会被转换成 html 文件 (__可选__) |

> 注：`NAV.md` 和 `SUMMARY.md` 文件名大写

### 静态文件和图片

所有在 docs 目录中且未在 SUMMARY.md 中引用的文件，将会被复制到生成站点的目录中。