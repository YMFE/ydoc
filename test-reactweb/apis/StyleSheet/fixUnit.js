var cssProperty = require('./cssProperty')
var cssNumber = cssProperty.cssNumber
var cssShort = cssProperty.cssShort

var runit = /\d*\.?\d+(rem|em|in|cm|mm|pt|pc|px|vh|vw|vmin|vmax|%)*/g


var rPrefixes = /^(Webkit|O|Moz|Ms)/


function fixUnit(value, name) {
       

    if (typeof value === 'number') {
// transform less then 1px value to 1px, 0.5 to be 1
        // 如果是WebkitFlex这种形式，恢复原来的模式
        if(rPrefixes.test(name)){
            var nameArr = name.replace( /([A-Z])/g, '-$1').split('-');
            nameArr.shift();
            nameArr.shift();
            nameArr[0] = nameArr[0].toLowerCase();
            name = nameArr.join('');
        }




        if (!cssNumber[name] && value > 0 && value < 1) {
            value = 1
        }

// Add px to numeric values
        if (!cssNumber[name] && typeof value === 'number') {
           return parseFloat((value / 100).toFixed(2)) + 'rem'
        }
    }

    if (cssShort[name] && typeof value === 'string') {
        value = value.replace(runit, function (val, unit) {
            return unit ? val : parseFloat((val / 100).toFixed(2)) + 'rem'
        })
    }
    return value
}

module.exports = fixUnit