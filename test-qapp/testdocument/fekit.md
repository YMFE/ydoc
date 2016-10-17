### For FEKit

#### QApp

安装： `fekit install QApp`

使用： `require('QApp')`

#### 插件和适配模块

安装： `fekit install QApp-Hy` 或 `fekit install QApp-plugin-ajax`

使用： `require('QApp-Hy')` 或 `require('QApp-plugin-ajax')`

#### 提供新的引入方式

在 QApp 1.0.0 将所有插件合并到一个工程，方便版本的统一管理。

在 1.0.0 之后的 `QApp` 包中，会包含所有插件和适配模块。

可以通过以下方式使用:

`fekit.config`:

```
{
    "alias": {
        "QApp": "fekit_modules/QApp"
    }
}
```

`*.js`:

```
require('QApp/ajax');
```
