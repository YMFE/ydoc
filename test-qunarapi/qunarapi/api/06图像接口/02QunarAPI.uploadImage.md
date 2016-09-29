* 功能描述：上传图片接口 **（不建议使用，推荐使用[QunarAPI.uploadImage_v1](#图像接口-QunarAPI-uploadImage_v1)）**
* 对应native接口：`uploadImage`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid >= 80011092<br/>独立客户端 HytiveLib 1.1.0</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 20+</td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>不支持</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>支持</td>
    </tr>
</table>


```js
QunarAPI.uploadImage({
    localId: image.localIds[0], // 需要上传的单张图片的本地ID，由chooseImage接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示（未确认iOS及Android的支持情况）
    // 上传照片后，服务器端返回的json串格式如下：
    //  {
    //      ret : true or false,
    //      data : 任何值
    //  }
    // iOS根据ret判断是否调用success回调函数，仅当ret为true时调用success函数，否则调用fail函数
    // Android根据http请求的response状态码判断回调函数，状态码为200时调用success，否则调用fail
    // success函数的res.serverId参数为json串中的data值（iOS返回的是json类型，Android返回的是string类型）
    success: function (res) {
        var serverId = res.serverId; // 返回图片的服务器端ID
        alert( JSON.stringify(res) )
    },
    fail: function (res) {
        alert( JSON.stringify(res) )
    },

    //以下4个参数hy独有
    serverAddress: "http://upload.user.qunar.com/userVerifyInfo/upload?token=123456",  
    //服务地址必须是在qunar域下，支持https(仅CA证书),必填项！。随URL添加的参数直接拼好放在这里，需要通过post的参数见下
    serverParams: {    // post到服务器的参数map（可选）
        paramA: "123",
        paramB: "456"
    },
    fileKey: "file", // 服务器端图片文件所对应的参数名（可选，默认值为“file”）
    quality: "original" // 图像品质，说明如下
    // 可以使用预设值： original - 原图， high, middle, low - 按预设品质压缩
    // 也可以使用非上述值的自定义参数
    // 自定义参数时，采用等号键值对按逗号分隔: "maxSize=500K,maxWidth=800"
    // 可用key: maxSize, maxWidth, maxHeight, jpgLevel
    // 表示maxSize时可用K和M（不区分大小写）作为单位, jpgLevel为1-100之间的整数
    // 该项为空或空串时，相当于不添加任何自定义参数，即为无任何压缩限制，等同于original预设
});
```