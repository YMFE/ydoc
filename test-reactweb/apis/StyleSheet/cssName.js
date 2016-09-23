/**
* 修正CSS的样式名，不限于加厂商前缀，改用其他名字，并缓存起来，以减少重复计算
*/

var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-']
var cssMap = {
    //支持Range对象,肯定可以使用cssFloat
    'float': window.Range ? 'cssFloat' : 'styleFloat',
    textDecorationLine: 'textDecoration' //react native的下划线与浏览器的名字不一
}


var rcamelize = /[-_][^-_]/g
var root = document.documentElement
function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
        return target
    }
    //转换为驼峰风格
    return target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase()
    })
}

function cssName(name, host, camelCase) {
    if (cssMap[name]) {
        return cssMap[name]
    }
    host = host || root.style
    for (var i = 0, n = prefixes.length; i < n; i++) {
        camelCase = camelize(prefixes[i] + name)
        if (camelCase in host) {
            return (cssMap[name] = camelCase)
        }
    }
    return null
}

module.exports = cssName
