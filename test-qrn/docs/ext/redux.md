# Redux - Ext Plugin

## 内容更新

插件提供了 redux 数据管理的支持，相比之前的老版本提供了一些更新和用法改进。

1. 相比之前版本的一个 view 一个 store，本版本提供单一 store 的数据管理方式，使得页面之前可以进行数据的共享。如果部分页面需要使用独立的 store，本版本还在 router 上进行了适配，可以直接使用 `Ext.open('pageName:new')` 的方式，开启拥有独立 store 的页面。
1. 简化了 store 的配置方式，之前还需要使用 `defineStore` 来处理，现在只需要配置 `Ext.defaults.redux` 属性即可。
1. 与之前 QView 无法使用 `reduxPlugin` 不同，本版本在 QView 和 QComponent 下都可以指定 `mapStateToProps` 和 `mapDispatchToProps`，获取和调度 store 中的数据。即使是拥有独立 store 的 QView 页面也可以进行 `reduxPlugin` 的配置。
1. 需要注意的一点是，使用 `Ext.open` 打开的页面，在对应的 QView 组件上会有名为 `param` 的属性，表示页面参数。正常情况下，QView 内部的 QComponent 组件可以在 [context](https://facebook.github.io/react/docs/context.html) 上获取，但如果本组件拥有 `reduxPlugin`，插件会帮你把 `param` 参数挂载到 `props` 上。

## 基本概念

关于 redux 插件，摒弃了 redux 之前复杂的概念，有三个最基本的概念：

1. **store**：store 是数据存储的地方，整个应用的数据存在在 store 之中，状态树的设计尤为重要。
1. **action**：整个 redux 其实还是可以理解成发布/订阅模式，action 就是这个模式的**发布**方法，用户只能通过 action 来触发数据变化，是改变 store 的唯一手段。在官方版本中，action 是通过 `dispatch` （调度器）来触发的；而在我们的插件中，我们对 `mapDispatchToProps` 方法做了简化，很大程度上隐藏了这一概念。
1. **reducer**：reducer 是 store 的组成部分。如果说 store 是一棵状态树，reducer 就是树枝，众多 reducer 最终通过 `combineReducers` 方法汇成最终的 store。

    ![combined-redux](http://7xinjg.com1.z0.glb.clouddn.com/combined-redux.png)

    reducer 本身承担了模式的**调度**。事实上在 reducer 中我们还需要处理 action 触发后如何修改 store 中状态树的逻辑。

## 使用方式

### 配置方式

提供了配置 redux 的快捷方式，不需要配置原生的 `createStore` 和 `applyMiddleware` 等复杂概念，只需要在 `Ext.defaults.redux` 中配置两个简单的属性即可。

```
// redux 配置项
Ext.defaults.redux = {
    /**
     * 配置 createStore 的三个参数 reducer/initialState/enhancer
     */
    reducer,
    initialState,
    enhancer
    /**
     * 配置 middleware 中间件
     */
    middleware: []
};
```

这些参数里面只有 reducer 是必填的，用于初始创建 store。

版本内置了两个著名的中间件：[redux-thunk](https://github.com/gaearon/redux-thunk) 和 [redux-promise](https://github.com/acdlite/redux-promise)。由于 promise 中间件会**阻断**中间件的执行，因此这两个内置中间件都被放在用户自定义中间件之后执行。

### 对外提供方法

`Ext.Redux` 对外提供的最主要方法是：`combineReducers` 和 `bindActionCreators`。其中最最重要的是前者，在一个项目中必定会使用到。`combineReducers` 是连接 reducer 的手段，将独立的 reducer 拼合成项目的 state 树。`bindActionCreators` 如果不是对 actions creator 有特殊要求，可以通过写简写的方式避免其使用。可参加下文的**组件使用方式**。

### action 编写方式

action 是一个返回固定格式对象的纯函数。其编写示例如下所示：

```
export function switchCategory(categoryId) {
    return {
        type: types.SWITCH_CATEGORY,
        payload: categoryId
    }
}
```

其返回的对象应遵循 flux action [标准规范](https://github.com/acdlite/flux-standard-action)，必须包含 `type` 属性，数据建议存放至 `payload` 属性。其中 `type` 属性建议使用字符常量或 Symbol 来进行定义。

### reducer 编写方式

reducer 是一个返回部分状态的纯函数，支持传入两个参数：`state`、`action`。其中设置 `initialState` 作为初始值传递给 `state`，返回的状态必须是**整个** reducer 包含的 state，建议使用 ES6 的[扩展运算符](http://es6.ruanyifeng.com/#docs/object#对象的扩展运算符)来确保返回 state 的完整性。

```
const initialState = {
    list: [],
    info: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_LIST:
            return {
                // 确保对象的完整性
                ...state,
                list: action.payload.data.shopList
            };
            break;
        case types.FETCH_SHOP_INFO:
            return {
                ...state,
                info: action.payload.data
            };
        default:
            // 无论什么情况下，该函数都要确保返回一个 state
            return state;
    }
}
```

多个 reducer 之间可以通过 `combineReducers` 进行连接：

```
export default combineReducers({
    shopList,
    price,
    shopInfo: combineReducers({ shopDetail, foodInfo })
})
```

### 组件使用方式

redux 插件在 QView 和 QComponent 中的使用方式完全一致。给组件添加一个**静态方法** `reduxPlugin` 即可，里面可以提供四个参数，分别为 `mapStateToProps`、`mapDispatchToProps`、`mergeProps`、`options`，其中业务中最常见的是前两个参数：

1. `mapStateToProps(state, [ownProps])`：如果定义该参数，组件将会监听 store 的变化，发生改变时改变组件中对应的 props 的值。如果没有设置这个参数，组件将**不会**监听 store：即在 store 发生变化时，组件将不会收到任何响应和更新。
2. `mapDispatchToProps(dispatch, [ownProps])`：如果定义该参数，等于给组件的 props 上挂载对应的 [Action Creator](http://cn.redux.js.org/docs/Glossary.html#action-creator)。这只是一个便捷用法，如果不使用，还是可以使用 `dispatch` 来触发 store 更新。

剩下两个参数和其余高级用法可以参见 [react-redux/api](http://cn.redux.js.org/docs/react-redux/api.html)。

```
import { changeFoodCount } from './actions'
const { bindActionCreators } = Ext.Redux;

static reduxPlugin = {
    // mapStateToProps 官方正常使用
    mapStateToProps: (state) => ({
        shopList: state.shopList
        category: state.shopInfo.category
    }),
    // 插件支持的便捷用法，直接传入数组，效果和上面一样
    mapStateToProps: ['shopList', 'shopInfo.category'],

    // mapDispatchToProps 官方正常使用
    mapDispatchToProps: (dispatch) => ({
        changeFoodCount: bindActionCreators(changeFoodCount, dispatch)
    }),
    // 插件支持的便捷用法，直接传入对象，效果和上面一样
    mapDispatchToProps: { changeFoodCount }
};
```


需要注意的是，redux 内部对属性进行**变化检测**的时候，用的是**浅对比**，即上文中，如果仅对原先的 `shopList`和 `category` 对象进行 `===` 比较，不会深入分析内部变化。因此如果进行对象属性改变，务必进行新对象的创建，或直接使用 [immutable](https://github.com/facebook/immutable-js)。
