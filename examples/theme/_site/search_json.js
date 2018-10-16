window.ydoc_plugin_search_json = {
  "ydoc demo": [
    {
      "title": "主题",
      "content": "YDoc 提供了简单易用强大的自定义主题功能。",
      "url": "/index.html",
      "children": [
        {
          "title": "安装",
          "url": "/index.html#安装",
          "content": "安装1.假设要安装 demo 主题，请执行以下命令：npm install --save-dev ydoc-theme-demo或者ydoc theme ydoc-theme-demo2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "自定义主题",
          "url": "/index.html#自定义主题",
          "content": "自定义主题"
        },
        {
          "title": "新建主题",
          "url": "/index.html#自定义主题-新建主题",
          "content": "新建主题1.在根目录下创建 theme 文件夹，然后创建对应的 theme 文件夹，比如 ydoc-theme-demo, 在文件夹下写对应的主题2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "基于已有主题定制",
          "url": "/index.html#自定义主题-基于已有主题定制",
          "content": "基于已有主题定制1.在项目根目录下执行以下命令：ydoc theme ydoc-theme-demo -c或者ydoc theme ydoc-theme-demo --copy命令执行完成后，项目根目录下会生成一个theme文件夹，文件夹中有一个ydoc-theme-demo的文件，ydoc-theme-demo文件中是主题的内容，修改该文件即可定制主题2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "主题列表",
          "url": "/index.html#主题列表",
          "content": "主题列表ydoc-theme-demo\nydoc-theme-dark\n"
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