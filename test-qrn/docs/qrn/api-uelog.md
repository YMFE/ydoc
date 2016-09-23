## UELog 客户端埋点

> API兼容性：   
> QRN:v1.0.0   
> iOS:80011117   
> Android:60001134   

`UELog`用来做客户端埋点log，使用方法如下:

```js
import {UELog} from 'qunar-react-native';

//同时埋点多条信息，多条信息会使用'*'连接在一起
UELog.log(['firstMessage','secondMessage']);

//埋点单条信息
UELog.logOrigin('textMessage');
```
