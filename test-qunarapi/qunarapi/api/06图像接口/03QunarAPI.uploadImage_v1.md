* 功能描述：上传图片接口
* 对应native接口：`uploadImage.v1`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>新大客户端vid >= 80011108</td>
    </tr>
    <tr>
        <td>HY(Android)</td>
        <td>HY.browser</td>
        <td>大客户端browser vid: 35+</td>
    </tr>
    <tr>
        <td>touch</td>
        <td>浏览器</td>
        <td>不支持</td>
    </tr>
    <tr>
        <td>wechat</td>
        <td>微信客户端</td>
        <td>马上会支持！</td>
    </tr>
</table>


```js
QunarAPI.uploadImage_v1({
    localId: image.localIds[0], // 需要上传的单张图片的本地ID，由chooseImage接口获得
    // 根据上传http请求的response状态码判断回调函数，状态码为200时调用success，否则调用fail
    // success函数的res.responseData参数为服务器返回的数据
    success: function (res) {
        var serverMessage = res.responseData; // 图片服务器返回的数据内容，string类型
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

    maxPixel : 720, //图片的长、宽最大像素尺寸。
                    //也可以使用'original'、'high'、'middle'、'low'按预设品质压缩
                    //分别对应为原图、1200、800、400
    quality: 80     // JPG压缩参数，不改变图片尺寸。为1-100之间的整数。
                    //也可以使用'original'、'high'、'middle'、'low'按预设品质压缩
                    //分别对应为100、90、70、50
});
```



#### 请求参数说明

<table style="text-align:center">
    <tr>
        <th width="120">参数</th>
        <th width="80">类型</th>
        <th width="220">说明</th>
        <th width="80">iOS</th>
        <th width="80">Android</th>
        <th width="80">touch</th>
        <th width="80">wechat</th>
    </tr>
    <tr>
        <td>localId</td>
        <td>string array</td>
        <td>需要上传的图片的本地ID，由chooseImage接口获得</td>
        <td rowspan="6">√</td>
        <td rowspan="6">√</td>
        <td rowspan="6">X</td>
        <td rowspan="6">X</td>
    </tr>
    <tr>
        <td>serverAddress</td>
        <td>string</td>
        <td>上传服务地址。必须是在qunar域下。</td>

    </tr>
    <tr>
        <td>serverParams</td>
        <td>map</td>
        <td>post到服务器的参数map（可选）</td>
    </tr>
    <tr>
        <td>fileKey</td>
        <td>string</td>
        <td>服务器端接口中文件对应的参数名<br/>（可选，默认值为"file"）</td>
    </tr>    

    <tr>
        <td>maxPixel</td>
        <td>number<br/>或者<br/>string</td>
        <td>上传图片长宽最大尺寸，<br/>可以使用'original'、'high'、'middle'、'low'<br/>按预设品质压缩<br/>分别对应为原图、1200、800、400</td>
    </tr>     
    <tr>
        <td>quality</td>
        <td>number<br/>或者<br/>string</td>
        <td>上传图片JPG压缩参数，尺寸不变。<br/>为1-100之间的整数。<br/>也可以使用'original'、'high'、'middle'、'low'<br/>按预设品质压缩<br/>分别对应为100、90、70、50</td>
    </tr> 
</table>


#### 返回字段说明
<table style="text-align:center">
    <tr>
        <th>返回字段</th>
        <th>类型</th>
        <th>说明</th>
        <th>iOS</th>
        <th>Android</th>
        <th>touch</th>
        <th>wechat</th>
    </tr>
    <tr>
        <td>responseData</td>
        <td>string</td>
        <td>服务器返回的数据</td>
        <td>√</td>
        <td>√</td>
        <td>X</td>
        <td>?</td>
    </tr>
</table>
