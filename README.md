关于 qdoc：

1. 新版 qdoc 基本上是把原来的 qdoc 推到重来的。不基于 fekit，提供单独的命令，以后会提供 gulp 和 grunt 插件。 使用的命令是 qdoc build --watch
2. 地址是 git@gitlab.corp.qunar.com:mfe/qdoc.git，分支是 new，可以 sudo npm install git+ssh://git@gitlab.corp.qunar.com:mfe/qdoc.git#new -g 或者 克隆下来 sudo npm install ./ -g
3. 今天更新了，将 markdown -> marked，所以支持了 table 等扩展语法。还有其他优化。
4. 关于文档，节后会逐步整合 sass，整合后会统一优化下 样式，然后 抽时间写文档写文档写文档！！！！文档我是要写的！！要写的！！要写的！！只不过还没写[（我先去搞更紧急的事，节后一定写）
5. js 方面支持 组件 和 lib 俩种形式，组件形式可以参考 qrn 的注释，lib 的可以参考 qapp v1.0.0 分支的注释

有问题请提 issue
