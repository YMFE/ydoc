## Qunar React Native 基础API

`qunar-react-native` 在 `react-native` 的基础上，新增了许多基础API。


### 使用

想要使用 `qunar-react-native` 提供的组件或API，方法如下：

```js
import { DeviceInfo, LoginManager } from 'qunar-react-native';

//App vid
let vid = DeviceInfo.vid;

LoginManager.getLoginInfo((userData) => {
    //已经登陆
    Alert.alert(JSON.stringify(userData));
}, (error) => {
    //未登陆
    Alert.alert(error.message);
});


```


### API

你可以通过右侧的导航来查看具体相关文档。
