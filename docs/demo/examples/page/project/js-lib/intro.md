## js-lib 介绍

js-lib示例展示了从js文件的注释中提取信息生成的文档。

- example 代码，文件路径[起始位置-结束位置] 或者直接写 源代码，从文件中读取代码需要在配置文件中配置 `"examplePath"` 作为 `@example` 文件的路径。
- 欲显示下面的 “源码位置”，请在配置文件中配置 `"source": true`
- 代码折叠功能，请在配置文件中配置 `"foldcode": true`，可全局配置代码折叠，默认6行，如果自定义折叠行数，请在注释块中配置 `@foldnumber {Number}` Number为自定义折叠行数。
