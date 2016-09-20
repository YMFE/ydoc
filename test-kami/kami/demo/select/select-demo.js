var Select = require('../../scripts/select/index.js');
var $kami = require('../../scripts/util/index.js');

document.addEventListener('DOMContentLoaded', function () {
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
var listTemplate = ''+
    '<div class="customClass yo-select-item-list" data-role="list-wrap"> \
        <ul class="{{listClass}}" data-role="list">\
            {{#each list as item}}\
            <li class="{{itemClass}}" value="{{item.value}}" data-role="list-item">{{item.text}}</li>\
            {{/each}}\
        </ul>\
    </div>';
    
    var multiDs = new Select({
        container: '#multiSelectWrap',
        template: template,
        itemTemplate: listTemplate,
        datasource: [
            {
                key: 'lixuan',
                datasource : [
                    {text: '测试数据0', value: 0},
                    {text: '测试数据1', value: 1},
                    {text: '测试数据2', value: 2},
                    {text: '测试数据3', value: 3},
                    {text: '测试数据4', value: 4},
                    {text: '测试数据5', value: 5},
                    {text: '测试数据6', value: 6},
                    {text: '测试数据7', value: 7},
                    {text: '测试数据8', value: 8},
                    {text: '测试数据9', value: 9}
                ],
                value: 9,
                infinite: true,
                displayCount: 5,
                tag: '单位'
            },
            {
                key: 'day',
                datasource : [
                    // {text: '实验0', value: 0},
                    {text: '实验1', value: 1},
                    {text: '实验2', value: 2}
                    
                ],
                value: 1,
                infinite: false,
                displayCount: 5,
                tag: '单位'
            }
        ]
    });
    multiDs.render();
    multiDs.on('changevalue', function(key, value, pvalue) {
        console.log('on');
        if (key === 'lixuan') {
            if (value.value > 4) {
                this.setValue('day', 0);
            }
            else {
                this.setValue('day', 2);
            }
        }
        console.log('onchangevalue:', key, value.text, pvalue.text);
    });
    window.multiDs= multiDs;
    // console.log(multiDs.getValue());
    // multiDs.destroy();

    // var yearDs = new Select({
    //     element: '#year',
    //     datasource: [
    //         {
    //             key: 'year',

    //             datasource : [
    //                 {
    //                     text: 2000,
    //                     value: 0
    //                 }, {
    //                     text: 2001,
    //                     value: 1
    //                 }, {
    //                     text: 2002,
    //                     value: 2
    //                 }, {
    //                     text: 2003,
    //                     value: 3
    //                 }, {
    //                     text: 2004,
    //                     value: 4
    //                 }, {
    //                     text: 2005,
    //                     value: 5
    //                 }, {
    //                     text: 2006,
    //                     value: 6
    //                 }, {
    //                     text: 2007,
    //                     value: 7
    //                 }, {
    //                     text: 2008,
    //                     value: 8
    //                 }, {
    //                     text: 2009,
    //                     value: 9
    //                 }, {
    //                     text: 2010,
    //                     value: 10
    //                 }, {
    //                     text: 2011,
    //                     value: 11
    //                 }, {
    //                     text: 2012,
    //                     value: 12
    //                 }, {
    //                     text: 2013,
    //                     value: 13
    //                 }, {
    //                     text: 2014,
    //                     value: 14
    //                 }, {
    //                     text: 2015,
    //                     value: 15
    //                 }, {
    //                     text: 2016,
    //                     value: 16
    //                 }, {
    //                     text: 2017,
    //                     value: 17
    //                 }, {
    //                     text: 2018,
    //                     value: 18
    //                 }, {
    //                     text: 2019,
    //                     value: 19
    //                 }, {
    //                     text: 2020,
    //                     value: 20
    //                 }, {
    //                     text: 2021,
    //                     value: 21
    //                 }, {
    //                     text: 2022,
    //                     value: 22
    //                 }, {
    //                     text: 2023,
    //                     value: 23
    //                 }, {
    //                     text: 2024,
    //                     value: 24
    //                 }, {
    //                     text: 2025,
    //                     value: 25
    //                 }, {
    //                     text: 2026,
    //                     value: 26
    //                 }, {
    //                     text: 2027,
    //                     value: 27
    //                 }, {
    //                     text: 2028,
    //                     value: 28
    //                 }, {
    //                     text: 2029,
    //                     value: 29
    //                 }, {
    //                     text: 2030,
    //                     value: 30
    //                 }, {
    //                     text: 2031,
    //                     value: 31
    //                 }, {
    //                     text: 2032,
    //                     value: 32
    //                 }, {
    //                     text: 2033,
    //                     value: 33
    //                 }, {
    //                     text: 2034,
    //                     value: 34
    //                 }, {
    //                     text: 2035,
    //                     value: 35
    //                 }, {
    //                     text: 2036,
    //                     value: 36
    //                 }, {
    //                     text: 2037,
    //                     value: 37
    //                 }, {
    //                     text: 2038,
    //                     value: 38
    //                 }, {
    //                     text: 2039,
    //                     value: 39
    //                 }, {
    //                     text: 2040,
    //                     value: 40
    //                 }, {
    //                     text: 2041,
    //                     value: 41
    //                 }, {
    //                     text: 2042,
    //                     value: 42
    //                 }, {
    //                     text: 2043,
    //                     value: 43
    //                 }, {
    //                     text: 2044,
    //                     value: 44
    //                 }, {
    //                     text: 2045,
    //                     value: 45
    //                 }, {
    //                     text: 2046,
    //                     value: 46
    //                 }, {
    //                     text: 2047,
    //                     value: 47
    //                 }, {
    //                     text: 2048,
    //                     value: 48
    //                 }, {
    //                     text: 2049,
    //                     value: 49
    //                 }, {
    //                     text: 2050,
    //                     value: 50
    //                 }, {
    //                     text: 2051,
    //                     value: 51
    //                 }, {
    //                     text: 2052,
    //                     value: 52
    //                 }, {
    //                     text: 2053,
    //                     value: 53
    //                 }, {
    //                     text: 2054,
    //                     value: 54
    //                 }, {
    //                     text: 2055,
    //                     value: 55
    //                 }, {
    //                     text: 2056,
    //                     value: 56
    //                 }, {
    //                     text: 2057,
    //                     value: 57
    //                 }, {
    //                     text: 2058,
    //                     value: 58
    //                 }, {
    //                     text: 2059,
    //                     value: 59
    //                 }, {
    //                     text: 2060,
    //                     value: 60
    //                 }, {
    //                     text: 2061,
    //                     value: 61
    //                 }, {
    //                     text: 2062,
    //                     value: 62
    //                 }, {
    //                     text: 2063,
    //                     value: 63
    //                 }, {
    //                     text: 2064,
    //                     value: 64
    //                 }, {
    //                     text: 2065,
    //                     value: 65
    //                 }, {
    //                     text: 2066,
    //                     value: 66
    //                 }, {
    //                     text: 2067,
    //                     value: 67
    //                 }, {
    //                     text: 2068,
    //                     value: 68
    //                 }, {
    //                     text: 2069,
    //                     value: 69
    //                 }, {
    //                     text: 2070,
    //                     value: 70
    //                 }, {
    //                     text: 2071,
    //                     value: 71
    //                 }, {
    //                     text: 2072,
    //                     value: 72
    //                 }, {
    //                     text: 2073,
    //                     value: 73
    //                 }, {
    //                     text: 2074,
    //                     value: 74
    //                 }, {
    //                     text: 2075,
    //                     value: 75
    //                 }, {
    //                     text: 2076,
    //                     value: 76
    //                 }, {
    //                     text: 2077,
    //                     value: 77
    //                 }, {
    //                     text: 2078,
    //                     value: 78
    //                 }, {
    //                     text: 2079,
    //                     value: 79
    //                 }, {
    //                     text: 2080,
    //                     value: 80
    //                 }, {
    //                     text: 2081,
    //                     value: 81
    //                 }, {
    //                     text: 2082,
    //                     value: 82
    //                 }, {
    //                     text: 2083,
    //                     value: 83
    //                 }, {
    //                     text: 2084,
    //                     value: 84
    //                 }, {
    //                     text: 2085,
    //                     value: 85
    //                 }, {
    //                     text: 2086,
    //                     value: 86
    //                 }, {
    //                     text: 2087,
    //                     value: 87
    //                 }, {
    //                     text: 2088,
    //                     value: 88
    //                 }, {
    //                     text: 2089,
    //                     value: 89
    //                 }, {
    //                     text: 2090,
    //                     value: 90
    //                 }, {
    //                     text: 2091,
    //                     value: 91
    //                 }, {
    //                     text: 2092,
    //                     value: 92
    //                 }, {
    //                     text: 2093,
    //                     value: 93
    //                 }, {
    //                     text: 2094,
    //                     value: 94
    //                 }, {
    //                     text: 2095,
    //                     value: 95
    //                 }, {
    //                     text: 2096,
    //                     value: 96
    //                 }, {
    //                     text: 2097,
    //                     value: 97
    //                 }, {
    //                     text: 2098,
    //                     value: 98
    //                 }, {
    //                     text: 2099,
    //                     value: 99
    //                 }
    //             ],
    //             // infinite: true,
    //             displayCount: 5,
    //             tag: '日'
    //         },
    //         {
    //             key: 'month',
    //             datasource : [
    //                 {text: '1', value: 0},
    //                 {text: '2', value: 1},
    //                 {text: '3', value: 2},
    //                 {text: '4', value: 0},
    //                 {text: '5', value: 1},
    //                 {text: '6', value: 2},
    //                 {text: '7', value: 0},
    //                 {text: '8', value: 1},
    //                 {text: '9', value: 2},
    //                 {text: '10', value: 0},
    //                 {text: '11', value: 1},
    //                 {text: '12', value: 2}
                    
    //             ],
    //             infinite: false,
    //             displayCount: 5,
    //             tag: '月'
    //         },
    //         {
    //             key: 'day',
    //             datasource : [
    //                 {text: '1', value: 0},
    //                 {text: '2', value: 1},
    //                 {text: '3', value: 2},
    //                 {text: '4', value: 0},
    //                 {text: '5', value: 1},
    //                 {text: '6', value: 2},
    //                 {text: '7', value: 0},
    //                 {text: '8', value: 1},
    //                 {text: '9', value: 2},
    //                 {text: '10', value: 0},
    //                 {text: '11', value: 1},
    //                 {text: '12', value: 2}
                    
    //             ],
    //             infinite: true,
    //             displayCount: 5,
    //             tag: '日'
    //         }
    //     ]
    // });
    // yearDs.render();
});
// alert(1)
// // console.log(window.navigator.userAgent);
// console.log = function() {
//     // debugger
//     var error = document.querySelector('#error');
//     var str = error.innerHTML;
//     str += Array.prototype.join.call(arguments, ',');
//     str += '<br/>';
//     error.innerHTML = str;
// }