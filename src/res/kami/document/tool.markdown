Kami组件构建工具
================

当前构建工具版本为0.2.7，如果工具版本小于0.2.7请移步旧版本工具说明[老版本](http://ued.qunar.com/mobile/kami/tool/build/)

版本查看 如下，当前kami工具版本为0.2.7

    $ fekit

    ===================== FEKIT 0.2.133 ====================

     completion       # TAB 自动补全
     config           # 显示 fekit 的配置项
     export           # 文件首行添加 '/* [export] */' 或 '/* [export no_version] */'
                将被自动添加 fekit.config 'export' 列表中
     init             # 初始化目录为标准[fekit项目]
     install          # 安装 fekit 组件
     login            # 登录至源服务器
     logout           # 登出
     min              # 压缩/混淆项目文件
     pack             # 合并项目文件
     plugin           # 安装或删除插件
     publish          # 发布当前项目为组件包
     server           # 创建本地服务器, 可以基于其进行本地开发
     sync             # 同步/上传当前目录至远程服务器(依赖rsync)
     test             # 进行单元测试
     uninstall        # 删除指定的包
     unpublish        # 取消发布特定的组件包
     upgrade          # 更新自身及更新已安装扩展
     kami( 0.2.7 )  # Kami 构建工具

### 安装构建工具


    $ [sudo] npm install fekit-extension-kami



### 初始化组件


    $ fekit kami init [组件名]


其中 `组件名` 是可选。如果不加 `组件名` ，则在当前目录下初始化组件目录及文件。否则，在当前目录下，会创建一个新的名为 `组件名` 的目录，在它下面初始化目录及文件。

*初始化的结构如下：*


    {widget}
    ├── HISTORY.md
    ├── README.md
    ├── build.sh
    ├── index.js
    ├── kami.config
    ├── test
    └── src
        ├── {widget}.js
        └── tpl
            ├── {widget}.string



### 安装组件


+ 执行下面命令，安装单个组件


```$ fekit kami install [组件名]
```

+ 安装线上所有组件，忽略根目录下的kami.config

```
$ fekit kami install --all
```

+ 安装指定组件

```
$ fekit kami install [组件名/组件名@版本号] [--save]
```

### 显示安装组件


    $ fekit kami list [--remote]

[--remote] 参数显示线上目前支持的组件

加入 `--remove` 参数，直接显示线上所有组件。

### 移除组件


    $ fekit kami remove 组件名/组件名@版本号 [--save]


加入 `--save` 参数，移除组件的同时，也从kami.config的依赖项中移除（只针对组件，删除包含版本号的组件不起作用）

### 更新组件

```
$ fekit kami update 组件名/组件名@版本号
```

只更新入口文件。如果组件不存在，返回更新失败。

### kami.config配置文件示例


    {
        "scripts": {
            "alert": "0.0.4"
        }
    }

