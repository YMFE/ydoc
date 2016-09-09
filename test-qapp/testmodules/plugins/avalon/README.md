#### 简介

插件名称: `avalon`

插件配置：`Function` 或者 `Map<String, Function>`

* 当配置为 `Function` 时，则是一个 `factory`， 然后以 `View` 的 `root` 为根节点，并在其上自己添加 `ms-controller` ， 并 `scan`。
* 当配置为 `Map` 时，则是多个 `factory` ，相应的`key` 则是其`id`，需要用户自己在模板上添加 `ms-controller`。

注：

* `avalon` 的 `factory` 没有绑定 `context (this)`。
* 插件将 `context (this)` 设置成当前的 `View` 实体。

示例:

    {
        name: 'avalon',
        options: function(vm) {
            //TODO
        }
    }


在 `View` 的 `extra` 配置中配置 `vmcache` 可开启 `vm` 缓存功能。


#### 重写或添加的方法

添加的方法: `getVM(key)`

* Param `key`: `{Undefined|String}` 关键字
* Return `{VModel}`
* 当包含单一的 `vm` 时，用 `getVM()` 获取；如果是包含多个 `vm` 时，用 `getVM(key)`，`key` 为 `vm` 的 `id`。

重写的方法: `mergeParam(newParam)`

* 逻辑和原来一样，增加了更改 `vm` 的逻辑。

重写的方法: `destory()`

* 和原来逻辑一样，增加了序列化保存 `vm` 的逻辑。

#### 其他事宜

重写了 `QApp.addWidget` 方法，对于此方法的说明，详见 `widget.md`。

作用是，将注册到 `QApp` 的组件，同时注册到 `avalon` 组件内。可以使用 `ms-widget=qapp-组件名` 的形式调用，主要解决，`avalon` 的 `vm` 更改，影响到 `Dom` 增添时，会触发组件的逻辑。
