var parser = require('parse-comments'),
    markdown = require('markdown').markdown,
    artTemplate = require('art-template'),
    glob = require("glob"),
    gutil = require('gulp-util'),
    jsformatter = require('atropa-jsformatter'),
    utils = require('../../utils.js');

var BASEPATH = process.cwd();
var config = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));


artTemplate.config('escape', false);

var rootPath = __dirname,
    currentPath = process.cwd(),
    webSiteUrl = config.webSiteUrl,
    destDir = utils.path.resolve(config.destDir),
    staticDir = utils.path.join(destDir,'static'),
    staticUrl = utils.stringFormat('{0}/static/',webSiteUrl),
    defaultTemplate = config.template_scss || utils.path.join(__dirname, 'template/__template.html');

function analyzeMD(blockConf, docConf){
    

    var data = {
        page: {
            type: 'html',
            title: blockConf.title,
            name: blockConf.name,
            content: "",
            menu: docConf.menu
        },
        title: docConf.title,
        footer: docConf.footer,
        banner: docConf.banner
    };

    var mkFile = utils.path.join(currentPath, blockConf.content);

    if(utils.file.exists(mkFile)){
        data.page.content = markdown.toHTML(utils.file.read(mkFile));
    };
    return data;
};

function analyzeJS(blockConf, docConf){
    var data = {
        page: {
            type: 'js',
            title: blockConf.title,
            name: blockConf.name,
            content: blockConf,
            menu: docConf.menu
        },
        title: docConf.title,
        footer: docConf.footer,
        banner: docConf.banner
    };
    return data;
};


function getListName(filePath){
    return utils.file.fname(utils.path.basename(filePath));
};

function getSinglePageData(filePath){
    var fileContent = utils.file.read(filePath),
        fileData = parser(fileContent),
        fileCodeExamplePath = utils.path.join(currentPath, "/Examples/UIExplorer/", getListName(filePath) + "Example.js"),
        deleCommentsReg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
        info = {}, propertyArr = [];

    if(utils.file.exists(fileCodeExamplePath)){
        fileExampleContent = utils.file.read(fileCodeExamplePath);            
        info.demo = fileExampleContent.replace(deleCommentsReg, function(word){
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
        }).replace(/\</ig, "&lt;").replace(/\>/ig, "&gt;");
    }  
   

    fileData.forEach(function(tag){
        var description, property, propertyName, propertyType, methodName, params, examples = [], platform;
        //console.log("=======",tag);
        for(var name in tag){
            switch (name){
                case "providesModule":
                    info.module = info.module || tag[name];
                    info.name = tag[name];
                    info.title = tag[name];
                    break;
                case "summary":
                    info.summary = markdown.toHTML(tag[name]);
                    break;
                case "lead":
                    if(tag[name]){
                        lead = markdown.toHTML(tag[name]);
                    }
                    break;
                case "method":
                    methodName = tag[name];
                    break;
                case "examples":
                    if(tag[name].length){
                        tag[name].forEach(function(example){
                            examples.push(markdown.toHTML(example.code));
                        });
                    }
                    break;
                case "description":
                    //console.log(tag[name]);
                    var reg = /(\`{3}.*?(\n|.))|((\n|.)*?\`{3})/g;
                    description = markdown.toHTML(tag[name].replace(reg, function(word){
                        console.log("====",word);
                        return /^\`{3}/.test(word) ? "" : word; 
                    }));
                    break;
                case "properties":
                    if(tag[name].length){
                        property = tag[name][0],
                        propertyName = property.name,
                        propertyType = property.type;
                    }
                    break;
                case "params":
                    params = tag[name];
                    break;
                case "platform":
                    platform = tag[name];
                    break;    
            }

        }

        info.propertys = info.propertys || [];
        info.methods = info.methods || [];
        if(propertyName){
            info.propertys.push({
                name: propertyName,
                type: propertyType,
                description: description,
                params: params || [],
                examples: examples,
                platform: platform
            });
        }else if(methodName){
            info.methods.push({
                name: methodName,
                lead: lead || '',
                description: description,
                params: params || [],
                examples: examples
            });
        }
    });
    
    return info;
};




module.exports = {
    getDoc: function(){
        try{
            utils.dir.rm(destDir);
            utils.dir.mk(destDir);
            utils.dir.rm(staticDir);
            utils.dir.mk(staticDir);
            utils.dir.copySync(utils.path.join(rootPath,'source'),utils.path.join(destDir,'source'));
        }catch(e){
            utils.logger.error('创建 '+destDir+' 权限不足，请加 sudo 参数');
            return;
        }

        var modules = config.project.modules || [],
            docConfig = {
                title: config.project.title,
                footer: config.project.footer,
                banner: config.project.banner,
                modules: modules.map(function(item) {
                    return item
                }),
                menu: config.project.modules
            },
            template = utils.file.read(defaultTemplate),
            render = artTemplate.compile(template);

        modules.forEach(function(module) {
            if(module.blocks && module.blocks.length){
                module.blocks.forEach(function(block){
                    var data;
                    if(block.type == "markdown"){
                        data = analyzeMD(block, docConfig);
                    }
                    fileName = utils.stringFormat("{0}.html",block.title);
                    utils.file.write(utils.path.join(destDir,fileName), render(data));
                });
            }else if(module.content){
                var dirPath = utils.path.join(currentPath, module.content),
                    listName = [],
                    files = glob.sync(dirPath);

                files.forEach(function(filePath){

                    if(getListName(filePath) == "AlertIOS"){
                        listName.push(getListName(filePath));
                        var data = analyzeJS(getSinglePageData(filePath), docConfig);
                        fileName = utils.stringFormat("{0}.html",getListName(filePath));
                        utils.file.write(utils.path.join(destDir,fileName), render(data));
                    }
                });
            }
        });

        gutil.log(gutil.colors.green('生成目录:'+utils.path.join(process.cwd(),destDir)));
    }
}