### v3.1.0
* 首页改版，优化功能介绍
* 添加首页正文的配置功能
* 添加若干套[构建示例](https://github.com/YMFE/ydoc-demo)
* 修复 @example 注释重复解析和无法高亮的bug

### v3.0.0
* 添加自定义主题、配置主题功能
* 添加多版本文档切换功能 配置项为mutiversion
* 添加homepage配置首页
* 添加注释规则: js component 支持@event(事件)
* 添加homepage配置首页
* 添加staticsidenav配置侧边目录不滚动
* 为页面中的标题添加hashlink
* JSComponent注释参数类型支持string
* markdown支持task list
* 注释@example与markdown代码高亮
* 侧栏动画优化
* 一些其他优化

### v2.2.1
* 无侧栏时收起侧栏按钮
* 修复部分板块无法滚动的bug

### v2.2.0
* 添加移动端侧边目录
* 添加foldsidenav侧边目录的展开/收起功能
* 注释规则: @foldnumber 配置代码折叠的行号
* 添加index配置子page路径名
* 特殊字符处理
* 布局优化

### v2.1.1
* 添加hasPageName开关 默认关闭

### v2.1.0
* 添加可配置CSS、JS功能
* 添加component支持多个iframe查看demo功能

### v2.0.1
* 压缩js css代码
* Component如果是function 去掉@param是否必选
* 添加common默认配置 title footer home homeUrl
* 修复而example是一段html时，行内样式过多，导致显示格式不对
* 修复删除版本号不能正确显示

### v2.0.0
* 改版
* 支持code格式化
* 支持折叠代码块支持折叠参数
* @property 支持 example
* 一些细节优化

### v1.1.0

* 支持 注释中 示例代码 的格式

### v1.0.4

* 支持 resources 配置，复制相应资源

### v1.0.3

* add @version 版本信息
* add 全面支持 @skip 忽略注释块
* fixed 侧边栏滚动样式问题
* fixed watch 时，更新 ydoc 配置不生效的问题
* 如果用户构建项目全部文档，则先删除旧文件


### v1.0.2

* 更新 package.json 配置

### v1.0.1

* 修复分页 Markdown 情况下，目录配置的样式

### v1.0.0

* 正式版
