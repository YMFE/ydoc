/**
 * @description 模板解析
 * @author zxiao <jiuhu.zh@gmail.com>
 * @date 2014/11/12
 *
 * 简要使用描述:
 * variable --> {{name}}
 * if --> {{#if age == 12}}{{#else if !age}}{{#else}}{{/if}}
 * for -->{{#each data as userlist [index]}}{{/each}}
 *
 * 待完善：
 * 1、预编译
 * 2、安全
 * 3、性能
 * 4、可配置
 * 。。。
 *
 */

var reg = {
    'if': /{{#(if)\s+(.+?)\s*}}/,
    'else': /{{#(else)}}/,
    'elseif': /{{#(else\s+?if)\s+(.+?)\s*}}/,
    'endif': /{{\/if}}/,
    'each': /{{#each\s+(.+?)\s*}}/,
    'endeach': /{{\/each}}/,
    'eval': /{{\s*eval\s+.+?}}/
};

function template(tplStr, data) {
    if(!tplStr) {
        return '';
    }

    var preFlag = 1; // 上一次命中的类型：1：html文本，2：变量，3：语句
    var flag; // 本次命中的类型
    var source = ''; // 输出的源码
    var isFirst = true; // 是否第一行
    var str; // 循环中每行的代码
    var arr;

    // 去注释空行，转义双引号和斜杆，根据语法进行分行，去空行，然后根据行切割
    tplStr = tplStr.replace(/<!--[\s\S]*?-->/g, '').replace(/("|\\)/g, '\\$1').replace(/({{.+?}})/g,function(s) {
        return '\n' + s + '\n';
    }).replace(/\r/g, '');
    arr = tplStr.split('\n').filter(function(v, i) {
        return !/^\s*$/.test(v);
    });

    for(var i = 0, len = arr.length; i < len; i++) {
        str = arr[i].replace(/^\s+|\s+$/, ' ');
        if(str) {
            var statementType = '';
            if(/{{.+?}}/.test(str)) {
                flag = 2;
                for(var type in reg) {
                    if((reg[type]).test(str)) {
                        flag = 3;
                        statementType = type;
                    }
                }
            } else {
                flag = 1;
            }
            if(preFlag == 1) {
                if(isFirst) {
                    source += '\'';
                }
                if(flag == 1) {
                    source += ' ' + str;
                } else if(flag == 2) {
                    source += '\',' + helper.variable(str);
                } else if(flag == 3) {
                    source += '\');' + helper.statement(str, statementType);
                }
            } else if(preFlag == 2) {
                if(flag == 1) {
                    source += ',\'' + str;
                } else if(flag == 2) {
                    source += ',' + helper.variable(str);
                } else if(flag == 3) {
                    source += ');' + helper.statement(str, statementType);
                }
            } else if(preFlag == 3) {
                if(flag == 1) {
                    source += '_s.push(\' ' + str;
                } else if(flag == 2) {
                    source += '_s.push(' + helper.variable(str);
                } else if(flag == 3) {
                    source += helper.statement(str, statementType);
                }
            }
            isFirst = false;
            preFlag = flag;
        }
    }
    if(flag == 1) {
        source += '\');';
    } else if(flag == 2) {
        source += ');';
    }

    var func = function(map) {
        var p = [], v = [], ret = '';
        for(var i in map) {
            p.push(i), v.push(map[i]);
        }
        try{
            ret = (new Function(p, "var _s=[];_s.push(" + source + " return _s;")).apply(null, v).join("");
        } catch(e) {
            console.error('parse error: ' + e.message);
        }
        return ret;
    };

    return data ? func(data): func;
};

var helper = {
    variable: function(str) {
        return str.replace(/{{(.+?)}}/, '$1');
    },
    statement: function(str, type) {
        var result = '';
        switch(type) {
            case 'if': result = str.replace(reg['if'], '$1($2)') + '{'; break;
            case 'elseif': result = '}' + str.replace(reg['elseif'], '$1($2)') + '{'; break;
            case 'else': result = '}' + str.replace(reg['else'], '$1') + '{'; break;
            case 'each':
                str = str.replace(reg['each'], '$1');
                var split = str.split(/\s+/);
                var list = split[0] || '$list';
                var value = split[2] || '$value';
                var index = split[3] || '$index';
                result = 'for(var ' + index + ' in ' + list + '){var ' + value + '=' + list + '[' + index + '];';
                break;
            case 'endif':
            case 'endeach':result = '}';break;
            case 'eval': result = str.replace(/^{{\s*eval/, '').replace(/}}\s*$/, '') + ';';
        }
        return result;
    }
};

module.exports = template;