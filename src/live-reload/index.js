var watchDir = require('./watch');
var tinylr = require('tiny-lr');
var growl = require('growl');
var path = require('path');
var Stream = require('stream');
var PassThrough = require('stream').PassThrough;
var env = process.env.NODE_ENV || 'development';

function getSnippet (port) {
  /*jshint quotmark:false */
  var snippet = [
      "<!-- livereload snippet -->",
      "<script>document.write('<script src=\"http://'",
      " + (location.host || 'localhost').split(':')[0]",
      " + ':" + port + "/livereload.js?snipver=1\"><\\/script>')",
      "</script>",
      ""
      ].join('\n');
  return snippet;
}

/**
 * 
 * @param {String} root root directory for watching required
 * @param {Object} opts optional options
 * @api public
 */
module.exports = function (root, opts) {
  if (env !== 'development') {
    return async (ctx, next) => {
      await next();
    }
  }
  opts = opts || {};
  var port = opts.port || 35729;
  opts.includes = (opts.includes || []).concat(['js', 'css', 'html']);
  opts.excludes = (opts.excludes || []).concat(['node_modules']);
  var snippet = getSnippet(port);
  //setup the server
  var server = new tinylr();
  server.listen(port, err => {
    if (err) { throw err; }    
  })
  watchDir(root, opts, function (file) {
    //send notification
    var basename = path.basename(file);
    growl('Change file: ' + basename + '. Reloading...', { image: 'Safari', title: 'liveload' });
    server.changed({
      body: { files: file }
    })
  })
  return async function liveload(ctx, next) {
    await next();
    if (ctx.response.type && ctx.response.type.indexOf('html') < 0) return;

    var body = ctx.body;
    var len = ctx.response.length;
    //replace body
    if (Buffer.isBuffer(ctx.body)) {
      body = ctx.body.toString();
    }

    if (typeof body === 'string') {
      ctx.body = body.replace(/<\/body>/, w => {
        if (len) { ctx.set('Content-Length', len + Buffer.byteLength(snippet)); }
        return snippet + w;
      });
    } else if (body instanceof Stream) {
      var stream = ctx.body = new PassThrough();
      body.setEncoding('utf8');
      if (len) { ctx.set('Content-Length', len + Buffer.byteLength(snippet)); }
      body.on('data', function (chunk) {
        chunk = chunk.replace(/<\/body>/, w => {
          return snippet + w;
        });
        stream.write(chunk);
      });
      body.on('end', () => {
        stream.end();
      })
      body.on('error', ctx.onerror);
    }
  }
}