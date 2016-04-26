var markdown = require('markdown').markdown;

function parser(content, options) {
    return {
        type: 'html',
        content: markdown.toHTML(content)
    };
}

module.exports = {
    type: "markdown",
    extNames: ['.md', '.markdown'],
    parser: parser
};
