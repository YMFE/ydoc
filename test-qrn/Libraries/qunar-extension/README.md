## React Native Qunar Extensions

### 安装

此模块是`qnpm`私有模块，需要通过`qnpm`来安装。本机未配置`qnpm`的同学可以参考 http://npm.corp.qunar.com/ ，来配置qnpm。

此模块需要与`react-native`共同使用。

执行以下命令添加此模块到项目中：

```
qnpm install --save @qnpm/react-native-qunar-extension
```

### 使用

参见[文档](docs/)

### 文档工具安装

```
sudo npm install git+ssh://git@gitlab.corp.qunar.com:mfe/qdoc.git#new -g
```

在项目根目录下执行 qdoc build

### 文档规范

```
    ## 组件

    /**
     * 列表
     *
     * @component ListView
     * @example ./Playground/xxx.js[1-10] （路径为相对Examples目录的路径，括号里是代码行数）
     * @version >=0.20.0
     * @todo todo
     * @description 描述 (支持markdown)
     *  * A
     *  * B
     *  * C
     */

    ## 属性

    /**
     * 每页数量
     *
     * @property pageSize
     * @type number
     * @default 10
     * @version >=0.2
     * @description 每次事件循环（每帧）渲染的行数

     */

    /**
     * 列渲染函数
     *
     * @property renderRow
     * @type function
     * @param {Array} rowData 参数描述
     * @param {String} sectionID 参数描述
     * @returns {Number} xxx 返回值描述
     * @description 描述
     * @version 0.1
    */

    ## 方法

    /**
     * 滚动到
     *
     * @method scrollTo
     * @version <=0.2
     * @param {Number} x 位置
     * @param {Number} y 位置
     * @returns {ListView} 组件对象
     * @description 描述
     */
```
