require('colors');

var fs = require('fs');
var sysPath = require('path');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');
var rimraf = require('rimraf');

var Utils = module.exports = {
    logger: {
        log: function () {
            //console.log(('[LOG] ' + Array.prototype.join.call(arguments, ' ')));
            console.log.apply(console, arguments.length ? arguments : ['']);
        },
        info: function () {
            console.log(('[INFO] ' + Array.prototype.join.call(arguments, ' ')).green);
        },
        success: function () {
            console.log(('[SUCCESS] ' + Array.prototype.join.call(arguments, ' ')).green);
        },
        error: function() {
            console.log(('[ERROR] ' + Array.prototype.join.call(arguments, ' ')).red);
        },
        warn: function() {
            console.log(('[WARN] ' + Array.prototype.join.call(arguments, ' ')).yellow);
        }
    },
    // 路径
    path: {
        join: sysPath.join,
        dirname: sysPath.dirname,
        extname: sysPath.extname,
        normalize: sysPath.normalize,
        basename: sysPath.basename,
        resolve: sysPath.resolve,
        home: function() {
            return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
        }
    },
    // 目录操作
    dir: {
        // 创建 支持多级
        mk: function (dirPath) {
            if (!Utils.file.exists(dirPath)) {
                mkdirp.sync(dirPath);
            }
        },
        // 删除 支持多级
        rm: function (dirPath, cb) {
            if (cb) {
                return rimraf(dirPath, cb);
            } else {
                return rimraf.sync(dirPath);
            }
        },
        rename: function(oldPath, newPath){
            fs.renameSync(oldPath,newPath);
        },
        copySync: function(source,dest){
            return fse.copySync(source,dest);
        },
        // 读
        read: function (dirPath) {
            return fs.readdirSync(dirPath);
        }
    },
    // 文件
    file: {
        exists: function (filePath) {
            return fs.existsSync(filePath);
        },
        create: function (filePath) {
            Utils.dir.mk(Utils.path.dirname(filePath));
            fs.closeSync(fs.openSync(filePath, 'w'));
        },
        isDir: function(filePath) {
            return fs.statSync(filePath).isDirectory();
        },
        read: function(filePath) {
            return fs.readFileSync(filePath, 'UTF-8');
        },
        write: function(filePath, data) {
            fs.writeFileSync(filePath, data, 'UTF-8');
        },
        del: function(filePath) {
            fs.unlinkSync(filePath);
        },
        chmod: function(filePath, code) {
            chmod(filePath, code || 777);
        },
        readJson: function (filePath, encode) {
            var ret = null;
            try {
                ret = JSON.parse(fs.readFileSync(filePath, encode || 'UTF-8'));
            } catch (e) {
                throw(new Error(filePath + ' 文件不符合正确的JSON格式'));
            }
            return ret;
        },
        writeJson: function (filePath, json, encode) {
            fs.writeFileSync(filePath, JSON.stringify(json, {}, 4), encode || 'UTF-8');
        },
        fname: function(path) {
            return sysPath.basename(path).replace(sysPath.extname(path), '');
        }
    },
    formateDate: function(date) {
        var t = function(num) {
            return num < 10 ? '0' + num : num;
        };
        var y = date.getFullYear(),
            m = t(date.getMonth() + 1),
            d = t(date.getDate()),
            h = t(date.getHours()),
            mi = t(date.getMinutes()),
            s = t(date.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
    },
    stringFormat: function(src){
        if (arguments.length == 0) return null;
        var args = Array.prototype.slice.call(arguments, 1);

        return src.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
};