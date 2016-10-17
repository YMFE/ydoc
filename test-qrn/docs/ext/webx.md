# WebX - Ext Plugin

增强 web 式开发体验的插件。

## 样式增强

注意，通过 WebX 的方式写样式无需调用 `StyleSheet.create()` 方法。

### 样式名的定义

#### 支持 class 属性

```js
// jsx
<View class="item item-gap" />

// styles
styles = {
    item: {},
    'item-gap': {},
};
```

#### 支持组件名定义样式

```js
// jsx
<View />

// styles
styles = {
    View: {},
}
```

### 支持 `vh` 和 `vw` 单位

```js
// jsx
<Text class="test" />

// styles
styles = {
    test: {
        fontSize: '3vh',
        width: '50vw',
    }
};
```

### 支持 `:active`

#### 自身 `:active`

```js
// jsx
<Text class="test" />

// styles
styles = {
    test: {
        ':active': {}
    }
};
```

#### 其他组件 `:active`

通过获取其他组件的 `:active` 改变自己样式。

```js
// jsx
<View class="outer">
    <Text class="inner" />
</View>

// styles
styles = {
    inner: {
        'outer:active': {
            color: 'red',
        }
    }
};
```

上例中，`outer` 激活时，`inner` 字体颜色变为红色。

注意：当前组件和其他组件直接没有层级约束（不是父子元素也行）。

### 支持媒体查询（宽高）

只支持宽高的媒体查询。

#### 外部媒体查询

```js
// jsx
<Text class="test" />

// styles
styles = {
    '@media (min-width: 400)': {
        test: {}
    },
};
```

#### 内部媒体查询

```js
// jsx
<Text class="test" />

// styles
styles = {
    test: {
        '@media (min-height: 500)': {
            color: 'red'
        },
        '@media (max-height:900) and (min-height: 500)': {
            color: 'blue'
        },
    },
};
```

## 方法增强

### 支持 view 的 onPress 属性

```js
// jsx
<View onPress={this.testPressView} />

// js
testPressView() {
    alert('You pressed a View.');
}
```

### 组件方法自动 `.bind(this)`

`on` 开头的方法，无需手动 `.bind(this)`。

```js
// jsx
<TouchableHighlight onPress={this.testAutoBind} />

// js
testAutoBind() {
    console.log('testAutoBind', this);
}
```
