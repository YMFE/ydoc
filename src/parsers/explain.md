#### 名称类注释
* `@component`: 组件名
* `@module`: 模块名（分类）
* `@method`: 方法名
* `@property`: 属性名
* `@event`: 方法名

#### 标识类注释
* `@static`: 标识静态属性/方法
* `@version`: 版本

#### 参数说明类注释
* `@param`: 参数，格式为：{类型} [名称] 描述 `（若名称以方括号包裹, 则这个参数不是必选参数）`
##### 表述参数的版本
 * 从 1.0.0 开始支持： `<1.0.0>`
 * 在 1.0.0 添加，2.0.0版本删除： `<1.0.0,2.0.0>`

#### 示例代码
* `@example`: example 代码，文件路径[起始位置-结束位置] 或者直接写 源代码
* `@examplelanguage`: 配置example的高亮语法
* `@foldnumber`: 代码块折叠的行数，需要在配置文件中配置 "foldcode": true，默认6行

#### 描述类注释
* `@demo`: demo 地址
* `@alias`: 缩略
* `@description` 描述、说明
* `@returns`: 返回值

#### 其他
* `@category`: 分类
* `@instructions`: 介绍说明，格式： {instruInfo: ./xxx.md}{instruUrl: xxx.html} `前者是介绍文字，后者页面右侧会出现手机模块展示xxx.html文件`
* `@skip`: 跳过此注释块
