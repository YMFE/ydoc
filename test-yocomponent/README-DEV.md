## 启动

1. 安装 `node` 依赖：`npm install`
2. 安装 `ykit`
    ```
    sudo npm install @qnpm/ykit -g --registry=http://registry.npm.corp.qunar.com/ --cache=$HOME/.npm/.cache/qnpm --userconfig=$HOME/.qnpmrc
    ```
3. 启动 `ykit`：在项目上一级目录执行 `sudo ykit server` （用法与 `fekit` 类似）
4. 访问：http://127.0.0.1/yo/demo/component/index/index.html
5. 启动 `lint`：`ykit lint -d ./component`
6. 生成文档：`ydoc build`

## 目录结构说明

### 1. component

组件代码,以组件分文件夹,每个文件夹下包括两个目录:demo和src。

- src: 组件源代码,应该包括组件js代码和组件scss代码(引用瑶姐yo目录下对应的组件scss即可)

- demo: 开发/测试用demo,以suggest/demo为例:bundle.js为webpack打包以后的代码;demo.html为demo页面,里面应该引用bundle.js;demo.js为测试文件源码,应该作为webpack.config的entry(怎么写下面说)。

需要注意的是我们引用样式的方式不再为传统的link标签,而是直接用import的方式引入,这种方法会直接编译scss代码,并以style标签的形式插入到网页的head标签中。

### 2. style

瑶姐编写的yo代码,保持不动即可。

### 3. doc & \_docs

- doc: Yo现有文档
- \_docs: 添加 component 之后的文档（可以查看组件生成的文档）

### 4. ykit.hy.js 配置

entry属性配置: 创建新组件的时候,应该按上面描述的目录结构创建新目录和文件,然后在entry对象中添加一行(参考suggest的写法),无需做其他改动

### 5. ydoc.config 配置

组件配置: 在配置文件中的component配置项中添加一项

## 补充说明

- 每个组件应该以ES6 class的方式编写

- 每个组件应该包含propTypes,具体如何写可以参考 https://facebook.github.io/react/docs/reusable-components.html 和 http://gitlab.corp.qunar.com/react_native/react-native-code-guide/tree/master
