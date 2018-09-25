# 创建插件
YDoc 插件是发布到 npm 的 node 包，本篇教程假定你已经拥有了 npm 和 node 相关的经验。

## 基本插件

### 目录结构

一个基本的插件有如下的文件结构：

``` 
├── ydoc-plugin-demo/
    ├── index.js
    ├── package.json
```

### index.js

index.js 是插件的入口文件，init、finish、page:before、page 是插件绑定的钩子。每个插件都可以绑定不同的钩子实现各种各样的功能。

```js
module.exports = {
  init: function() {
    console.log('init');
  },
  finish: function() {    
    console.log('end...');
  },
  'page:before': function(page) {
    console.log('beforePage', page);
  },
  page: function(page) {
    console.log('page', page);
  }
}
```

## 私有插件

私有插件的配置直接写在 YDoc 的配置文件中，在 ```plugin``` 字段中新增数组项：

- plugins[n].name 为插件名称，**不允许重名**
- plugins[n].module 和基本插件中的 ```index.js``` 的 ```module.exports``` 内容一致

``` js
module.exports = {
  plugins: [{
    name: "privatePlugin",
    module: {
      init: function() {
        console.log('init privatePlugin successfully!');
      }
    }
  }]
}
```

我们鼓励开发者将插件发布到 npm 社区