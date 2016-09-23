## 创建 QRN 项目

### 检查环境

- 开发 React Native 需要 NodeJS 和 NPM 管理工具。NodeJS 的版本必须大于4.0，NPM 的版本必须高于3.0.0，NPM 过低的情况下，可以运行`npm install npm -g`来升级。
- 配置 `qnpm` 命令，在qnpm源上有很多私有的工具包。如何配置 `qnpm` 请参考[这里](http://npm.corp.qunar.com/)。
- 检查 `git` 命令并配置ssh免密登陆。
- 需要连接到内网（连接VPN或者插网线）。

### 第一步，安装必须的npm包

打开terminal，运行

``` sh
qnpm install @qnpm/react-native-cli -g
qnpm install @qnpm/http-log-watch -g
```

安装完成后检查一下

``` sh
react-native -v
log-watch
```

terminal内显示如下即表示安装成功：

![qnpm-install](images/qnpm-install.png)

### 第二步，初始化项目模板

打开terminal，运行

``` sh
react-native init AwesomeProject --skip-android --skip-ios
```

这一步时间比较长，需要从内网下载较多的资源。完成后看到如下输出：

![run-rn-init](images/run-rn-init.png)

### 第三步，启动react-native服务

在AwesomeProject文件夹内启动react-native的packager服务

``` sh
npm start
```

打开Chrome，访问[这个页面](http://localhost:8081/index.bundle?platform=ios&bundleType=biz)，如果页面内显示了JavaScript代码，即表示启动服务成功。

然后你就可以开始愉快的码代码了。

[下一步：Coding with QRN Now](index-项目开发.html)
