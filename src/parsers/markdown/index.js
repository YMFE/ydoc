var marked = require('marked'),
    sysPath = require('path'),
    arr = [],
    sum = 1;
function addNumberWhileSameName(id) {
    if(arr.indexOf(id) !== -1){
        id += sum;
        sum++;
    }
    arr.push(id);
    return id;
}

function parser(contents, options) {
    var renderer = new marked.Renderer(),
        menuLevel = options.menuLevel || -1,
        subMenuLevel = options.subMenuLevel || (options.menuLevel && (options.menuLevel + 1)) || -1,
        menus = [];
    renderer.heading = function(text, level) {
        var realText = text;
        var text = addNumberWhileSameName(text);
        if (level == menuLevel) {
            menus.push({
                name: realText,
                href: text
            });
        }
        if (level == subMenuLevel) {
            menus.push({
                name: realText,
                href: text,
                sub: true
            });
        }
        if(text.match(/<.*>/) && (text.match(/<.*>/).length > 0)){
            return '<h' + level + '>' + realText + '</h' + level + '>';
        }else{
            return '<h' + level + ' class="subject" id="' + text + '">' + realText + ' <a class="hashlink" href="#' + text + '">#</a></h' + level + '>';
        }

    };
    renderer.listitem = function(text) {
        var realText = text;
        var text = addNumberWhileSameName(text);
        if (/^\s*\[[x ]\]\s*/.test(text)) {
            text = text
            .replace(/^\s*\[ \]\s*/, '<i class="empty checkbox">&#xf35f;</i> ')
            .replace(/^\s*\[x\]\s*/, '<i class="checked checkbox">&#xf35e;</i> ');
            return '<li class="task-list">' + realText + '</li>';
        } else {
            return '<li>' + realText + '</li>';
        }
    };
    renderer.link = function(href, title, text) {
        var realText = text;
        var text = addNumberWhileSameName(text);
        if (this.options.sanitize) {
            try {
                var prot = decodeURIComponent(unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
                return '';
            }
        }
        if (href.indexOf('://') == -1) {
            if (sysPath.extname(href) == '.md') {
                href = href.replace(/\.md$/, '.html');
            }
        }
        var out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + realText + '</a>';
        return out;
    }
    return {
        type: 'html',
        menus: menus,
        content: marked(contents.join('\n'), {
            renderer: renderer
        })
    };
}

module.exports = {
    type: "markdown",
    extNames: ['.md', '.markdown'],
    parser: parser
};
