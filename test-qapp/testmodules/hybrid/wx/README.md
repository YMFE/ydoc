#### 简介

**QApp** 对 **Wechat** 的适配器，只要简单配置，即可让 **Touch** 页正常运行在 **Wechat** 环境里。

*注意：`Hy` 里已经包含对 `Wechat` 的适配哦*

#### 配置

```js
QApp.wx.config({
    indexView: 'index',
    viewOptions: {
        a: {
            nav: {
                title: {
                    text: 'A'
                }
            }
        }
    }
}
```

配置形式和 `Hy` 类似。
