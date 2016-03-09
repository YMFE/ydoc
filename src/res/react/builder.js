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
    defaultTemplate = config.template_react || utils.path.join(__dirname, 'template/__template.html');

function analyzeMD(blockConf, docConf){
    
    var data = {
        page: {
            type: 'html',
            title: blockConf.title,
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
            content: "",
            menu: docConf.menu
        },
        title: docConf.title,
        footer: docConf.footer,
        banner: docConf.banner
    };
    var mkFile = utils.path.join(currentPath, blockConf.content);

    if(utils.file.exists(mkFile)){
        data.page.content = getSinglePageData(mkFile);
    }
    return data;
};

function getCodeDemo(html){
    var string = html,
        res = string.replace(/\<p\>\<code\>\n(.|\n)+?\<\/code\>\<\/p\>/ig, function(word){
            return word.replace(/\<p\>\<code\>/ig,'<pre><code class="language-javascript">').replace(/\<\/code\>\<\/p\>/ig,'</code></pre>');
        })
    return res;
}


function getSinglePageData(filePath){
    var fileContent = utils.file.read(filePath),
        fileData = parser(fileContent),
        fileCodeExamplePath,
        deleCommentsReg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
        info = {}, propertyArr = [], summaryTags = [];
   
    fileData.forEach(function(tag){
        var description,  property, propertyName, propertyType, methodName, params, examples = [], returns = [], platform;
        for(var name in tag){
            switch (name){
                case "providesModule":
                    info.module = info.module || tag[name];
                    info.name = tag[name];
                    info.title = tag[name];
                    break;
                case "type":
                    if(tag[name] == "class"){
                        summaryTags.push(tag);
                    }
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
                    var reg = /(\`{3}.*?(\r|\n)*)|((\n|.)*?\`{3}$)/g;
                    description = markdown.toHTML(tag[name].replace(/(\`{3}(\r|\n).*(\r|\n|.)*)(\`{3}$)/g,""));
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
                case "returns": 
                    returns = tag[name];
                    break;
                case "path":
                    fileCodeExamplePath = utils.path.join(currentPath, tag[name]);
                    if(utils.file.exists(fileCodeExamplePath)){
                        fileExampleContent = utils.file.read(fileCodeExamplePath);            
                        info.demo = fileExampleContent.replace(deleCommentsReg, function(word){
                            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word; 
                        }).replace(/\</ig, "&lt;").replace(/\>/ig, "&gt;");
                    }
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
        }if(methodName){
            info.methods.push({
                name: methodName,
                lead: lead || '',
                description: description,
                params: params || [],
                examples: examples,
                returns: returns
            });
        }
    });
    info.summarys = info.summarys || [];
    if(summaryTags && summaryTags.length){
        summaryTags.forEach(function(summaryTag){
            info.summarys.push(getCodeDemo(markdown.toHTML(summaryTag.comment.content)));
        });
    }
    return info;
};




module.exports = {
    getDoc: function(){
        var modules = config.project.modules || [],
            project = config.project,
            version = config.version,
            docConfig = {
                title: project.title,
                footer: project.footer,
                banner: project.banner,
                modules: modules.map(function(item) {
                    return item
                }),
                menu: project.modules
            },
            template = utils.file.read(defaultTemplate),
            render = artTemplate.compile(template);
        try{
            if(!utils.file.exists(destDir)){
                utils.dir.mk(destDir);
            }
            if(!utils.file.exists(utils.path.join(destDir,version))){
                utils.dir.mk(utils.path.join(destDir,version));
            }
            //if(!utils.file.exists(utils.path.join(destDir,'source'))){
                utils.dir.copySync(utils.path.join(rootPath,'source'),utils.path.join(destDir,'source'));
            //}
            
        }catch(e){
            utils.logger.error('创建 '+destDir+' 权限不足，请加 sudo 参数');
            return;
        }
        modules.forEach(function(module) {
            if(module.blocks && module.blocks.length){
                module.blocks.forEach(function(block){
                    var data;

                    if(block.type == "markdown"){

                        data = analyzeMD(block, docConfig);
                        fileName = utils.stringFormat("{0}.html",block.title);
                        utils.file.write(utils.path.join(destDir, version, fileName), render(data));

                    }else if(block.type == "js"){
                        data = analyzeJS(block, docConfig);
                        fileName = utils.stringFormat("{0}.html",block.title);
                        utils.file.write(utils.path.join(destDir, version, fileName), render(data));

                    }
                    
                });
            }
        });

        gutil.log(gutil.colors.green('生成目录:'+utils.path.join(process.cwd(),destDir)));
    }
}