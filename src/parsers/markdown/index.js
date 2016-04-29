var marked = require('marked');

function parser(content, options) {
    return {
        type: 'html',
        content: marked(content)
    };
}

module.exports = {
    type: "markdown",
    extNames: ['.md', '.markdown'],
    parser: parser
};
