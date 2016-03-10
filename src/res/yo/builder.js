var parser = require('comment-parser'),
    markdown = require('markdown').markdown,
    artTemplate = require('art-template'),
    glob = require("glob"),
    gutil = require('gulp-util'),
    utils = require('../../utils.js');

var BASEPATH = process.cwd();

var config = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));


artTemplate.config('escape', false);

var rootPath = __dirname,
    currentPath = process.cwd(),
    webSiteUrl = config.webSiteUrl || "http://ued.qunar.com/mobile/yo/doc/",
    destDir = utils.path.resolve(config.destDir),
    staticDir = utils.path.join(destDir,'static'),
    staticUrl = utils.stringFormat('{0}/static/',webSiteUrl),
    defaultTemplate = config.template_scss || utils.path.join(__dirname, 'template/template.html'),
    staticTemplate = config.template_static || utils.path.join(__dirname,'template/static.html');

function analyzePage(pageConf, docConf) {

    var data = {
        doc: docConf,
        name: pageConf.name,
        title: docConf.title + ' ' + pageConf.title,
        banner: pageConf.banner || docConf.banner,
        footer: docConf.footer,
        html: false,
        menu: [],
        content: []
    };

    if (pageConf.content &&
        utils.file.exists(utils.path.resolve(pageConf.content)) &&
        pageConf.type && pageConf.type === 'markdown') {        
        var content = utils.file.read(utils.path.resolve(pageConf.content));
        data.html = markdown.toHTML(content);
    }else if (pageConf.type && pageConf.type == 'scss') {
         var block = pageConf;
        //pageConf.blocks.forEach(function (block) {
            if (block.content) {
                
                data.html = false;
                var curdata = formatData(utils.path.resolve(block.content));
                var enddataHTML = buildData(curdata);

                data.menu.push({
                    name: '核心API',
                    list:[]
                });

                data.content.push({
                    type:'scss',
                    content:enddataHTML
                });
                
            }
        //});
    }
    return data;
}

function formatData(dirPath){
    //最终输出结果
    var result = {},
        // 所有元素变为同级
        exp01 = [],
        curdata = fileListSync(dirPath);

    curdata.forEach(function(item){
        if(item.length)
        {
            item.forEach(function(item0){
                exp01.push(item0);
            });
        }
    });

    // 筛选出 有module 的情况,exp02存放所有无module数据,module01存放有module数据未分类
    var exp02 = [], module01 = [];
    exp01.forEach(function(item){
        if(item.moduleid){
           module01.push(item);
        }else{
           exp02.push(item);
        }
    });

    //module01 分类
    var m_group01={};
    module01.forEach(function(item){
        if(m_group01[item.moduleid]){
            m_group01[item.moduleid].push(item);
        }else{
            m_group01[item.moduleid]=[];
            m_group01[item.moduleid].push(item);
        }
    });

    // module 按有class 无class 分类完成
    var module02 = {};
    for(var i in m_group01){
        //mc_group01[i]=[];
        module02[i] = [];
        //console.log('resultmodule==='+resultmodule[i]);
        var mc_Group01 = {}, mClass01 =[], mcOther =[];
        m_group01[i].forEach(function(item){
            //每个module下区分有class 无class
            if(item.class){
                mClass01.push(item);
            }else{
                mcOther.push(item);
            }
            mc_Group01.mclass = mClass01;
            mc_Group01.mcOther = mcOther;
        })
        module02[i] = mc_Group01;

    }
    //处理module 下 class 分组
    var module03 ={},module04 ={};
    for(var i in module02){
        var mc03_group ={},mclass03={};
        for(var j in module02[i]){
            if(j == 'mcOther'){
                mc03_group.mcOther = module02[i].mcOther;
            }else{
                module02[i].mclass.forEach(function(item){
                    if(mclass03[item.class]){
                        mclass03[item.class].push(item);
                    }else{
                        mclass03[item.class]=[];
                        mclass03[item.class].push(item);
                    }
                });
                mc03_group.mclass = mclass03;
            }
        }
        module03[i] = mc03_group;
        module04 = module03;
    }
    result.pModules = module04;
    //处理无module数据 有class 无class
    var exp03 = [],class01 = [];
    exp02.forEach(function(item){
        if(item.class){
            class01.push(item);
        }else{
            exp03.push(item);
        }
    });
    result.others = exp03;

    //处理一级为 class 分组
    var c_group01 = {};
    class01.forEach(function(item){
        if(c_group01[item.class]){
            c_group01[item.class].push(item);
        }else{
            c_group01[item.class]=[];
            c_group01[item.class].push(item);
        }
    });
    result.pClasses = c_group01;
    return result;
}


function buildData(data){
    var result={},
        leftHtml = "",
        rightHtml = [];

    for(var i in data){
        if(i == "pModules"){
            var othersleftHTML = [],
                otherrightHTML = [];
            for(var j in data[i]){
                 othersleftHTML .push('<div id="'+j+'" class="groupVisible"> 第一级'+j+'</div>');
                 otherrightHTML.push('<li><a href="#'+j+'">'+j.replace("module","")+'</a><ul class="nav">')
                for(var k in data[i][j]){
                    if(k == "mcOther")
                    {
                        othersleftHTML.push(joinleftHTML(data[i][j][k]));
                        otherrightHTML.push(joinrightHTML(data[i][j][k]));
                    }else if(k == "mclass"){
                         for(var z in data[i][j][k]){
                             otherrightHTML.push('<li><a href="#'+z+'">'+z+'</a><ul class="nav">');
                             othersleftHTML .push('<div id="'+z+'" class="groupVisible">第三级'+z+'</div>');
                             othersleftHTML.push(joinleftHTML(data[i][j][k][z]));
                             otherrightHTML.push(joinrightHTML(data[i][j][k][z]));
                             otherrightHTML.push('</ul></li>');
                         }
                    }
                }
                 otherrightHTML.push('</ul></li>');
            }
            leftHtml += othersleftHTML.join('');
            rightHtml += otherrightHTML.join('');


        }else if(i == "pClasses"){
            var othersleftHTML = [],otherrightHTML = [];
            othersleftHTML .push('<div id="'+i+'" class="groupVisible">'+i+'</div>');
            for(var j in data[i]){
                othersleftHTML .push('<div id="'+j+'" class="groupVisible">'+j+'</div>');
                othersleftHTML.push(joinleftHTML(data[i][j]));
                otherrightHTML.push('<li><a href="#'+j+'">'+j+'</a><ul class="nav">')
                otherrightHTML.push(joinrightHTML(data[i][j]));
                otherrightHTML.push('</ul></li>');
            }
            leftHtml += othersleftHTML.join('');
            rightHtml += otherrightHTML.join('');
        }else if(i == "others"){

            var othersleftHTML = [],otherrightHTML = [];
            othersleftHTML .push('<div id="'+i+'" class="groupVisible">'+i+'</div>');
            othersleftHTML.push(joinleftHTML(data[i]));
            otherrightHTML.push(joinrightHTML(data[i]));
            leftHtml += othersleftHTML.join('');
            rightHtml += otherrightHTML.join('');
        }
    }

    result.leftHtml = leftHtml;
    result.rightHtml = rightHtml;
    return result;
}

function joinrightHTML(dataobj){
    var singleHTML = [];
    dataobj.forEach(function(dataitem){
       singleHTML.push('<li><a href="#dataitem-'+dataitem.name +'">'+ dataitem.name+'</a></li>');
    });
    return singleHTML.join('');
}

function joinleftHTML(dataobj){
    var singleHTML =[];
    dataobj.forEach(function(dataitem){
        singleHTML.push('<div class="docs-section">');
        if(dataitem.name){
            singleHTML.push('<h1 id="dataitem-'+dataitem.name+'" class="page-header">'+dataitem.name);
            if(dataitem.methodParams){
                if(dataitem["function"]){
                    singleHTML.push('<span class="yo-badge yo-badge-success">Function</span>');
                }else{
                    singleHTML.push('<span class="yo-badge yo-badge-success">Mixin</span>');
                }
            }
            
            singleHTML.push('</h1>');
        }
        singleHTML.push('<div>');
        if(dataitem.curPath){
            singleHTML.push('<p class="source-file"><small class="text-muted">源文件：</small> <a href="'+dataitem.defindin+'#doc'+dataitem.line+'" target="_blank">'+dataitem.curPath+':'+dataitem.line+'</a></p>');
        }
        if(dataitem.version){
            singleHTML.push('<p><small class="text-muted">版本号：</small><i>'+dataitem.version+'</i></p>');
        }
        if(dataitem.private){
            singleHTML.push('<p><small class="text-muted">是否为私有：</small><em>'+dataitem.private+'</em></p>');
        }
        singleHTML.push('</div>');
       if(dataitem.description){
            singleHTML.push('<p><small class="text-muted">描述信息：</small>'+dataitem.description+'</p>');
       }
       if(dataitem.demo){
           singleHTML.push('<p><small class="text-muted">demo：</small><a href="'+dataitem.demo+'" target="_blank">查看示例</a></p>');
       }
       if(dataitem.params.length>0){
            singleHTML.push('    <p>');
            singleHTML.push('        <small class="text-muted">参数:</small>');
            singleHTML.push('    </p>');
            singleHTML.push('<div class="docs-table">');
            singleHTML.push(' <table class="yo-table yo-table-border">');
            singleHTML.push('    <colgroup>');
            singleHTML.push('       <col class="c1">');
            singleHTML.push('      <col class="c2">');
            singleHTML.push('      <col class="c3">');
            singleHTML.push('      <col class="c4">');
            singleHTML.push('  </colgroup>');
            singleHTML.push('    <thead>');
            singleHTML.push('       <tr>');
            singleHTML.push('            <th>参数名</th>');
            singleHTML.push('            <th>类型</th>');
            singleHTML.push('            <th>描述</th>');
            singleHTML.push('            <th>版本支持</th>');
            singleHTML.push('      </tr>');
            singleHTML.push('</thead>');
            singleHTML.push('<tbody>');
            dataitem.params.forEach(function(param){
                if(param.delversion){
                    singleHTML.push(' <tr title="此属性已经在'+param.delversion+'这个版本删除">');
                    singleHTML.push('   <td><del>'+param.name+'</del></td>');
                    singleHTML.push('   <td><del>'+param.type+'</del></td>');
                    singleHTML.push('   <td><del>'+param.description+'</del></td>');
                    singleHTML.push('   <td>');
                    singleHTML.push(param.version);
                    singleHTML.push('        <del> '+param.delversion+' </del>');
                    singleHTML.push('    </td>');
                    singleHTML.push('</tr>');
                }else if(param.version){
                    singleHTML.push(' <tr>');
                    singleHTML.push('     <td>'+param.name+'</td>');
                    singleHTML.push('     <td>'+param.type+'</td>');
                    singleHTML.push('     <td>'+param.description+'</td>');
                    singleHTML.push('     <td>');
                    singleHTML.push(param.version);
                    singleHTML.push('     </td>');
                    singleHTML.push('</tr>');
                }
            });

            singleHTML.push(' </tbody>');
            singleHTML.push('</table></div>');
       }
       if(dataitem.example){
            singleHTML.push('<div class="docs-section"><p><small class="text-muted">示例（代码形式）:</small></p>');

                singleHTML.push('<div class="example-code">');
                if(dataitem.example.name){
                    singleHTML.push('<p class="example-desc">'+dataitem.example.name+'</p>');
                }
                if(dataitem.example.code){
                    singleHTML.push('<pre class="brush: sass;">'+dataitem.example.code+'</pre>');
                }
                singleHTML.push('</div>');
            singleHTML.push('</div>');
       }
       singleHTML.push('</div>');

    });
    return singleHTML.join('');
}

/**
 * 读取目录下的所有文件
 *
 * @param dirPath
 * @returns {Array} 文件名集合
 */
function fileListSync(dirPath){

    var ret = [],
        files = glob.sync(dirPath);
    files.forEach(function(filePath){
        ret.push(getSingleData(filePath));
    });

    return ret;
}

/**
 * 单个scss文件生成
 *
 * @param
 * @return single data
 */
function getSingleData(filePath) {
    var fileContent = utils.file.read(filePath),
        singleData = [],
        ret = parser(fileContent),
        staticFileName = utils.path.basename(filePath).replace(".scss",".html");
    renderStaticFile(fileContent,staticFileName);
    // 本页有几处注释块
    if (ret.length) {
        ret.forEach(function(comment) {
            var paramlist = [],
                methodparams = [],
                result = {},
                tags = comment.tags,
                description = comment.description;
            try{
                if(tags.length > 0) {
                    tags.forEach(function (tag) {
                        switch (tag.tag) {
                            case 'module':
                                result.moduleid = "module"+tag.name;
                                result.type = "mudule";
                                result.parentId = "0";
                                break;
                            case 'class':
                                result.class = tag.name;
                                break;
                            case 'skip':
                                result.skip = tag.tag;
                                break;
                            case 'description' :
                                result['description'] = tag.name;
                                break;
                            case 'demo':
                                result['demo'] = tag.name;
                                break;
                            case 'version':
                                result['version'] = tag.name;
                                break;
                            case 'link':
                                result['link'] = tag.name;
                                break;
                            case 'private':
                                result['private'] = tag.tag;
                                break;
                            case 'public':
                                result['public'] = tag.tag;
                                break;
                            case 'class':
                                result.categray = tag.name;
                                break;
                            case 'method':
                                result['name'] = tag.name;
                                result['line'] = tag.line;
                                break;
                            case 'function':
                                result['function'] = tag.name;
                                result['name'] = tag.name;
                                result['line'] = tag.line;
                                break;
                            case 'param':
                                var desc,sversion,delversion;
                                if(/([^{}]*)/.test(tag.description)){
                                     desc =  tag.description.match(/([^{}]*)/)[1];
                                    if(/\{add\:([^{}]+)\}/.test(tag.description)){
                                        sversion = tag.description.match(/\{add\:([^{}]+)\}/)[1];
                                    }
                                    if(/\{del\:([^{}]+)\}/.test(tag.description)){
                                        delversion = tag.description.match(/\{del\:([^{}]+)\}/)[1];
                                    }
                                }
                                paramlist.push({
                                    name: tag.name,
                                    type: tag.type,
                                    optional: tag.optional,
                                    description: desc,
                                    version: sversion,
                                    delversion: delversion
                                });
                                methodparams.push(tag.name);
                                break;
                            case 'example':
                                var example = tag.source,examplename,examplecode;
                                if(tag.source.replace("@example","").indexOf("|")>0){
                                    examplename = tag.source.replace("@example","").split("|")[0]
                                    examplecode = tag.source.replace("@example","").split("|")[1]
                                }else{
                                    examplecode = tag.source.replace("@example","");
                                }
                                result['example']={
                                    name: examplename,
                                    code: examplecode.replace(/\</ig, '&lt;')
                                };
                                break;
                        }
                    });

                    result.methodParams = methodparams.join(', ');
                    result['params'] = paramlist;
                    //显示源文件路径 ../lib/ani/
                    result.curPath = filePath.replace(currentPath,'');
                    result.defindin = './static/' + staticFileName;
                    result.basename = utils.path.basename(filePath).split('.')[0];
                    if(!result.skip){
                        singleData.push(result);
                    }
                }
            } catch(e) {
                console.log('Error', description, e);
            }
        });
    }
    return singleData;
}


/**
 * 得到静态文件
 *
 * @param
 * @return single data
 */
function renderStaticFile(fileContent,fileName){

    var templateHTML = utils.file.read(staticTemplate),
        render = artTemplate.compile(templateHTML),
        project = config.project || [],
        data = render({
            title: project.title,
            banner: project.banner,
            footer: project.footer,
            name: fileName.replace(".html",""),
            statichtml:fileContent
        }),
        filePath = utils.path.join(staticDir,fileName);

    utils.file.write(filePath,data);
}

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

        var pages = config.project.pages || [],
            docConfig = {
                title: config.project.title,
                footer: config.project.footer,
                banner: config.project.banner,
                pages: pages.map(function(item) {
                    return item
                })
            },
            template = utils.file.read(defaultTemplate),
            render = artTemplate.compile(template);

        pages.forEach(function(item) {
            if(item.type){
                var data = analyzePage(item, docConfig),
                    fileName = utils.stringFormat("{0}.html",item.name);
                utils.file.write(utils.path.join(destDir,fileName), render(data));
            }
        });

        gutil.log(gutil.colors.green('生成目录:'+utils.path.join(process.cwd(),destDir)));
    }
}