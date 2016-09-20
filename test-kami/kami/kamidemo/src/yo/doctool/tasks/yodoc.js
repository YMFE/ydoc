// 注释解析器
var fs = require('fs'),
    sysPath = require('path'),
    parser = require('comment-parser'),
    markdown = require('markdown').markdown,
    artTemplate = require('art-template'),
    readline = require('readline'),
    fsUtil = require('./fs-util');
var MODULEVERSON;
    artTemplate.config('escape', false);
// artTemplate.helper('anchor', function(name) {
//     return name ? name.replace(/[\.\:]/g, '-') : '';
// });

// artTemplate.helper('txt', function(html) {
//     return html ? html.replace(/\<\/?[^\>]*\>/g, '') : '';
// });

function getType(fileName) {
    var extName = sysPath.extname(fileName);
    switch (extName) {
        case '.md':
        case '.markdown':
            return 'markdown';
        case '.js':
            return 'js';
        case '.scss':
        case '.sass':
            return 'sass'
    }
}


var path,outdir,staticdir,templatedir,statictemplate,lib = {},page = {};
var config = sysPath.join(sysPath.resolve('./'),'cssdoc.json');
if(!fs.existsSync(config)) {
    console.log(config + "不存在,请检查配置文件cssdoc.json");
}else {
   var libdata =JSON.parse(fs.readFileSync(config,'utf-8'));
    if(libdata.options){
        path = libdata.options.paths ? sysPath.resolve(libdata.options.paths) : './lib';
        outdir = libdata.options.outdir ? sysPath.resolve(libdata.options.outdir) : './doc';
        staticdir = sysPath.join(outdir,'static');
        templatedir = sysPath.resolve(libdata.options.template);
        statictemplate= sysPath.resolve(libdata.options.statictemplate);
    };


    // page
    //if(libdata.pages){
    //    console.log("libdata.pages");
    //    console.log(libdata.pages);
    //}

}
function getconfigdata(data){
    var title = data.title,
        footer = data.footer,
        dest = data.dest,
        template = data.template,
        pages = data.pages || [];
    var docConfig = {
        title: title,
        footer: footer,
        pages: pages.map(function(item) {
            return {
                name: item.name,
                title: item.title
            }
        })
    };

    var template = fs.readFileSync(sysPath.resolve(template)),
        templateHTML = template.toString('utf-8'),
        render = artTemplate.compile(templateHTML);

    pages.forEach(function(conf) {

        var data = analyzePage(conf, docConfig);
        //localStaticFile = sysPath.join(staticdir,staticbasename);
        writeDoc(sysPath.join(outdir, data.name + '.html'), render(data));
        //writeDoc(sysPath.join(dest, data.name + '.html'), render(data));
        //grunt.file.write(sysPath.join(dest, data.name + '.html'), render(data));
        return data;
    });
}
if(!fs.existsSync(outdir)){
    fs.mkdirSync(outdir);
}
if(!fs.existsSync(staticdir)){
    fs.mkdirSync(staticdir);
}

//console.log('config==='+config);
//console.log('path=='+path);
//console.log('outdir=='+ outdir);
//console.log('staticdir==' + staticdir);
//console.log('statictemplate==' + statictemplate);

/**
 * 多页面配置
 *
 * @param pageConf
 * @param docConf
 *
 */
function analyzePage(pageConf, docConf) {
    var data = {
        doc: docConf,
        name: pageConf.name,
        title: docConf.title + ' ' + pageConf.title,
        banner: pageConf.banner,
        html: false,
        menu: [],
        content: []
    };

    // &&fs.exists(sysPath.resolve(pageConf.content))
    if (pageConf.content && fs.existsSync(sysPath.resolve(pageConf.content)) && getType(pageConf.content) == 'markdown') {
        //console.log(fs.exists(thepath));
        data.html = markdown.toHTML(fs.readFileSync(sysPath.resolve(pageConf.content),'utf-8'));
    }else if (pageConf.blocks && pageConf.blocks.length) {
        pageConf.blocks.forEach(function (block) {
            if (block.content && fs.existsSync(sysPath.resolve(block.content))) {
                if(block.type && block.type == "scss")
                {
                    data.html = false;
                    var curdata = formattData(sysPath.resolve(block.content));
                    var enddataHTML = buildData(curdata);
                        //console.log("enddataHTML==="+enddataHTML);
                        data.menu.push({
                            name: '核心API',
                            list:[]
                            //list: cores.map(function(core) {
                            //    return {
                            //        api: true,
                            //        name: core.id,
                            //        tag: 'core-' + core.id,
                            //        alias: core.alias,
                            //        description: core.description
                            //    };
                            //})
                        });
                    data.content.push({
                        type:'scss',
                        content:enddataHTML
                    });

                }
                else{
                    switch (getType(block.content)) {
                        case 'markdown':
                            data.menu.push({
                                name: block.name,
                                list: []
                            });
                            data.content.push({
                                type: 'html',
                                name: block.name,
                                tag: block.name,
                                content: markdown.toHTML(fs.readFileSync(sysPath.resolve(block.content)))
                            });
                            break;
                    }
                }
            }
        });
    }
    return data;
}



/**
 * 生成doc文件
 *
 * @param
 * 入口函数
 */
function getDoc(){
    getconfigdata(libdata);
    var sourcePath = sysPath.join(sysPath.dirname(templatedir),'source');
        fsUtil.copySync(sourcePath,sysPath.join(outdir,'source'));
    //// build(data);
    //useTemplate(curdata);
}

/**
*  按指定格式输出数据
*
*/
function formattData(dirPath){
    //最终输出结果
    var result = {};
    // 所有元素变为同级 
    var exp01 = [];
    var curdata = fileListSync(dirPath);
    //console.log("======curdata======");
    //console.log(curdata);
    curdata.data.forEach(function(item){
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
    //console.log('result ======= ');
    //console.log(result);
    return result;
}


function buildData(data){
    var result={}, leftHtml = "",rightHtml = [];
    //console.log('data=======');
    //console.log(data);
    for(var i in data){
        if(i == "pModules"){
            var othersleftHTML = [],otherrightHTML = [];
                //othersleftHTML .push('<div>module module '+i+'</div>');
            for(var j in data[i]){
                 othersleftHTML .push('<div id="'+j+'" class="groupVisible"> 第一级'+j+'</div>');
                 otherrightHTML.push('<li><a href="#'+j+'">'+j.replace("module","")+'</a><ul class="nav">')
                for(var k in data[i][j]){
                    //othersleftHTML .push('<h6 style="color:#ff5050;border-bottom:1px solid #ff5050;">第二级'+k+'</h6>');
                    if(k == "mcOther")
                    {
                        othersleftHTML.push(joinleftHTML(data[i][j][k]));
                        otherrightHTML.push(joinrightHTML(data[i][j][k]));
                    }else if(k == "mclass"){
                         for(var z in data[i][j][k]){
                             otherrightHTML.push('<li><a href="#'+z+'">'+z+'</a><ul class="nav">');
                             //othersleftHTML .push('<h6 id="'+z+'" style="color:#ff5050;border-bottom:1px solid #ff5050;">第三级'+z+'</h6>');
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
            //console.log('leftHtml='+ leftHtml);
        }
    }

    result.leftHtml = leftHtml;
    //console.log('left======'+leftHtml);
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
/**
* dataobj[{},{}]
*/
function joinleftHTML(dataobj){
    var singleHTML =[];
    dataobj.forEach(function(dataitem){
        singleHTML.push('<div class="docs-section">');
        if(dataitem.name){ 
            singleHTML.push('<h1 id="dataitem-'+dataitem.name+'" class="page-header">'+dataitem.name);
            if(dataitem.methodParams){
                // singleHTML.push('<span class="text-muted text-extend"> ( '+dataitem.methodParams+' ) </span>');
                singleHTML.push('<span class="yo-badge yo-badge-success">Method</span>');
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
            singleHTML.push('            <th>属性版本支持</th>');
            singleHTML.push('      </tr>');
            singleHTML.push('</thead>');
            singleHTML.push('<tbody>');
            dataitem.params.forEach(function(param){
              singleHTML.push(' <tr>');
              singleHTML.push('        <td>'+param.name+'</td>');
              singleHTML.push('        <td>'+param.type+'</td>');
              singleHTML.push('        <td>'+param.description+'</td>');
              singleHTML.push('        <td>');
              if(param.version){
                   singleHTML.push(param.version);
              }
              if(param.delversion){
                   singleHTML.push(' <del> '+param.delversion+' </del>');
              }
              singleHTML.push('</td>');
              singleHTML.push('   </tr> ');
            
            });
            
            singleHTML.push(' </tbody>');
            singleHTML.push('</table></div>');
            
              // singleHTML.push('    <table class="table">');
              // singleHTML.push('        <tr class="active">');
              // singleHTML.push('            <th>参数名</th>');
              // singleHTML.push('            <th>类型</th>');
              // singleHTML.push('            <th>描述</th>');
              // singleHTML.push('            <th>属性版本支持</th>');
              // singleHTML.push('        </tr>');
              // dataitem.params.forEach(function(param){
              //     singleHTML.push(' <tr>');
              //     singleHTML.push('        <td>'+param.name+'</td>');
              //     singleHTML.push('        <td>'+param.type+'</td>');
              //     singleHTML.push('        <td>'+param.description+'</td>');
              //     singleHTML.push('        <td>');
              //     if(param.verison){
              //          singleHTML.push(param.verison);
              //     }
              //     singleHTML.push('</td>');
              //     singleHTML.push('   </tr> ');

              // });
              // singleHTML.push('</table></div>');
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

var exp = {};
exp.data =[];
function fileListSync(dirPath){
    if (isDirSync(dirPath)) {
        files = fs.readdirSync(dirPath);
        files.forEach(function(file){
            var curPath = sysPath.join(dirPath,file);
            fileListSync(curPath);
        });
    }else{
        if(dirPath.indexOf('.scss') > -1){
            exp.data.push(getSingleData(dirPath,staticdir));
            //exp.data.push(getfileData(dirPath));
        }
    }
    return exp;
}

/**
 * 是否为目录
 *
 * @param file
 * @returns {Boolean}
 */
function isDirSync(file) {
    return fs.lstatSync(file).isDirectory();
}

/**
 * 单个scss文件生成
 *
 * @param
 * @return single data
 */
function getSingleData(filePath,staticdir) {
    var scssBuffer = fs.readFileSync(filePath);
    var docFile = scssBuffer.toString('utf8');
    var staticbasename = sysPath.basename(filePath).replace(".scss",".html")
    renderStaticFile(docFile,staticbasename);
    defindin = sysPath.join(staticdir,staticbasename);
    // 存放数组

    var singleData = [];
    // singleData.methods= [];
    // 获取本页注释块
    var ret = parser(docFile);
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
                        // console.log('tag=========');
                        // console.log(tag);
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
                                    code: examplecode
                                };
                                break;
                        }
                    });
                    
                    result.methodParams = methodparams.join(', ');
                    result['params'] = paramlist;
                    result.curPath = filePath;
                    result.defindin =  defindin || "";
                    result.basename = sysPath.basename(filePath).split('.')[0];
                    // console.log("result tag =========");
                    // console.log(result);
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
function renderStaticFile(file,staticbasename){

    var template = fs.readFileSync(statictemplate),
        templateHTML = template.toString('utf-8'),
        render = artTemplate.compile(templateHTML);
    var tempAccount = render({
        statichtml:file
    }),localConfigFile;

    localStaticFile = sysPath.join(staticdir,staticbasename);
    writeDoc(localStaticFile,tempAccount);
}

/**
 * render模板
 *
 * @param data 传入数据
 * @param path
 */
function useTemplate(data,path){
    var template = fs.readFileSync(templatedir),
        templateHTML = template.toString('utf-8'),
        render = artTemplate.compile(templateHTML);
    var tempAccount = render(data),localConfigFile;
    localConfigFile = sysPath.join(outdir,'index.html');
    writeDoc(localConfigFile,tempAccount);
    var sourcePath = sysPath.join(sysPath.dirname(templatedir),'source');
    fsUtil.copySync(sourcePath,sysPath.join(outdir,'source'));
    console.log(sourcePath);
}

/**
 * 指定生成目录写入文件
 *
 * @param path
 * @param data
 */
function writeDoc(Path,data) {
    fs.writeFile(Path,data,function(err) {
        if(err) {
            console.log('写文件' + Path + '操作失败,请重新发布');
        }
    });

}

module.exports = {  
    getDoc: getDoc  
}



