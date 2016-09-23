#### 简介

插件名称: `artTemplate`

#### 重写或添加的方法

添加的方法 `renderData(key, data, container, appendType)`

* Param `key`: `{String}` 关键字
* Param `data`: `{Object}` 渲染数据
* Param `container`: `{String}` node的选择器
* Param `appendType`: `{String}` 插入位置设置，值为`beforebegin`(插入目标节点前)、`afterbegin`(插入到目标节点的第一个子节点前)、`inner`(替换目标内子元素)、`beforeend`(插入到目标节点的最后子节点之后)、`afterend`(插入到目标节点之后)

#### 示例

    QApp.defineView('name' {
        html: '<p>{{name}}</p>',
        plugins: [{
            name: 'artTemplate',
            options: {
                global: {
                    data: {'name': 'david'}
                }
            }
        }]
    });

    // 动态渲染
    QApp.defineView('pageA.pageA-1', {
        html: html,
        plugins: [{
            name: 'artTemplate',
            options: {
                key: {
                    template : tpl,
                    container : '[node-type=hoganContainer]',
                    appendType : 'inner'
                }
            }
        }],
        init: {
            myFunc: function() {
                this.renderData('key', { // render data
                    data: data
                });
            }
        }
    });
