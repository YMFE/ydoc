require('QApp');
require('QApp-plugin-delegated');
require('QApp-plugin-kami-adapter');

// Config
window.Kami = window.Kami || {};
window.Kami.disableTapEvent = true;
window.Kami.theme = 'yo';

// tap冲突，关闭QApp手势
QApp.gesture.off();
// tap冲突，关闭QApp手势
QApp.config({
    gesture: {
        // open: false, // 下个版本提供
        ctrl: false 
    }
});


Kami.Panel = require('kami/panel');
Kami.PageList = require('kami/pagelist');
Kami.Alert = require('kami/alert');
Kami.SliderMenu = require('kami/slidermenu');
