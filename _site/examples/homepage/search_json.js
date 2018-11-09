window.ydoc_plugin_search_json = {
  "ydoc": [
    {
      "title": "首页使用 markdown",
      "content": "默认主题的首页使用的是 jsx 文件，这个文件可以替换成 markdown/html 文件。",
      "url": "/index.html",
      "children": [
        {
          "title": "用法",
          "url": "/index.html#用法",
          "content": "用法删除 examples/homepage/docs/ 目录下的 index.jsx 文件，然后在这个目录下新建 index.md 文件，随意写一些内容。然后执行：ydoc build即可看到首页已经换成了 markdown 文件中编写的内容啦，html 文件也是同理"
        }
      ]
    }
  ],
  "documents": [
    {
      "title": "ydoc",
      "content": "This is home page of documents book.",
      "url": "/documents/index.html",
      "children": []
    },
    {
      "title": "Installation",
      "content": "...",
      "url": "/documents/installation.html",
      "children": []
    },
    {
      "title": "Introduction",
      "content": "Introduction",
      "url": "/documents/intro.html",
      "children": [
        {
          "title": "title",
          "url": "/documents/intro.html#title",
          "content": "titlecontent"
        }
      ]
    },
    {
      "title": "env",
      "content": "env",
      "url": "/documents/env.html",
      "children": [
        {
          "title": "title",
          "url": "/documents/env.html#title",
          "content": "titlecontent"
        },
        {
          "title": "sub-title",
          "url": "/documents/env.html#title-sub-title",
          "content": "sub-titlecontent"
        }
      ]
    }
  ]
}