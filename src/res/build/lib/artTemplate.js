/**
 * Created by eva on 15/10/13.
 */
var artTemplateEn = require('art-template');
var gulp = require('gulp');
var through = require('through-gulp');
var _ = require('underscore')

function artTemplate(resource){
    var stream = through(function(file, enc, callback){
        artTemplateEn.config('escape', true);
        artTemplateEn.helper('anchor', function(name) {
            return name ? name.replace(/[\.\:]/g, '-') : '';
        });
        artTemplateEn.helper('txt', function(html) {
            return html ? html.replace(/\<\/?[^\>]*\>/g, '') : '';
        });

        var templateHtml = resource.toString();
        var json = file.contents.toString();

        var render = artTemplateEn.compile(templateHtml);
        var newContent = render(JSON.parse(json));
        file.contents = new Buffer(newContent);

        this.push(file);
        callback();
    });
    return stream;
}
module.exports = artTemplate;