# 钩子

## 钩子列表

#### 全局钩子

| 名称 | 描述 | 参数 |
| ---- | ----------- | --------- |
| `init` | 在生成文档站点前触发. | 无 |
| `finish` | 在生成文档站点完成后触发. | 无 |

#### 页面钩子

| 名称 | 描述 | 参数 |
| ---- | ----------- | --------- |
| `page:before` | 在创建 html 页面之前调用 | Page Object |
| `page` | 生成 html 页面后调用 | Page Object |

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
  releativePath: '相对路径'
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


### 异步操作

回调参数返回一个 promise,能够支持异步处理。

Example:

```js
{
    "init": function() {
        return new Promise((function(resolve){
          setTimeout(function(){
            resolve(true)
          }, 2000)
        }))
    }
}
```
