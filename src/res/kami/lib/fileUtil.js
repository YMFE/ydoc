/**
 * Created by jiuhu on 15/1/5.
 * 文件操作工具类，对nodejs的fsapi的封装
 */
var fs = require('fs');
var path = sysPath = require('path');

/**
 * 删除目录 - 同步
 *
 * @param dirPath 目录路径
 *
 * @return undefined
 */
function rmDirSync(dirPath) {
    var files = [];
    if (fs.existsSync(dirPath)) {
        files = fs.readdirSync(dirPath);
        files.forEach(function(file) {
            var curPath = path.join(dirPath, file);
            isDirSync(curPath) ? rmDirSync(curPath) : fs.unlinkSync(curPath);
        });
        fs.rmdirSync(dirPath);
    }
}

/**
 * 创建目录 - 同步
 *
 * @param dirPath 目录路径
 * @param [mode]
 *
 * @return undefined
 */
function mkDirSync(dirPath, mode) {
    if (mode === undefined) {
        mode = 0755 & (~process.umask());
    }
    var tPath = dirPath, paths = [];
    while (!fs.existsSync(tPath)) {
        paths.unshift(tPath);
        tPath = path.dirname(tPath);
    }
    paths.forEach(function (t) {
        fs.mkdirSync(t, mode);
    })
}

/**
 * 创建目录 - 异步
 *
 * @param dirPath 目录路径
 * @param callback 回调
 */
function mkDir(dirPath, callback) {
    fs.exists(dirPath, function(exists) {
        if(exists) {
            callback(dirPath);
        } else {
            mkDir(path.dirname(dirPath), function(){
                fs.mkdir(dirPath, 0777, callback);
            });
        }
    });
};

/**
 * 文件或文件夹拷贝都可以使用 - 同步
 *
 * @param sourcePath 源文件夹路径 或 源文件路径
 * @param targetPath 目标文件夹路径，如果目标文件夹不存在，则自动创建
 */
function copySync(sourcePath, targetPath) {
    if(isDirSync(sourcePath)) {
        copyDirSync(sourcePath, targetPath);
    } else {
        copyFileSync(sourcePath, targetPath);
    }
}

/**
 * 目录拷贝 - 同步
 *
 * @param sourcePath 源文件夹路径
 * @param targetPath 目标文件夹路径，如果目标文件夹不存在，则自动创建
 */
function copyDirSync(sourcePath, targetPath) {

    if(!fs.existsSync(sourcePath)) {
        throw new Error('ERROR: 不存在源文件夹：' + sourcePath);
    } else if(!isDirSync(sourcePath)) {
        console.error('ERROR: 源文件路径不是文件夹类型');
        return;
    }

    mkDirSync(targetPath);

    var sPath, tPath;
    fileListSync(sourcePath).forEach(function (file) {
        sPath = path.join(sourcePath, file),
            tPath = path.join(targetPath, file);
        if (isDirSync(sPath)) {
            copyDirSync(sPath, tPath);
        } else {
            copyFileSync(sPath, targetPath);
        }
    });
}

/**
 * 文件拷贝 - 同步
 *
 * @param sourceFile 源文件
 * @param targetPath 目标文件夹路径，如果目标文件夹不存在，则自动创建
 */
function copyFileSync(sourceFile, targetPath) {

    if(!fs.existsSync(sourceFile) && !isSymLinkSync(sourceFile)) {
        throw new Error('ERROR: 不存在源文件：' + sourceFile);
    } else if(isDirSync(sourceFile)) {
        console.error('ERROR: 源文件路径不是文件类型');
        return;
    }

    if(!fs.exists(targetPath)) {
        mkDirSync(targetPath);
    }

    var targetFile = path.join(targetPath, path.basename(sourceFile));

    if(isSymLinkSync(sourceFile)) {
        try {
            fs.symlinkSync(sourceFile, targetFile);
        } catch(e) {
            console.warn('WARN: ' + e.message);
        }
        return;
    }

    var buffSize = 64 * 1024, //64K
        buff = new Buffer(buffSize);

    var readable = fs.openSync(sourceFile, 'r'),
        writable = fs.openSync(targetFile, 'w'),
        readSize, pos = 0;

    while ((readSize = fs.readSync(readable, buff, 0, buffSize, pos)) > 0) {
        fs.writeSync(writable, buff, 0, readSize);
        pos += readSize;
    }
    fs.closeSync(readable);
    fs.closeSync(writable);
}


/**
 * 将文件夹里的所有文件移动到文件夹外，并删除该文件夹
 *
 * @param dirPath 当前文件夹路径
 */
function moveToUpperDirSync(dirPath) {
    if(fs.existsSync(dirPath) && isDirSync(dirPath)) {
        var upperDir = path.dirname(dirPath);
        copyDirSync(dirPath, upperDir);
        rmDirSync(dirPath);
    }
}

/**
 * 读取目录下的所有文件
 *
 * @param dirPath
 * @returns {Array} 文件名集合
 */
function fileListSync(dirPath) {
    if (isDirSync(dirPath)) {
        return fs.readdirSync(dirPath);
    }
    return [];
}

/**
 * 创建文件
 *
 * @param filePath
 */
function createFileSync(file) {
    mkDirSync(path.dirname(file));
    fs.closeSync(fs.openSync(file, 'w'));
}

/**
 *
 * @param file
 * @returns {Boolean}
 */
function isDirSync(file) {
    return fs.lstatSync(file).isDirectory();
}

/**
 *
 * @param file
 * @returns {Boolean}
 */
function isFileSync(file) {
    return fs.lstatSync(file).isFile();
}

/**
 *
 * @param file
 * @returns {Boolean}
 */
function isSymLinkSync(file) {
    return fs.lstatSync(file).isSymbolicLink();
}

function _getAllFile(filesArr, path, extension) {
    var stat = fs.statSync(path);
    if (stat.isDirectory()) {
        var dirs = fs.readdirSync(path);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            var dirPath = sysPath.join(path, dir);
            _getAllFile(filesArr, dirPath, extension);
        }

    }
    else if (stat.isFile()){
        var fileExtension = sysPath.extname(path);
        if (fileExtension === extension) {
            var fileName = sysPath.basename(path);
            filesArr.unshift({
                name: fileName,
                path: path
            });
        }

    }
    else {
        //do nothing
    }
}
//获取目录下对应拓展名的所文件的接口
function getAllFile(sourcePath, extension) {
    extension = extension || '.js';
    if ( 0 !== extension.indexOf('.') ) {
        extension = '.' + extension;
    }
    var filesArr = [];
    if (!sourcePath || !fs.existsSync(sourcePath)) {
        return filesArr;
    }
    if (!fs.statSync(sourcePath).isDirectory()) {
        return filesArr;
    }
    else if (fs.statSync(sourcePath).isFile()){
        var fileExtension = sysPath.extname(sourcePath);
        if (fileExtension === extension) {
            var fileName = sysPath.basename(sourcePath);
            filesArr.push({
                name: fileName,
                path: sourcePath
            });
        }
        return filesArr;
    }
    else {
        _getAllFile(filesArr, sourcePath, extension);
    }

    /**
     * filesObj like
     * {
     * name: 'basename of the file',
     * path: 'realpath of the file'
     * }
     */

    return filesArr;

}
var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
module.exports = {
    rmDirSync: rmDirSync,
    mkDirSync: mkDirSync,
    mkDir: mkDir,
    copySync: copySync,
    copyDirSync: copyDirSync,
    copyFileSync: copyFileSync,
    fileListSync: fileListSync,
    isDirSync: isDirSync,
    isFileSync: isFileSync,
    isSymLinkSync: isSymLinkSync,
    createFileSync: createFileSync,
    moveToUpperDirSync: moveToUpperDirSync,
    getAllFileByPathAndExtension: getAllFile,
    deleteFolderRecursive: deleteFolderRecursive
};