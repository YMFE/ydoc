var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

var fsutil = require('./fs-util');

function pack(){
    var pack = spawn('fekit', ['pack']);

    pack.stdout.on('data', function(data){
        console.log( data.toString() );
    });

    pack.stderr.on('data', function(data){
        console.log('Error:');
        console.log(data + '');
        console.log('------');
    });

    pack.on('close', function(code) {
        console.log("pack code:" + code)
        packMin()
    });
}

function packMin () {
    var min = spawn('fekit', ['min']);

    min.stdout.on('data', function(chunk){
        console.log( chunk.toString() )
    })

    min.stderr.on('data', function(data){
        console.log('Error:');
        console.log(data + '');
        console.log('------');
    });

    min.on('close', function(code) {
        console.log("min code:" + code);
        // copyFiles();
        fsutil.rmdirSync('dev');
        fsutil.rmdirSync('ver');
        fsutil.rmdirSync('refs');
    });
}

function clean(){
    fsutil.rmdirSync('dist');
}

function copyFiles(){
    clean();
    fsutil.mkdirSync('dist');
    fsutil.copySync('prd', 'dist/prd');
    fsutil.copySync('src/html', 'dist/src/html');
    fsutil.copySync('index.html', 'dist');
}


var options = process.argv;

var order = options[2];

if(order === 'dir'){
    mkdir('dist');
}else{
    pack();
}