var marked = require('marked');


function parser(contents, options) {
    var renderer = new marked.Renderer(),
        menuLevel = options.menuLevel || -1,
        menus = [];

    renderer.heading = function(text, level) {
        if (level == menuLevel) {
            menus.push(text);
        }
        return '<h' + level + ' id="' + text + '">' + text + '</h' + level + '>';
    };
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
