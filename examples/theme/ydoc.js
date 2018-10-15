
module.exports = {
    title: "ydoc demo",
    "theme": "dark",
    markdownIt: function(md) {
        // md.use(require("markdown-it-small"), __dirname);
        // md.use(require("markdown-it-mark"), __dirname);
        // md.use(require("markdown-it-include"), __dirname);
        // md.use(require("markdown-it-container"), "code", {
        //     validate: function(params) {
        //         return params.trim().match(/^code\s+(.*)$/);
        //     },
        //     render: function(tokens, idx) {
        //         var m = tokens[idx].info.trim().match(/^code\s+(.*)$/);
        //         if (tokens[idx].nesting === 1) {
        //             // opening tag
        //             return "<div><div style='background-color:rgba(88,88,88,.8);line-height: 2; text-align: left; padding-left: 10px; color: #fff;'>" + md.utils.escapeHtml(m[1]) + "</div>\n";
        //         } else {
        //             // closing tag
        //             return "</div>\n";
        //         }
        //     }
        // });
    }
};
