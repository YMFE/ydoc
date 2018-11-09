# 钩子

## 钩子列表

#### 全局钩子

| 名称 | 描述 |
| ---- | ----------- |
| `init` | 在生成文档站点前触发. | 无 |
| `nav`    | 在解析导航 nav.md 后和解析文档前触发 | 无 |
| `book:before` | 加载 book 页面之前调用 |
| `page:before` | 加载 page 文件之前调用 | Page Object |
| `page` | 加载 page 文件之后调用 | Page Object |
| `book` | 加载 book 页面之后调用 | Book Object |
| `finish` | 在生成文档站点完成后触发. | 无 |

#### 模板钩子

| 名称 | 描述 | 参数 |
| ---- | ----------- | --------- |
| `tpl:header` | 在页面 header 中添加自定义的 html | 无 |
| `tpl:mask` | 用于添加遮罩层 | 无 |

#### Page Object

```js
{
  // 页面类型，支持 md jsx html 三种
  type: 'md',
  // 页面标题
  title: 'string',
  // 页面描述信息
  description: 'string',
  // 页面内容
  content: '内容',
  prev: '上一页连接',
  next: '下一页链接',
  releativePath: '相对路径',
  srcPath: '源文件路径',
  distPath: '生成文件路径'
}

```

##### 增加页面内容示例

使用 `page:before` 钩子

```js
{
	"page:before": function(page) {
		page.content = page.content + "\n Hello YDoc";
		return page;
	}
}
```

##### 替换 html 示例

使用 `page` 钩子

```js
{
	"page": function(page) {
		page.content = page.content.replace("<b>", "<strong>")
			.replace("</b>", "</strong>");
		return page;
	}
}
```

#### 引用静态文件

使用 `assets` 钩子

```js
{
	assets: {
		dir: './assets',
		js: ['app.js'],
		css: ['app.css']
  }
}
```
复制当前目录下的 assets 文件夹到文档，并且在每个文件引入 app.js 和 app.css。




### 异步操作

回调参数返回一个 promise,能够支持异步处理。

Example:

```js
{
	"init": function() {
		return new Promise((function(resolve) {
			setTimeout(function() {
				resolve(true);
			}, 2000);
		}))
	}
}
```
