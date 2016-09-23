/*
 * 修正 flexbox的相关样子，让浏览器能使用不同flexbox规范运行我们的代码
 */
var cssName = require('./cssName')

/**
*http://www.tuicool.com/articles/Afq6Bzq
获取当前浏览器是使用哪一年的flexbox规范
*/
 var testStyle = document.createElement('div').style
 var flexboxSpec = '2009'
 if ('alignSelf' in testStyle) {
     flexboxSpec = '2012'
 } else if ('webkitAlignSelf' in testStyle) {
     flexboxSpec = '2011'
 }
 // FIXME: UCBrowser is cheat
 if (/UCBrowser/i.test(navigator.userAgent)) {
     flexboxSpec = '2009'
 }

 // prefix 2009 spec
 var oldNames = {
     flex: 'WebkitBoxFlex',
     order: 'WebkitBoxOrdinalGroup',
     // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/flex-direction.coffee
     flexDirection: 'WebkitBoxOrient',
     // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/align-items.coffee
     alignItems: 'WebkitBoxAlign',
     // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/justify-content.coffee
     justifyContent: 'WebkitBoxPack',
     flexWrap: null,
     alignSelf: null
 }

  var oldValues = {
     'flex-end': 'end',
     'flex-start': 'start',
     'space-between': 'justify',
     'space-around': 'justify',  //oldValue中没有严格和space-around对应的属性，近似为justify，聊胜于无    

 }


 function fixFlexBox(name, value, result) {
      //如果用户没有使用display:flex来定义容器，那么我们需要在页面创建一个style标签
      //并注册一个类名，加入6种flex样式规则来激活它
    if(!/flex/.test(result.display)){
       result.useFlexbox = true
    }
    if (flexboxSpec === '2009') {
         var oldValue = oldValues[value] || value
         var oldName = oldNames[name] || name
         if (oldName === 'WebkitBoxOrient') {
             // boxOrient
             oldValue = value.indexOf('row') !== -1 ? 'horizontal' : 'vertical'
             // boxDirection
             var dir = value.indexOf('reverse') !== -1 ? 'reverse' : 'normal'

             result.WebkitBoxDirection = dir
         }
         return result[oldName] = oldValue
     } else if (flexboxSpec === '2011') {
         name = cssName(name) || name
         return result[name] = value
     } else {
         return result[name] = value
     }
 }

 module.exports = {
   names: oldNames,
   handle: fixFlexBox
 }
