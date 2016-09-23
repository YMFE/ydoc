## React Web开发秘籍

React Web最大程度公用Native的业务代码，以下是需要注意的技术点：

#### - 定制React web专属代码

##### + 通过命名规则
getData.js

    /**
     * @providesModule getData
     * @description Native专属
     */
    // Native会打包getData.js

getData.web.js

    /**
     * @providesModule getData
     * @description Web专属
     */
    // Web会打包getData.web.js

##### + 通过逻辑判断定制
    
    var os = require('react-native').Platform.OS
    if(os === 'web') {
        // 打个酱油
    }

#### - 补齐自定组件和接口
+ 依赖native模块的自定义组件、接口，需要业务提供Web版实现
+ 不依赖native模块的自定义组件、接口，在确保兼容性情况下可以共用

#### - 补齐sendScheme

在React Native里通过sendScheme跳转、新开应用，scheme指定的url在浏览器上默认会唤起native应用，如果想阻止这个默认行为，你需要配置跳转规则函数[NativeModules UrlMapping](./api-NativeModules.NativeAPI.html)

#### - 在hy内的运用

与hy webView的通信还是必须通过[QunarAPI](http://hy.qunar.com/docs/qunarapi-api.html)来进行

    QunarAPI.hy.onReiveData({
        ...
    })

#### - 通过fekit mock数据

开发阶段，通过mock请求数据，解决浏览器内不能跨域fetch数据

    {
        "/api/xx": xxxx
    }
