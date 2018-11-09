# 模板与变量

YDoc 主题的模板是若干的 jsx 组件，以下是各模板文件相对应的功能（按首字母排序）：

|模板          | 功能 |
|-----------|------ |
|`Content.jsx`        | 文档页内容 |
|`Footer.jsx` (用户自定义组件)      | Footer 信息  |
|`Head.jsx`      | html 文件中 <head /> 部分的内容 |
|`Header.jsx`      | 顶部导航 |
|`Homepage.jsx` (用户自定义组件)      | 文档站首页 |
|`Hook.jsx`      | 钩子，用于自定义插件 |
|`Icon.jsx`      | favicon 图片 |
|`Layout.jsx`      | html 文件，其他组件的入口 |
|`Logo.jsx`      | 配置网站的 logo |
|`Scripts.jsx`      | script 脚本 |
|`Summary.jsx`      | 侧栏目录 |

有的模板中使用了 YDoc 提供的 ```变量``` ，这些变量可以在当前模板文件中任意位置使用，因此你可以灵活定制自己的主题，变量列表如下：

## 变量

### Content.jsx（文档页内容）

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |
|`props.type`        | 内容类型, markdown 页面为 'md' |
|`props.content`        | 页面内容，一段 html |
|`props.prev`        | 上一页信息 |
|`props.prev.distPath`   | 上一页的相对路径 |
|`props.prev.title`        | 上一页的页面标题 |
|`props.next`        | 下一页信息 |
|`props.next.distPath`   | 下一页的相对路径 |
|`props.next.title`        | 下一页的页面标题 |

### Head.jsx（html 文件中 <head /> 部分的内容）

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |
|`props.title`        | 当前页面标题 |
|`props.config.author`        | 网站作者 |
|`props.config.keywords`        | 网站关键字 |
|`props.config.description`        | 网站描述 |
|`props.assets.css`   | 钩子中的 css 路径 |

### Header.jsx（顶部导航）

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |
|`props.title`        | 当前页面标题 |
|`props.config.author`        | 网站作者 |
|`props.config.keywords`        | 网站关键字 |
|`props.config.description`        | 网站描述 |
|`props.assets.css`   | 钩子中的 css 路径 |
|`props.ydoc`   | 顶级 props |
|`props.ydoc.bookpath`   | book 路径 |


### Icon.jsx

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |

### Layout.jsx

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |
|`props.summary`        | 侧栏目录配置 |
|`props.config`        | 配置信息（ydoc 配置） |
|`props.assets`   | 钩子中的 assets 配置 |
|`props.title`        | 当前页面标题 |
|`props.page`        | 页面信息 |

### Logo.jsx

|变量          | 描述 |
|-----------|------ |
|`props.distPath`        | 当前页面路径 |
|`props.nav`        | 顶部导航信息（配置在 NAV.md 中） |
|`props.nav.logo`        | logo |
|`props.nav.title`        | logo 旁的标题 |

### Scripts.jsx

|变量          | 描述 |
|-----------|------ |
|`props.page.distPath` | 当前页面路径 |

### Summary.jsx

|变量          | 描述 |
|-----------|------ |
|`props.summary` | 侧栏目录 |
|`props.releativePath` | 目录项的相对路径 |