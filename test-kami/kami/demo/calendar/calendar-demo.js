var Calendar = require('../../scripts/calendar/index.js');

var $kami = require('../../scripts/util/index.js');
// var now = new Date();
// now.setFullYear(1995);
// now.setMonth(0);
// now.setDate(1);

// var end = new Date();
// end.setFullYear(2035);
// end.setMonth(11);
// end.setDate(31);
document.addEventListener('DOMContentLoaded', function () {



$kami('#fromDefault').on('tap', function() {
    window.calendar && window.calendar.destroy && window.calendar.destroy();
    var template = '' +
        '<div class="testClass yo-select">\
            {{#each list as section}}\
            <div class="{{itemClass}} yo-select-item" data-role="item">\
                {{#if section.tag}}\
                <span class="{{tagClass}} yo-select-item-tag">{{section.tag}}</span>\
                {{/if}}\
                <div class="mask" data-role="mask"></div>\
            </div>\
            {{/each}}\
        </div>';
var listTemplate = '' +
    '<div class="customClass yo-select-item-list" data-role="list-wrap"> \
        <ul class="{{listClass}}" data-role="list">\
            {{#each list as item}}\
            <li class="{{itemClass}}" value="{{item.value}}" data-role="list-item">{{item.text}}</li>\
            {{/each}}\
        </ul>\
    </div>';
    var itemTemplate = '';

    var start = new Date().getTime();
    var str = '';
    var infinite = false;
    var cl = new Calendar({
        container: '#canlendarWrap',
        // template: template,
        infinite: infinite,
        itemTemplate: listTemplate,
        now: '2015-03-03',
        dateRange: [Date.parse('2015-03-02'), Date.parse('2015-04-25')]
    });

    var end = new Date().getTime();
    var str = (end - start) + 'ms';


    cl.render();

    end = new Date().getTime();
    str += '<br/>' + (end - start) + 'ms';

    
    document.querySelector('#error').innerHTML = str + 'infinite=' + infinite;


    window.calendar = cl;
    
    // setTimeout(function () {
    //     console.log('更改时间了');
    //     cl.setNow('2015-04-19');    
        
    // }, 2000);
       
});
    
});

// window.setTimeout(function(){
//         window.location.reload();
//     }, 5000);