## 常见问题

### 提示错误：`Callback with id ... not found`  

检查 Chrome 的调试标签是不是开了不只一个。关掉其他的标签只留下一个就可以了。

### 发布时等待很长时间，最后提示更新服务炸了  

如果是大客户端，检查 `index.yaml` 中的 `android_vid` 字段是不是忘记写模块依赖了。

### 启动打包服务时报错：`Couldn't find preset "qreact"...`  

错误截图如下：

![](http://ww4.sinaimg.cn/large/4c8b519dgw1f3q5gy9vwyj21kw0rf1d1.jpg)

原因是缺少 `@qnpm/babel-preset-qrn` 插件，执行以下命令手动安装：

```
qnpm install babel-preset-qrn --save
```

### 清理缓存的方法  
[传送门](http://gitlab.corp.qunar.com/yayu.wang/rn-cache-cleaner/tree/master)

### 使用 Node.js 6 启动 server 时出现一大堆 native 堆栈

这是一个 warning ，不影响使用。需要等待上游代码更新来消除
