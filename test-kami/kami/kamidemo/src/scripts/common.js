require('libs/zepto.min');
require('libs/zepto.touch');

var SCRIPT_URL = "/*[SCRIPT_URL]*/";
var STYLE_URL = "/*[STYLE_URL]*/";


var kami = window.Kami || {};

kami.disableTapEvent = true;
kami.theme = "yo";

window.Kami = kami;


var demo = {};

demo.log = function(){
    var timer;
    var ele = $('<div>').css({
        position: 'fixed',
        zIndex: 10000,
        top: "50%",
        left: "50%",
        background: "rgba(0,0,0,0.8)",
        borderRadius: "5px",
        padding: "10px",
        maxWidth: "300px",
        color: "#fff",
        "-moz-transform": 'translatex(-50%) translatey(-50%)',
        "-webkit-transform": 'translatex(-50%) translatey(-50%)',
        'transform': 'translatex(-50%) translatey(-50%)'
    }).appendTo('body').hide();

    var len = 0;

    function hide(){
        if(len === 0){
            ele.hide();
        }
    }

    return function(msg){

        console.log(msg);

        var arg = Array.prototype.slice.call(arguments, 0);
        arg = arg.map(function(item){
            if(typeof item == "object"){
                return JSON.stringify(item);
            }
            return item;
        })
        msg = arg.join(', ')

        ele.show();
        var ll = $("<div>").html(msg).appendTo(ele);
        len += 1;

        setTimeout(function(){
            ll.remove();
            len -= 1;
            hide();
        }, 2000)
    }
}();


window.Demo = demo;

function openCode (code) {
    var codeWin = window.open();
    codeWin.document.write(code);
    codeWin.document.close();
}

function getData(){
    var tpls = [],
        jtext = [];
    $('script').each(function(i, sc){
        var text = sc.innerHTML.trim();
        if(text){
            switch(sc.type){
                case "template/javascript": 
                    tpls.push({
                        text: text,
                        id: ("#" + sc.id) || "模板"
                    });
                    break;
                default:
                    jtext.push({
                        text: text
                    });
            }
        }
    });
    return {
        tpls: tpls,
        scripts: jtext
    }
}

var html = '<!DOCTYPE html><html>'
+'<head><meta charset="utf-8" /><title>Code -- {title}</title><meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" /><meta name="format-detection" content="telephone=no,email=no" />'
+'<link rel="shortcut icon" href="http://touch.qunar.com/favicon.ico" />'
+'<link rel="icon" type="image/x-icon" href="http://touch.qunar.com/favicon.ico" />'
+'<link rel="stylesheet" href="{style}/export/syntaxhighlighter.css" />'
+'<style type="text/css">.toolbar {display: none;}</style></head>'
+'<body>{content}<script type="text/javascript" src="{script}/syntax.js"></script></body></html>';

function show(){
    var data = getData();
    var str = "";
    $(data.scripts).each(function(i, obj){
        var code = obj.text;

        code = code.replace(/Kami\.(\w+)/ig, function(name, key){
            return 'requ'+'ire("Kami/'+key.toLowerCase()+'")'
        });

        str += '<h3>调用方式</h3><pre class="brush: js;" >{code}</pre>'
                    .replace(/\{code\}/ig, code)
    });
    $(data.tpls).each(function(i, obj){
        str += '<h3>{title}</h3><pre class="brush: js;" >{code}</pre>'
                    .replace(/\{title\}/ig, obj.id)
                    .replace(/\{code\}/ig, obj.text)
    });

    str = html.replace(/\{content\}/ig, str)
                .replace(/\{script\}/ig, SCRIPT_URL)
                .replace(/\{style\}/ig, STYLE_URL)
                .replace(/\{title\}/ig, document.title)

    openCode(str);
}

$(function(){
    $(document.body).on('click', '.m-header .affirm', show);
})