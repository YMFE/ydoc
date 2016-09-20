var spawn = require('child_process').spawn;

var fsutil = require('./fs-util');

function pull (){
    var pull = spawn('git', ['pull', 'origin', 'master']),
        copy;

    var update = false;

    pull.stdout.on('data', function(chunk) {
        var data = (chunk + '').toLowerCase();
        if (~data.indexOf('files changed')) {
            update = true;
        }
    });

    pull.stderr.on('data', function(data) {
        console.log('Error:');
        console.log(data + '');
        console.log('------');
    });

    pull.on('close', function(code) {
        if (update) {
            console.log('Update');
            copyFiles();
        } else {
            console.log('Not Update.');
        }
    });
}


function clean(){
    fsutil.rmdirSync('kamidemo');
}

function copyFiles(){
    clean();
    fsutil.mkdirSync('kamidemo');
    fsutil.copySync('prd', 'kamidemo/prd');
    fsutil.copySync('src/html', 'kamidemo/src/html');
    fsutil.copySync('index.html', 'kamidemo');
    zipFiles( mvFiles );
}

function deleteZip(){
    fs.unlinkSync(curPath)
}

function zipFiles( callback ){
    var zip = spawn('zip', ['-r', './kamidemo/kami.zip', './kamidemo/index.html', './kamidemo/prd', './kamidemo/src']);
    zip.stdout.on('data', function(chunk){
        console.log('Copy');
        console.log('' + chunk);
        console.log('------');
    });
    zip.stderr.on('data', function(chunk) {
        console.log('Copy Error');
        console.log('' + chunk);
        console.log('------');
    });
    zip.on('close', function(){
        callback()
    });
}

function mvFiles(){
    fsutil.copySync('./kamidemo', '/home/q/www/kami/demo');
}

// function mvFiles2(){
//     spawn('cp', ['-r', './kamidemo/*', '/home/q/www/kami/demo/']).stderr.on('data', function(chunk) {
//         console.log('Copy Error');
//         console.log('' + chunk);
//         console.log('------');
//     });
// }

var args = process.argv.splice(2);
var cname;
if(args.length > 0){
    cname = args[0];

    switch(cname){
        case "copy":
            copyFiles();
            break;
        case "clean":
            clean();
            break;
        default:
            pull();
    }
}else{
    pull();
}
