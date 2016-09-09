#### 简介

插件名称: `delegated`

插件配置：`{Object}`

默认配置如下:

```
{
    "tag": "action-type",
    "eventType": "tap"
}
```

配置参数：

* `tag`: `{String}` 监听DOM中具有`action-type`属性的节点。
* `eventType`: `{String}` 事件类型，默认为`tap`事件。

#### 重写或添加的方法

添加的方法: `bind(action, eventType, process)`

* Param `action`: `{String}` 监听关键字
* Param `eventType`: `{String|Function}` 事件类型或处理函数
* Param `process`: `{Function}` 处理函数
* Return `{Undefined}`

#### 示例

```
QApp.defineView('name' {
    html: '<p action-type="abc" data-arg="xyz">Some</p><p action-type="def" data-arg="xyz">Any</p>',
    plugins: [{
        name: 'delegated',
        options: {
            tag: 'action-type',
            eventType: 'tap'
        }
    }],
    ready: function() {
        this.bind('abc', function(e, data) {
            // data.arg === 'xyz'
        });
    },
    bindActions: {
        'def' : function(e, data) {
            // data.arg === 'xyz'
        }
    }
});
```
