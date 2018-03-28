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
| `index.jsx` | 网站首页 ( [查看 [pages.md](pages.md#home)) (**必需**) |
| `NAV.md` | 网站导航 (查看 [nav.md](nav.md)) (**必需**) |
| `book/index.md` | book首页([查看 [pages.md](pages.md#page)]) (**必需**) |
| `book/SUMMARY.md` | book目录，SUMMARY.md 引用的所有 markdown 文件将会被转换成 html 文件， (查看 [pages.md](pages.md)) (__可选__) |

> 注：`NAV.md` 和 `SUMMARY.md` 文件名大写

### 静态文件和图片

所有在 docs 目录下且不在 SUMMARY.md 引用的的静态文件，将会被复制到 build 目录。

