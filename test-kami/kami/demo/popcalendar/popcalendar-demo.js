


var PopCalendar = require('../../scripts/popcalendar/index.js');
var $kami = require('../../scripts/util/index.js');


var str = require('./tpl.string');
document.addEventListener('DOMContentLoaded', function () {

    $kami('#showDefault').on('tap', function () {
        // debugger
        if (window.popCalendar && window.popCalendar._isInit) {
            window.popCalendar.show();
            
        }
        else {
            window.popCalendar = new PopCalendar({
            // element: '<div class="yo-popselect"></div>',
            
            
                title: '<span style="color:red">选择测试数据</span>',
                template: str,
                effect: true,
                duration: 1,
                onok: function (close) {
                    console.log('ok and curvalue=');
                    console.debug(this.getNow().toString());
                    // close();
                    this.hide();
                    // this.destroy();
                },
                resizable: true,
                oncancel: function (close) {
                    console.log('close and curvalue=');
                    console.debug(this.getNow().toString());
                    this.hide();

                },
                dateRange: ['2014-03-02', '2015-04-20'],
                now: '2014-04-05'
            });
            window.popCalendar.render();
        }
        
        setTimeout(function () {
            console.log('设置时间');
            popCalendar.setNow('2015-04-19');
        }, 5000);
    });
    
});


