const readlineSync = require('readline-sync');
const initConfig = ['title', 'description', 'author'];

function initYdoc() {
    readlineSync.question('请输入您的文档的配置项，不输入则使用默认项，回车表示结束');
    let config = {};
    initConfig.forEach((item) => {
        const input = readlineSync.question(`your document ${item} :`);
        if(input !== '') {
            config[item] = input;
        } 
    })
    return config;
}

module.exports = initYdoc;
