# 配置
Ydoc 允许你使用灵活的配置来自定义站点，这些配置项被指定到 ydoc.json 或 ydoc.js 文件，目录结构如下：

```
├── ydoc.json
├── docs/

```

在 docs 上级目录创建 ydoc.json，如果没有配置文件，ydoc 将使用默认的配置。


## 配置项

| 变量 | 类型 | 默认值 | 描述 |
| -------- | ---  |-----|  ----------- |
| `root` | String | ./docs | 文档目录，默认是 docs |
| `title` | String | ydoc | 网站标题 |
| `description` | String| ydoc | 网站描述 |
| `plugins` | Array | [] | 插件列表，如加载 demo 插件
| `pluginsConfig` | Object | null | 插件配置


### plugins 配置示例

```json
{
  "plugins": ["demo"],
  "pluginsConfig": {
    "demo": {
      "title": "demo"
    }
  }
}
```
上面的配置含义是加载了插件 demo, 并且给 demo 插件设置了配置项:

```json
{ 
  "title" : "demo"
}
```
