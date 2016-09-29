* 功能描述：拍照或从手机相册中选图接口
* 对应native接口：`chooseImage`

<table style="text-align:center">
    <tr>
        <th>运行环境</th>
        <th>环境配置</th>
        <th>支持版本</th>
    </tr>
    <tr>
        <td>HY(iOS)</td>
        <td>HYView</td>
        <td>大客户端 vid: 80011092+<br/>独立客户端 HytiveLib: 1.1.0+</td>
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
QunarAPI.chooseImage({
    // wechat only
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    
    //Android only
    localIds:["1.jpg","2.jpg"], //表示之前已经选择过的图片。
                                //在相册选择时，'localIds' 表示的图片会被置为已经勾选的状态。
                                //返回值中会包含 'localIds' 中的所有图片。
                                //不传入该参数时，则会清空native对已选图片的记录，导致本次调用之前所选择的图片无法被显示和上传
                                //从15年10月新架构发布以后由于iOS公共相册组件存在bug，iOS暂时不支持使用
    
    // common
    count: 1, //允许用户选择图片的最大数，默认为9
    // 缩略图参数支持iOS独立客户端1.3.0＋ 和Android browser 29+
    thumbnail: {// 缩略图的参数(可选,如不填则不返回缩略图列表)，下列参数可以2选一，也可同时设置
        maxPixel : 720, // 图片的长、宽最大像素尺寸。
                        // 也可以使用'original'、'high'、'middle'、'low'按预设品质压缩
                        // 分别对应为原图、1200、800、400
        quality: 80     // JPG压缩参数，不改变图片尺寸。为1-100之间的整数。
                        // 也可以使用'original'、'high'、'middle'、'low'按预设品质压缩
                        // 分别对应为100、90、70、50
    },
    success: function (res) {
        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        var localIds = res.localIds;
        image.localIds = localIds;        
        alert( JSON.stringify(localIds) )

        // 返回选定照片缩略图的本地ID列表，thumbnail可以作为img标签的src属性显示图片
        var thumbnails = res.thumbnails;
        image.thumbnails = thumbnails;
    },
    fail: function(res){
        alert( JSON.stringify(res) )
    }
});
```


#### 请求参数说明

<table style="text-align:center">
    <tr>
        <th colspan="2">参数</th>
        <th>类型</th>
        <th>说明</th>
        <th>iOS</th>
        <th>Android</th>
        <th>touch</th>
        <th>wechat</th>
    </tr>
    <tr>
        <td colspan="2">sizeType</td>
        <td>string array</td>
        <td>指定原图还是压缩图，默认二者都有</td>
        <td rowspan="2">X</td>
        <td rowspan="2">X</td>
        <td rowspan="2">X</td>
        <td rowspan="2">√</td>
    </tr>
    <tr>
        <td colspan="2">sourceType</td>
        <td>string array</td>
        <td>指定来源是相册还是相机，默认二者都有</td>
    </tr>
    <tr>
        <td colspan="2">localIds</td>
        <td>string array</td>
        <td>上次已经选择过的图片<br/>从15年10月iOS新架构发布以后<br/>由于iOS公共相册组件存在bug，iOS暂时不支持使用</td>
        <td>X</td>
        <td>√</td>
        <td>X</td>
        <td>√</td>
    </tr>


    <tr>
        <td colspan="2">count</td>
        <td>number</td>
        <td>允许用户选择图片的最大数，默认为9</td>
        <td>大客户端 vid: 80011102+<br/>独立客户端 HytiveLib: 1.1.1+</td>
        <td>大客户端browser vid: 27+</td>
        <td>X</td>
        <td>√</td>
    </tr>  
    <tr>
        <td rowspan="2">thumbnail</td>
        <td>maxPixel</td>
        <td>number<br/>或者<br/>string</td>
        <td>缩略图长宽最大尺寸，<br/>可以使用'original'、'high'、'middle'、'low'<br/>按预设品质压缩<br/>分别对应为原图、1200、800、400</td>
        <td>新大客户端、独立客户端 HytiveLib: 1.3.0+</td>
        <td>大客户端browser vid: 29+</td>
        <td>X</td>
        <td>X</td>
    </tr>     
    <tr>
        <td>quality</td>
        <td>number<br/>或者<br/>string</td>
        <td>缩略图JPG压缩参数，尺寸不变。<br/>为1-100之间的整数。<br/>也可以使用'original'、'high'、'middle'、'low'<br/>按预设品质压缩<br/>分别对应为100、90、70、50</td>
        <td>独立客户端 HytiveLib: 1.3.0+</td>
        <td>大客户端browser vid: 29+</td>
        <td>X</td>
        <td>X</td>
    </tr>     
</table>


#### 返回字段说明
<table style="text-align:center">
    <tr>
        <th width="120">返回字段</th>
        <th width="80">类型</th>
        <th width="220">说明</th>
        <th width="80">iOS</th>
        <th width="80">Android</th>
        <th width="80">touch</th>
        <th width="80">wechat</th>
    </tr>
    <tr>
        <td>localIds</td>
        <td>string array</td>
        <td>返回选定照片的本地ID列表<br/>localId可为img标签的src属性</td>
        <td>√</td>
        <td>√</td>
        <td>X</td>
        <td>√</td>
    </tr>
    <tr>
        <td>thumbnails</td>
        <td>string array</td>
        <td>只有请求中设置了thumbnail参数才会返回<br/>返回选定照片的本地缩略图ID列表<br/>thumbnail可为img标签的src属性</td>
        <td>新大客户端、独立客户端 HytiveLib: 1.3.0+</td>
        <td>大客户端browser vid: 29+</td>
        <td>X</td>
        <td>X</td>
    </tr>
</table>


