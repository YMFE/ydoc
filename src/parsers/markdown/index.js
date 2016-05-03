var marked = require('marked');
var renderer = new marked.Renderer();

renderer.heading = function(text, level) {
    return '<h' + level + ' id="' + text + '">' + text + '</h' + level + '>';
};

function parser(contents, options) {
    return {
        type: 'html',
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
