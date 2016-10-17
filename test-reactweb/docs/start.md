## 起步

### 既有React Native项目转touch

##### 1.修改package.json，执行"qnpm install"
+ react-native版本“^internal-v1.4.0”
+ @qnpm/react-native-ext-fetch版本“^0.0.5”

```javascript
{
  "name": "bnbrn",
  ...
  "dependencies": {
    "@qnpm/react-native-ext-fetch": "^0.0.5",
    "react-native": "git+ssh://git@gitlab.corp.qunar.com:react_native/qunar_react_native.git#internal-v1.4.0",
    "react-native-swiper": "^1.4.3"
  }
}

```

##### 2.手动初始化项目

执行
```shell
    files="build-web.sh fekit.config index.html index.jsp mock.js";
    for file in $files;do
        cp -f node_modules/react-native/local-cli/generator-web/templates/$file .
    done
```

##### 3.同【新项目】后续第2步

### 新项目

##### 1.创建Qunar React Native项目

执行命令：
```sh
    react-native init webtest -t 需要执行tag或者branch; cd webtest
```

具体参见<a href="http://ued.qunar.com/Qunar React Native/index-%E9%A1%B9%E7%9B%AE%E5%88%9B%E5%BB%BA.html" target="_blank">创建 Qunar React Native 项目</a>

根目录下会创建以下文件：

+ index.html【开发预览】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <script src="prd/platform.js"></script>
        <script src="prd/biz.js"></script>
        <!--Hy已经内置了QunarAPI-->
        <!--登陆js api，如果使用QLogin功能必须引入-->
        <script type="text/javascript" src="http://common.qunarzz.com/ucapi/prd/scripts/index.js?ver=1.0.2"></script>
    </body>
</html>

```

+ index.jsp【后端发布】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>bnb</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <script src="platform@<!-- include("/ver/scripts/platform.js.ver") -->.js"></script>
        <script src="biz@<!-- include("/ver/scripts/biz.js.ver") -->.js"></script>
        <!--Hy已经内置了QunarAPI-->
        <!--登陆js api，如果使用QLogin功能必须引入-->
        <script type="text/javascript" src="http://common.qunarzz.com/ucapi/prd/scripts/index.js?ver=1.0.2"></script>
    </body>
</html>
```

+ fekit.config

```javascript
{

}
```

+ mock.js

```javascript
module.exports = {
    "/prd/platform.js": "http://127.0.0.1:8081/index.bundle?platform=web&bundleType=platform",
    "/prd/biz.js": "http://127.0.0.1:8081/index.bundle?platform=web&bundleType=biz",
    "/index.map": "http://127.0.0.1:8081/index.map",
    "/qrcode": "http://127.0.0.1:8081/qrcode",
    ...
}
```

+ 用于发布离线包的index.yaml

```yaml
hybridid : testhbd
version : 1
iOS_vid : vid_80011092 # 所在iOS平台的版本
android_vid : vid_60001091,com.mqunar.atom.browser_11 # 所在Android平台的版本
domain : # 域名替换
  www.baidu.com : 59.151.11.20
remote :
  - +http://bnb.qunar.com/touch/index.html
  - http://source.qunar.com/waimai-app/unlogin.png
  - http://simg1.qunarzz.com/fonts/bnbhybrid/1.0.1/Qunar.woff
  - http://simg1.qunarzz.com/fonts/bnbhybrid/1.0.1/Qunar.ttf
```


+ 构建脚本build-web.sh【可以新增逻辑，不要修改既有逻辑】

```bash
 ...
```


##### 2.启动服务

执行
```sh
    npm start
    fekit server [-p port] -m mock.js # 用fekit是为了使用fekit的mock功能 - -||，发布的时候并不需要fekit
```

##### 3.打开浏览器

打开chrome，开启模拟器，输入 http://localhost:port/index.html 或者 http://127.0.0.1:port/index.html

也可以打开 http://localhost:port/qrcode ，手机扫描二维码预览

