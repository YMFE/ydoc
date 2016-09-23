/**
 *
 * @providesModule QShare
 */

'use strict'

var QShareManager = require('NativeModules').QShareManager;

const _supportedShareTypes = [
  'wechatTimeline', 'wechatFriends', 'wechatFav',
  'QQZone', 'QQFriend', 'QQFav', 'sinaWeibo',
  'tencentWeibo', 'sms', 'mail', 'qunarFriend'
];

const QShare = {

  wechatTimeline: 'wechatTimeline', //朋友圈
  wechatFriends: 'wechatFriends', //微信好友
  wechatFav: 'wechatFav', //微信收藏
  QQZone: 'QQZone', //QQ空间
  QQFriend: 'QQFriend', //QQ好友
  QQFav: 'QQFav', //QQ收藏
  sinaWeibo: 'sinaWeibo', //新浪微博
  tencentWeibo: 'tencentWeibo', //腾讯微博
  sms: 'sms', //短信
  mail: 'mail', //邮件
  qunarFriend: 'qunarFriend', //去哪儿好友



  doShare(shareInfos: Object, callback = () => {}, failCallback = () => {}) {
    var shareInfoArray = [];
    var shareTypes = _supportedShareTypes;

    if (Array.isArray(shareInfos.types) && shareInfos.types.length) {
      shareInfos.types.map(type => {
        if (_supportedShareTypes.indexOf(type) < 0) {
          throw `shareType ${type} is not supported!`
        }
      })
      shareTypes = shareInfos.types;
    }
    shareTypes.map(type => {
      shareInfoArray = [...shareInfoArray, Object.assign({},shareInfos[type] ? shareInfos[type] : shareInfos.com, {
        type: type
      })];
  })
    QShareManager.doShare(shareInfoArray, callback, failCallback);
  },


};

module.exports = QShare;
