# 插件
YDoc 强大的插件功能，满足你个性化的需求。

## 浏览插件
请访问 [ydoc 官网 - 插件](https://ydoc.ymfe.org/plugin/index.html) 浏览插件。

## 安装插件

假设要安装的插件名是 demo，执行如下命令：

```bash
npm install --save-dev ydoc-plugin-demo
```

安装完成后，请在 ydoc.json 配置项，添加：
```json
{
  "plugins": ["demo"]
}

```

## 插件配置
部分插件需要做自定义配置, 假设 demo 插件需要添加 {id: 1} 的配置，只需要在 ydoc.json ，添加如下配置项：

```json
{
  "pluginsConfig": {
    "demo": {
      "id": 1
    }
  }
}

```

## 创建插件
YDoc 插件是发布到 npm 的 node 包，本篇教程假定你已经拥有了 npm 和 node 相关的经验。
