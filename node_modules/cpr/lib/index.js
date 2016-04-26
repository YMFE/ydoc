/*
Copyright (c) 2012, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
var fs = require('graceful-fs');
var Stack = require('./stack').Stack;
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var getTree = function(from, options, callback) {
    var stack = new Stack(),
        errors = [],
        results = {};

    options.stats = options.stats || {};
    options.toHash = options.toHash || {};

    fs.readdir(from, stack.add(function(err, dirs) {
        if (!dirs.length) {
            results[from] = true;
            fs.stat(from, stack.add(function(err, stat) {
                /*istanbul ignore next*/
                if (err) {
                    return errors.push(err);
                }
                options.stats[from] = stat;
                options.toHash[from] = path.join(options.to, path.relative(options.from, from));
            }));
        }
        dirs.forEach(function (dir) {
            var base = path.join(from, dir);
            fs.stat(base, stack.add(function(err, stat) {
                options.stats[base] = stat;
                options.toHash[base] = path.join(options.to, path.relative(options.from, base));
                /*istanbul ignore next*/
                if (err) {
                    return errors.push(err);
                }
                if (stat.isDirectory()) {
                    getTree(base, options, stack.add(function(errs, tree) {
                        /*istanbul ignore next*/
                        if (errs && errs.length) {
                            errs.forEach(function(item) {
                                errors.push(item);
                            });
                        }
                        //tree is always an Array
                        tree.forEach(function(item) {
                            results[item] = true;
                        });
                    }));
                } else {
                    results[base] = true;
                }
            }));
        });
    }));

    stack.done(function() {
        callback(errors, Object.keys(results).sort());
    });
};

var filterTree = function (tree, options, callback) {
    var t = tree;
    if (options.filter) {
        if (typeof options.filter === 'function') {
            t = tree.filter(options.filter);
        } else if (options.filter instanceof RegExp) {
            t = tree.filter(function(item) {
                return !options.filter.test(item);
            });
        }
    }
    callback(null, t);
};

var splitTree = function (tree, options, callback) {
    var files = {},
        dirs = {};

    tree.forEach(function(item) {
        var to = options.toHash[item];
        if (options.stats[item] && options.stats[item].isDirectory()) {
            dirs[item] = true;
        } else {
            dirs[path.dirname(item)] = true;
            options.stats[path.dirname(item)] = fs.statSync(path.dirname(item));
            options.toHash[path.dirname(item)] = path.dirname(to);
        }
    });

    tree.forEach(function(item) {
        if (!dirs[item]) {
            files[item] = true;
        }
    });

    callback(Object.keys(dirs).sort(), Object.keys(files).sort());
};


var createDirs = function(dirs, to, options, callback) {
    var stack = new Stack();

    dirs.forEach(function(dir) {
        var stat = options.stats[dir],
            to = options.toHash[dir];

        /*istanbul ignore else*/
        if (to && typeof to === 'string') {
            fs.stat(to, stack.add(function(err, s) {
                if (s && !s.isDirectory()) {
                    options.errors.push(new Error(to + ' exists and is not a directory, can not create'));
                } else {
                    mkdirp(to, stat.mode, stack.add(function(err) {
                        /*istanbul ignore next*/
                        if (err) {
                            options.errors.push(err);
                        }
                    }));
                }
            }));
        }
    });

    stack.done(function() {
        callback();
    });
};

var copyFile = function(from, to, options, callback) {
    var dir = path.dirname(to);
    mkdirp(dir, function() {
        fs.stat(to, function(statError) {
            if(!statError && options.overwrite !== true) {
              return callback(new Error('File '+to+' exists'));
            }

            var fromFile = fs.createReadStream(from),
                toFile = fs.createWriteStream(to),
                err,
                called = false,
                cb = function(e) {
                    if (!called) {
                        callback(e);
                        called = true;
                    }
                },
                onError = function (e) {
                    /*istanbul ignore next*/
                    err = e;
                    cb(e);
                };

            fromFile.on('error', onError);
            toFile.on('error', onError);
            fromFile.once('end', function() {
                cb(err);
            });
            fromFile.pipe(toFile);
        });
    });
};

var createFiles = function(files, to, options, callback) {
    var next = process.nextTick,
        complete = 0,
        count = files.length,
        check = function() {
            /*istanbul ignore else - Shouldn't need this if graceful-fs does it's job*/
            if (count === complete) {
                callback();
            }
        },
        copy = function() {
            var from = files.pop(),
                to = options.toHash[from],
                bail;
            if (!from) {
                return check();
            }
            copyFile(from, to, options, function(err) {
                /*istanbul ignore next*/
                //This shouldn't happen with graceful-fs, but just in case
                if (/EMFILE/.test(err)) {
                    bail = true;
                    files.push(from);
                } else if (err) {
                    options.errors.push(err);
                }
                /*istanbul ignore next*/
                if (!bail) {
                    complete++;
                }
                next(copy);
            });
        };

    copy();
};

var confirm = function(files, options, callback) {
    var stack = new Stack(),
        errors = [],
        f = [],
        filtered = files;

    if (options.filter) {
        if (typeof options.filter === 'function') {
            filtered = files.filter(options.filter);
        } else if (options.filter instanceof RegExp) {
            filtered = files.filter(function(item) {
                return !options.filter.test(item);
            });
        }
    }
    
    /*istanbul ignore else - filtered should be an array, but just in case*/
    if (filtered.length) {
        filtered.forEach(function(file) {
            fs.stat(file, stack.add(function(err, stat) {
                /*istanbul ignore next*/
                if (err) {
                    errors.push(err);
                } else {
                    if (stat && (stat.isFile() || stat.isDirectory())) {
                        f.push(file);
                    }
                }
            }));
        });
    }

    stack.done(function() {
        /*istanbul ignore next */
        callback(((errors.length) ? errors : null), f.sort());
    });
};

var cpr = function(from, to, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }

    var options = {},
        proc;

    Object.keys(opts).forEach(function(key) {
        options[key] = opts[key];
    });

    options.from = from;
    options.to = to;
    options.errors = [];

    proc = function() {
        getTree(options.from, options, function(err, tree) {
            filterTree(tree, options, function(err, t) {
                splitTree(t, options, function(dirs, files) {
                    if (!dirs.length && !files.length) {
                        return callback(new Error('No files to copy'));
                    }
                    createDirs(dirs, to, options, function() {
                        createFiles(files, to, options, function() {
                            var out = [], err;
                            Object.keys(options.toHash).forEach(function(k) {
                                out.push(options.toHash[k]);
                            });
                            if (options.confirm) {
                                confirm(out, options, callback);
                            } else if (!options.errors.length) {
                                callback(null, out.sort());
                            } else {
                                /*istanbul ignore next*/
                                err = new Error('Unable to copy directory' + (out.length ? ' entirely' : ''));
                                /*istanbul ignore next*/
                                err.list = options.errors;
                                /*istanbul ignore next*/
                                callback(err, out.sort());
                            }
                        });
                    });
                });
            });
        });
    };

    fs.stat(options.from, function(err, stat) {
        if (err) {
            return callback(new Error('From should be a file or directory'));
        }
        if (stat && stat.isDirectory()) {
            if (options.deleteFirst) {
                rimraf(to, function() {
                    proc();
                });
            } else {
                proc();

            }
        } else {
            if (stat.isFile()) {
                return copyFile(options.from, path.join(to, path.basename(options.from)), options, callback);
            }
            callback(new Error('From should be a file or directory'));
        }
    });
};

//Preserve backward compatibility
cpr.cpr = cpr;
//Export a function
module.exports = cpr;
