var Entities = require('html-entities').XmlEntities;
var entities = new Entities();

function parseAliases(lang) {
    lang = lang.trim();
    if (/js|javascript/i.test(lang)) {
        return 'javascript';
    }
    if (lang === 'html') {
        return 'markup';
    }
    return lang;
}

module.exports = function(example, grammar, language){
    var lang;
    if(grammar && language){
        lang = parseAliases(language);
    }else if (grammar) {
        lang = parseAliases(grammar);
    }else if (language) {
        lang = parseAliases(language);
    }
    if(lang){
        // 判断orism是否支持该语法高亮
        try {
            require.resolve('prismjs/components/prism-' + lang + '.js');
        } catch (e) {
            console.warn(1,'! 无法解析默认语法 ' + lang + '，未检测到语法的将不进行高亮'.blue);
        }
        // 判断是否高亮成功
        try {
            require('prismjs/components/prism-'+lang+'.js');
            res = Prism.highlight(entities.decode(example), Prism.languages[lang]);
        } catch (e) {
            // console.warn(2,'! 无法解析默认语法 ' + lang + '，未检测到语法的将不进行高亮'.blue);
        }
    }else {
        res = example;
    }
    return res;
}
