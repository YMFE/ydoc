## 效果
在同一页面中使用多个文件生成本页面。

### 关键配置
`content` 页面内容，使用通配符 `*` 选择多个文件。

`compile` 解析器，解析content中配置的文件。

`options.type` 类型，可选 component 和 lib ，默认 component

`options.categories` 分类，解析后的页面目录将以此为顺序。使用分类功能需要在注释中的

`@category` 标签指定注释块所属的分类名称。

注释：
```
 * @category Base/Router
```
配置文件：
```
"content": "./src/*.js",
"compile": "js",
"options": {
    "type": "lib",
    "categories": ["Router", "Base"] // 分类
}
```
