# JSX

React发明了JSX， 可以简单地理解它是一种在JS中编写与XML类似的语言。通过JSX来声明组件的属性，类型与结果，并且通过｀{}`插值，套嵌JS逻辑与子级的JSX。

### JSX的特点：

1. 类XML语法容易接受，结构清晰
2. 增强JS语义
3. 抽象程度高，屏蔽DOM操作，跨平台
4. 代码模块化


我们从最简单的一个helloworld开始：
```jsx
<h1>Hello, world!</h1>
```

script标签里面的内容实际会被编译成

```javascript
React.createElement('h1', null, 'Hello, world!');
```

又如
```jsx
var root =(
  <ul className="my-list">
    <li>First Text Content</li>
    <li>Second Text Content</li>
  </ul>
);
```

会被编译成
```javascript
var root = React.createElement('ul', { className: 'my-list' },
  React.createElement('li', null, 'First Text Content'),
  React.createElement('li', null, 'Second Text Content')
);
```

### JSX语法介绍

｀{}`插值是让JSX区别普通HTML的一个重要特性，只有三个地方可以使用它。可以放属性名的地方，属性等于号之后的位置及innerHTML之间。

1.**可以放属性名的地方**,  这里只能使用`JSXSpreadAttribute`(延伸属性)， 换言之，括号内必须带三个点号

```jsx
var props = {};
props.foo = x;
props.bar = y;
var component = <Component {...props} />;
```

2.**属性等于号之后的位置**, JSX的属性值必须用引号括起来，当你将引号改成花括号，它里面就可以使用JSX变量了。相当于其他框架的绑定属性或指令。需要说明一下，HTML的固有属性必须使用JS形式，保持驼峰风格，如class要用className代替，for要用htmlFor代替，tabindex要用tabIndex代替，colspan要用colSpan代替。

```jsx
<div tabIndex={this.props.a} />
```
花括号里面可以使用三元表达式
```jsx
var person = <Person name={ window.isLoggedIn ? window.name : '' } />;
```
会编译成
```javascript
var person = React.createElement(
  Person,
  {name: window.isLoggedIn ? window.name : ''}
);
```


3.**innerHTML**

```jsx
<div>xxx{111}yyy</div>
```

这个会编译成,  `相邻的字任串或数字会合并成一个字符串`，`布尔，null, undefined会被忽略掉`。
```javascript
React.createElement('div', null, "xxx111yyy")
```

在innerHTML里面，我们可以使用数组或数组的map方法生成一个新数组的方法，为当前父元素添加一堆子元素。

```jsx
var ul = (
  <ul className="unstyled">
    {
      this.todoList.todos.map(function (todo) {
        return  (
          <li>
            <input type="checkbox" checked={todo.done}>
            <span className={'done-' + todo.done}>{todo.text}</span>
          </li>
        );
      })
    }
  </ul>
);
```

### JSX中使用样式

在JSX中使用样式和真实的样式也很类似，通过style属性来定义，但和真实DOM不同的是，`属性值不能是字符串而必须为对象｀。
```jsx
<div style={{color: '#f00', fontSize: '14px'}}>Hello World.</div>
```

或者
```jsx
var style = {
  color: '#f00',
  fontSize: '14px'
};

var node = <div style={style}>HelloWorld.</div>;
```

要明确记住,{}里面是JS代码,这里传进去的是标准的JS对象。在JSX中可以使用所有的样式，基本上属性名的转换规范就是将其写成驼峰写法，例如“background-color”变为“backgroundColor”, “font-size”变为“fontSize”，这和标准的JavaScript操作DOM样式的API是一致的。

### HTML转义

在组件内部添加html代码,并将html代码渲染到页面上。React默认会进行HTML的转义，避免XSS攻击，
如果要不转义，可以使用dangerouslySetInnerHTML属性。dangerouslySetInnerHTML要求对应一个对象，里面有一个叫__html的字符串。React故意搞得这么难写，目的让大家少点用它。

```jsx
<div dangerouslySetInnerHTML={{__html: '<strong>content</strong>'}}></div>
```

注意：JSX里面br，input, hr等标签必须自闭合，如`<br>`必须写成`<br />`
     并且使用了dangerouslySetInnerHTML

### 属性的定义

JSX是严格区分固有属性与自定义属性， 固有属性是指元素原形链上就已存在的属性，比如id, title, className, htmlFor, style，colSpan。这些属性是严格区分大小写。并且对属性值也有要求。

固有属性根据其值的类型，可以分为布尔属性与字符串属性。布尔属性一般出现在表单元素与A，script等标签上，如disabled, readOnly, selected, checked等等。布尔属性时，大家在使用时，值必须是布尔
```jsx
<input type='radio' checked={true} />

```


字符串属性也比较常见：
```
value,id,title,alt,htmlFor,longDesc,className
```

 还有一些不规则的属性(不需要刻意记，只要记住上面两种就是)
 ```
 accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan,dateTime,defaultValue,contentEditable,frameBorder,maxLength,marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign
 ```

 而自定义属性，则是用户随便设置的。


### 如何自定义组件
在 YDoc 新建组件是非常简单的，第一步在 docs 目录下新建 _components 目录
假设我们要新建一个 Demo 组件，可以新建 Demo.jsx 文件（确保文件名第一个字母大写），文件内容如下：


一般来说，我们可以通过标签名的第一个字母是大写还是小写来识别组件与普通标签。

```jsx
  <p>
    Hello, <input type="text" placeholder="Your name here" />!
    It is {props.date}
  </p>
```

### 如何引用自定义组件
假设有一个 Demo2 组件，想引用 Demo 组件，可在 Demo2.jsx 文件写入以下示例代码引入：

```jsx
<Demo2 date="2018">

```

### 自定义页面变量
如果使用 js 自定义页面变量，将会非常难用和不优雅，YDoc 参考了开源工具 [gray-matter](https://github.com/jonschlinkert/gray-matter) 在页面注入 YAML 方案。

```html
---
title: Hello
slug: home
---
<h1 >{title}, {slug}</h1>
``` 

### 系统内部组件
系统内置了如下的组件，请尽量避免跟系统组件重名，因为一旦重名，将会覆盖系统的原有组件。

* Content
* Footer
* Head
* Header
* Homepage
* Hook
* Layout
* Logo
* Script
* Summary
