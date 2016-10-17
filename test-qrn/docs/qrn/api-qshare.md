## QShare  大客户端的分享API 

> API兼容性：   
> QRN:v1.2.0   
> iOS:80011120   
> Android:60001139   

`QShare` 大客户端的分享API，用来呼出分享的dialog，可以设置分享dialog中显示的分享类型

## 引入
```js
import { QShare } from 'qunar-react-native';
```

## 数据结构
分享的参数`QShareParam`结构如下：
```js
QShareParam = {
    //分享内容设置
    com: {
        title: '去哪儿网',
        desc: '聪明你的旅行',
        link: 'http://app.qunar.com/',
        imgUrl: 'http://source.qunarzz.com/common/hf/logo.png'
    },

    //单独设置分享内容，可选，下面为单独设置的朋友圈分享内容
    [QShare.wechatTimeline]: {
        title: '朋友圈',
        link: 'http://www.qunar.com/',
        imgUrl: 'http://img1.qunarzz.com/p/p78/1601/74/93df1e3741e903f7.jpg'
    },
    
    //设置需要分享的渠道，可选，没有这个属性的话是默认显示全部可用的分享渠道
    types: [
        QShare.email,
        QShare.wechatTimeline,
        QShare.sinaWeibo,
    ]
}

```
默认支持的分享类型有：
```js
  QShare.wechatTimeline,   //朋友圈
  QShare.wechatFriends:,   //微信好友
  QShare.sinaWeibo,        //新浪微博
  QShare.tencentWeibo,     //腾讯微博
  QShare.sms,              //短信
  QShare.mail,             //邮件
  QShare.qunarFriend,      //去哪儿好友
  QShare.wechatFav,        //微信收藏，仅Android支持
  QShare.QQZone,           //QQ空间，仅Android支持
  QShare.QQFriend,         //QQ好友，仅Android支持
  QShare.QQFav,            //QQ收藏，仅Android支持
```
## API

<blockquote class="api">
<strong>QShare.doShare</strong>
<span>( shareParam:QShareParam, callBack: function, errCallBack: function)</span>
</blockquote>
根据 QShareParam 呼出分享的dialog，用户分享成功走callBack回调，回调的数据中包含了用户分享的类型，分享失败走errCallBack
**注意：在有些情况下可能 callBack 和 errCallBack 均不会调用！**

## 示例
```js
import { QShare } from 'qunar-react-native';

<Text
onPress = {
        () => {
            QShare.doShare({
                com: {
                    title: '去哪儿网',
                    desc: '聪明你的旅行',
                    link: 'http://app.qunar.com/',
                    imgUrl: 'http://source.qunarzz.com/common/hf/logo.png'
                },
                //单独设置朋友圈分享内容
                [QShare.wechatTimeline]: {
                    title: '朋友圈',
                    link: 'http://www.qunar.com/',
                    imgUrl: 'http://img1.qunarzz.com/p/p78/1601/74/93df1e3741e903f7.jpg'
                },
            }, (data) => {
            	//分享成功 data.sharedType 为成功分享的类型
                data.sharedType 
            }, (err) => {
            	//分享失败
                alert(JSON.stringify(err))
            })
        }
    }>
点击分享 </Text>

```
