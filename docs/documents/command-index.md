# 命令
通过 ydoc --help 命令查看全部命令

```
    Usage: ydoc [command]

    命令：
    ydoc build  Generate the document site
    ydoc init   Initialize a document site
    ydoc serve  Starts a local server. By default, this is at
                http://127.0.0.1:9999
    ydoc theme  Install a theme

    选项：
    --version   显示版本号                             [布尔]
    -h, --help  显示帮助信息                           [布尔]
```

## init 初始化

`ydoc init` 执行初始化操作，这将会在当前目录生成一个 'docs' 目录，用于存放文档(markdown)文件。

## build 构建

`ydoc build` 执行构建操作，这将会使用 'docs' 目录中的文件进行文档站的构建，构建成功后会在当前目录生成一个 '_site' 目录，打开 '_site' 目录中的 index.html 文件即可访问构建的文档站首页 🎉🎉

## serve 服务

`ydoc serve` 可以启动一个服务，默认是http://127.0.0.1:9999。修改docs目录下的文档，可以实时在http://127.0.0.1:9999看到变化。

## theme 主题

`ydoc theme`可以安装theme主题，例如 `ydoc theme ydoc-theme-demo`可以安装demo theme主题

`ydoc theme ydoc-theme-demo -c `或者 `ydoc theme ydoc-theme-demo --copy`会默认安装一个主题，并且在项目根目录下会生成一个theme文件夹，文件夹中有一个ydoc-theme-demo的文件，ydoc-theme-demo文件中是主题的内容，修改该文件即可定制主题