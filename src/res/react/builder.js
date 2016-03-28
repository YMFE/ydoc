var parser = require('parse-comments'),
    docgen = require('react-docgen'),
    markdown = require('markdown').markdown,
    marked = require('marked'),
    artTemplate = require('art-template'),
    glob = require("glob"),
    gutil = require('gulp-util'),
    jsformatter = require('atropa-jsformatter'),
    utils = require('./utils.js');

var BASEPATH = process.cwd();
var docfile = utils.path.join(BASEPATH, 'docfile.config');
if(utils.file.exists(docfile)){
    var config = utils.file.readJson(docfile);
}else{
    utils.logger.error("docfile.config文件不存在!");
    process.exit (1);
}
var config = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));

var docgenHelpers = require('./docgenHelpers.js');

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
        data.page.content = marked(utils.file.read(mkFile));
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
function getNameFromPath(filepath) {
  var ext = null;
  while (ext = utils.path.extname(filepath)) {
    filepath = utils.path.basename(filepath, ext);
  }
  return filepath;
}
function getStyleList(filePath){
    var fileContent = utils.file.read(filePath),
        propsObj,type,
        html = '';

    var obj = docgen.parse(fileContent,docgenHelpers.findExportedObject,[
        docgen.handlers.propTypeHandler,
        docgen.handlers.propTypeCompositionHandler,
        docgen.handlers.propDocBlockHandler
      ]);

    if(obj.props){
        propsObj = obj.props;
        for (var name in propsObj){
            html += '<div class="style">';
            html += '<span class="style-title">'+ name +'</span>';
            type = propsObj[name]["type"];
            if(type.name == "enum"){
                html += '<span class="type"> enum(';
                if(type.value && typeof type.value == "object"){
                    type.value.forEach(function(val,i){
                      html +=  (i == type.value.length -1 ?  val.value : val.value + ',')
                    });
                }    
                html +=' )</span>';
            }else if(type.name == "custom"){
                html += '<span class="type">color</span>'
            }else if(type.name == "number"){
                html += '<span class="type">number</span>'
            }
            if(propsObj[name].description){
                var platforms = propsObj[name].description.match(/\@platform (.+)/);
                platforms = platforms && platforms[1].replace(/ /g, '').split(',');
                var description = propsObj[name].description.replace(/\@platform (.+)/, '');
                
                if(platforms){
                    html += '<span class="platform">'+ platforms + '</span>';
                }
                if(description){
                    html += marked(description);
                }
                
            }
            html += '</div>'
        }
    }
    return html;
    
}
function getSinglePageData(filePath){
    var fileContent = utils.file.read(filePath),
        fileData = parser(fileContent),
        fullDescription,
        fileCodeExamplePath,
        fileName = getNameFromPath(filePath),
        deleCommentsReg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
        info = {}, propertyArr = [], summaryTags = [];

    var docFilePath = './docs/'+ fileName +'.md';
    if(utils.file.exists(docFilePath)){
        fullDescription = marked(utils.file.read(docFilePath));
    }
    
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
                        lead = marked(tag[name]);
                    }
                    break;
                case "method":
                    methodName = tag[name];
                    break;
                // case "examples":
                //     if(tag[name].length){
                //         tag[name].forEach(function(example){
                //             examples.push(marked(example.code));
                //         });
                //     }
                //     break;
                case "description":
                    //var reg = /(\`{3}.*?(\r|\n)*)|((\n|.)*?\`{3}$)/g;
                    description = marked(tag[name]);
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
                case "style":
                    if(utils.file.exists(tag[name])){
                        info.styleLists = getStyleList(tag[name]);
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
                //examples: examples,
                platform: platform
            });
        }if(methodName){
            info.methods.push({
                name: methodName,
                lead: lead || '',
                description: description,
                params: params || [],
                //examples: examples,
                returns: returns
            });
        }
    });

    if(fullDescription){
        info.fullDescription = fullDescription;
    }
    info.summarys = info.summarys || [];
    if(summaryTags && summaryTags.length){
        summaryTags.forEach(function(summaryTag){
            info.summarys.push(marked(summaryTag.comment.content));
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
                        //if(block.title == "View"){
                            data = analyzeJS(block, docConfig);
                            fileName = utils.stringFormat("{0}.html",block.title);
                            utils.file.write(utils.path.join(destDir, version, fileName), render(data));
                        //}
                        
                    }
                    
                });
            }
        });

        gutil.log(gutil.colors.green('生成目录:'+utils.path.join(process.cwd(),destDir)));
    }
}