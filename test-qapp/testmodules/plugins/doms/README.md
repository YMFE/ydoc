#### 简介

插件名称: `doms`

配置参数：

* `tag`: `{String}` 查找DOM中具有相同属性的节点，并建立以值建立映射。默认为 `node-type`。

说明：

通过 view.doms 访问属性为 tag 的节点。

#### 重写或添加的方法

添加的方法: `find(type)`

* Param `type`: `{String}` node-type属性值

在 view 的 ready 事件阶段后，可以通过view.find方法快速访问 node 节点。

#### 示例

```
QApp.defineView('name' {
    html: '<p node-type="abc">Some</p>',
    plugins: [{
        name: 'doms',
        options: {
            tag: 'node-type'
        }
    }],
    init: {
        pHandler: function(event) {
            // this.doms.abc === <p/>
        }
    },
    ready: function() {
        var p = view.find('abc'), // p === <p />
            self = this;
        p.addEventListener('tap', self.pHandler, false)
    }
});
```
