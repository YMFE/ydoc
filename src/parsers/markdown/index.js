var marked = require('marked');
var renderer = new marked.Renderer();

renderer.heading = function(text, level) {
    return '<h' + level + ' id="' + text + '">' + text + '</h' + level + '>';
};

function parser(content, options) {
    return {
        type: 'html',
        content: marked(content, {
            renderer: renderer
        })
    };
}

module.exports = {
    type: "markdown",
    extNames: ['.md', '.markdown'],
    parser: parser
};
