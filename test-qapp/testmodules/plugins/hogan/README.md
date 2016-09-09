#### 简介

插件名称: `hogan`

插件配置：`{Object|Function}`

* 当为 `Function` 时，执行结果为配置，并且方法 `context` 为此视图 `View` 示例。
* 配置有两个属性, `data` 为模板数据，`options` 为 `hogan` 配置。

#### 重写或添加的方法

添加的方法 `renderData(key, data, hoganOpt, container, appendType)`

* Param `key`: `{String}` 关键字
* Param `data`: `{Object}` 渲染数据
* Param `hoganOpt`: `{Object}` 参数对象
* Param `container`: `{String}` node的选择器
* Param `appendType`: `{String}` 插入位置设置，值为`beforebegin`(插入目标节点前)、`afterbegin`(插入到目标节点的第一个子节点前)、`inner`(替换目标内子元素)、`beforeend`(插入到目标节点的最后子节点之后)、`afterend`(插入到目标节点之后)

#### 示例

    QApp.defineView('name' {
        html: '<p>{{name}}</p>',
        plugins: [{
            name: 'hogan',
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
        plugins: ['hogan'],
        hoganOptions: {
            // 模板配置
            key: {
                template : tpl,
                container : '[node-type=hoganContainer]',
                appendType : 'inner'
            }
        },
        init: {
            myFunc: function() {
                this.renderData('key', {
                    data: data // hogan data
                });
            }
        }
    });
