# 创建一个插件
YDoc 插件是发布到 npm 的 node 包，本篇教程假定你已经拥有了 npm 和 node 相关的经验。

## 目录结构

一个基本的插件有如下的文件结构：

```
├── ydoc-plugin-demo/
    ├── index.js
    ├── package.json
```

## index.js

index.js 是插件的入口文件，init、finish、page:before、page 是插件绑定的钩子。每个插件都可以绑定不同的钩子实现各种各样的功能。

```js
module.exports ={
  init: function(){
    console.log('init')
  },
  finish: function(){    
    console.log('end...')
  },
  'page:before': function(page){
    console.log('beforePage', page)
  },
  page: function(page){
    console.log('page', page)
  }
}

```