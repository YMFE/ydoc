/*
* @providesModule ActionSheet
*/

var React = require('react');
var AppRegistry = require('AppRegistry');
var {utils} = AppRegistry;
var Popover = require('UPopover');
var ActionSheet = Popover.ActionSheet;
var Alert = require('Alert');
var QShare = require('QShare');


/*
   {
       options: BUTTONS,
       cancelButtonIndex: CANCEL_INDEX, // 取消按钮
       destructiveButtonIndex: DESTRUCTIVE_INDEX, // 删除按钮
       tintColor: 'green',
   },
   (buttonIndex) => {}
*/


/**
 * ActionSheet 组件
 *
 * @component ActionSheet
 * @example ./ActionSheet.js
 * @version >=0.20.0
 * @description  选择器组件。
 *
 * ![ActionSheet](./images/component/ActionSheet.gif)
 */



/**
 * @method ActionSheet.showActionSheetWithOptions(options:object, callback:function)
 * @description 显示一个 ActionSheet 弹出框，其中 options 对象需要包含下面的一项或多项：
 * - `options:strings[]` - 一组按钮的标题
 * - `cancelButtonIndex:int`- 在 options 中取消按钮的标题的位置
 * - `destructiveButtonIndex:int` - 在 options 中删除按钮的标题的位置
 * - `title:string` - 弹出框的标题
 * - `message:string` - 标题下显示的信息
 *
 * callback 会在选择了某项后调用，调用时传入选项的索引作为参数。
 */

ActionSheet.showActionSheetWithOptions = function (options, callback) {
    var gid = utils.gid();
    utils.render(
        <ActionSheet
            tintColor="#007AFF"
            {...(options || {}) }
            style={{}}
            visible={true}
            callback={callback}
            onClose={function (event, cb) {
                utils.hideContainer(gid);
            } }
        />, gid);
};
/*
   {
       url: url,
       message: 'message to go with the shared url',
       subject: 'a subject to go in the email heading',
       excludedActivityTypes: [ // 不支持
           'com.apple.UIKit.activity.PostToTwitter'
       ]
   },
   (error) => alert(error),
   (success, method) => {
       var text;
       if (success) {
           text = `Shared via ${method}`;
       } else {
           text = 'You didn\'t share';
       }
       this.setState({text});
   }
*/

/**
* @method ActionSheet.showActionSheetWithOptions(options:object, callback:function)
* @description 在引用了`qunar-react-native`时部分支持（依赖于QShare），仅仅引用`react-native`情况下不支持
*/
ActionSheet.showShareActionSheetWithOptions = function (options, failureCallback, successCallback) {
    if (QShare) {
        let newOption = {
            com: {
                title: options.subject,
                link: options.url,
                desc: options.message
            }
        };
        QShare.doShare(newOption, successCallback, failureCallback);
    } else {
        Alert.alert('暂时不支持');
    }
};

module.exports = ActionSheet;
