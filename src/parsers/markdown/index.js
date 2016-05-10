var marked = require('marked'),
    sysPath = require('path');

function parser(contents, options) {
    var renderer = new marked.Renderer(),
        menuLevel = options.menuLevel || -1,
        subMenuLevel = options.subMenuLevel || (options.menuLevel && (options.menuLevel + 1)) || -1,
        menus = [];

    renderer.heading = function(text, level) {
        if (level == menuLevel) {
            menus.push({
                name: text
            });
        }
        if (level == subMenuLevel) {
            menus.push({
                name: text,
                sub: true
            });
        }
        return '<h' + level + ' id="' + text + '">' + text + '</h' + level + '>';
    };
    renderer.link = function(href, title, text) {
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
        out += '>' + text + '</a>';
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
