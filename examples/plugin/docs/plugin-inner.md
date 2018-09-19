# 内置插件

YDoc 内置了如下插件：

### ydoc-plugin-import-asset
在页面中引入 js 与 css 文件

### ydoc-plugin-search
为 YDoc 提供搜索功能

## 删除内置插件
在配置文件中配置 plugins 字段，在内置插件名称前面添加 ```'-'``` 即可删除该内置插件：

```
module.exports = {
  plugins: ["-search", "-import-asset"]
}
```
在本页已经卸载了这两个插件

### 试一试：

○ 将本项目配置文件中 plugin 数组中的 "-search" 删掉，再次构建，页面右上角将会显示搜索模块。

<p id="import-asset">○ 将本项目配置文件中 plugin 数组中的 "-import-asset" 删掉，再次构建，则内置插件 'import-asset' 引入的 css 文件生效，本行文字将变为红色。</p>


