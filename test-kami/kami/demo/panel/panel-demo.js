/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var Panel = require('../../scripts/panel/index.js');
var Template = require('../../scripts/template/index.js');
var tpl = require('./panel.string');
var bodyTpl = require('./body.string');
var index = 1;

document.addEventListener('DOMContentLoaded', function () {
    var panel = new Panel({
        container: '#container',
        template: tpl,
        preventDefault: true,
        stopPropagation: false,
        useRefresh: true,
        useLoadmore: true,
        loadmoreActiveY: -100,
        skin: 'yo',
        onTap: function(e) {
            console.log(e.target);
        },
        onReady: function() {
            this.html(getHTML(1));
        },
        onRefresh: function(pageNum) {
            var self = this;
            // 模拟异步请求
            setTimeout(function() {
                self.refresh(getHTML(1));
            }, 1000);
        },
        onLoadmore: function(pageNum) {
            var self = this;
            index = index + 10;
            if(index < 40) {
                // 模拟异步请求
                setTimeout(function() {
                    self.loadMore(getHTML(index));
                }, 1500);
            } else {
                self.loadMore('');
            }
        }
    });
    panel.render();
});

function getHTML(index) {
    var data = [];
    for(var i = index; i < index + 10; i++) {
        data.push({name: 'X' + i, type: 'hybrid', phone: '15659997900'});
    }
    return Template(bodyTpl, {data: data});
}