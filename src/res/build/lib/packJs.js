/**
 * Created by eva on 15/10/13.
 */
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var formatter = require('atropa-jsformatter');
var fileUtil = require('../lib/fileUtil.js');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');
var gulp = require('gulp');
var through = require('through-gulp');
var utils = require('../../../utils.js');

var BASEPATH = process.cwd();
var config = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));



config.hidePrivate = true


var INFO_TYPE = {
    CLASS: 0,
    FUNCTION: 1,
    METHOD: 1,
    NAMESPACE: 2,
    UNKNOWN: -1,
    STATIC_OBJECT: 3,
    PROPERTY: 4,//属性
    EVENT: 5,//事件类型
    TEMPLATE:6
};
var HIDE_PRIVATE = config.hidePrivate;
var privateData = {
    'classList': [],
    'functionList': [],
    'staticFunList': [],
    'privateFunList': [],
    'namespaceList': [],
    'propertyList': [],
    'categoryList':[],
    'eventList': [],
    'templateList':[],
    'nameTypeMap': {}
};
function _reset(){
    HIDE_PRIVATE = config.hidePrivate;
    privateData = {
        'classList': [],
        'functionList': [],
        'staticFunList': [],
        'privateFunList': [],
        'namespaceList': [],
        'propertyList': [],
        'categoryList':[],
        'eventList': [],
        'templateList':[],
        'nameTypeMap': {}
    };
}

//按照require进行排序
function _compare(val1, val2){
    if(!!val1.require){
        return -1
    }else if(!!val2.require){
        return 1
    }else{
        return 0
    }
}
//根据所传的第一个参数为最高权限获取后一各参数的内容
function _getRidOf(target, auxiliary) {
    var a = [],
        res = [];
    target.forEach(function(item) {
        item && item.name && a.push(item.name);
    });
    var res = JSON.stringify(auxiliary.filter(function(item) {
        if (item && item.name) {
            return a.indexOf(item.name) === -1
        } else {
            return false;
        }
    }));
    var res = JSON.parse(res);
    res.forEach(function(item, index) {
        item.resource = item.memberOf;
    });
    return res;

}

//获取一个class的mixFunction和property
function _getMixinFunctionAndProperty(classOrNamespaceItem, property) {
    if (classOrNamespaceItem && classOrNamespaceItem.mixin && classOrNamespaceItem.mixin.length > 0) {
        var len = classOrNamespaceItem.mixin.length;
        for (var i = 0; i < len; i++) {
            var mixinName = classOrNamespaceItem.mixin[i];
            var type = privateData.nameTypeMap[mixinName];
            if (null != type) {
                var mixinClassItem = _getClassOrNamespaceByName(mixinName, type);

                switch (property) {
                    case 'function':
                        var mixinFunctions = _getMixinFunctionAndProperty(mixinClassItem, 'function');
                        classOrNamespaceItem['function'] = classOrNamespaceItem['function'] || [];
                        _.isEmpty(mixinFunctions) ? '' : mixinFunctions = _getRidOf(classOrNamespaceItem['function'], mixinFunctions);
                        classOrNamespaceItem['function'] = classOrNamespaceItem['function'] || [];
                        classOrNamespaceItem['function'] = classOrNamespaceItem['function'].concat(mixinFunctions);
                        classOrNamespaceItem['method'] = classOrNamespaceItem['function'];
                        break;
                    case 'property':
                        var mixin = _getMixinFunctionAndProperty(mixinClassItem, 'property');
                        _.isEmpty(mixin) ? '' : mixin = _getRidOf(classOrNamespaceItem['property'], mixin);
                        classOrNamespaceItem['property'] = classOrNamespaceItem['property'] || [];
                        classOrNamespaceItem['property'] = classOrNamespaceItem['property'].concat(mixin);
                        break;
                    case 'event':
                        break;
                }
            }

        }
    }
    return classOrNamespaceItem[property] || [];

}
//获取一个class的Extend的Function和property
function _getExtendFunctionAndProperty(classOrNamespaceItem, property) {
    if (classOrNamespaceItem && classOrNamespaceItem.extends && classOrNamespaceItem.extends.length > 0) {
        var len = classOrNamespaceItem.extends.length;
        for (var i = 0; i < len; i++) {
            var extendName = classOrNamespaceItem.extends[i];
            var type = privateData.nameTypeMap[extendName];
            if (null != type) {
                var extendClassItem = _getClassOrNamespaceByName(extendName, type);
                switch (property) {
                    case 'function':
                        var extendFunctions = _getExtendFunctionAndProperty(extendClassItem, 'function');
                        classOrNamespaceItem['function'] = classOrNamespaceItem['function'] || [];
                        _.isEmpty(extendFunctions) ? '' : extendFunctions = _getRidOf(classOrNamespaceItem['function'], extendFunctions);
                        classOrNamespaceItem['function'] = classOrNamespaceItem['function'].concat(extendFunctions);
                        classOrNamespaceItem['method'] = classOrNamespaceItem['function'];
                        break;
                    case 'property':
                        var extend = _getExtendFunctionAndProperty(extendClassItem, 'property');
                        _.isEmpty(extend) ? '' : extend = _getRidOf(classOrNamespaceItem['property'], extend);
                        classOrNamespaceItem['property'] = classOrNamespaceItem['property'] || [];
                        classOrNamespaceItem['property'] = classOrNamespaceItem['property'].concat(extend);
                        break;
                    case 'event':
                        break;
                    case 'template':
                        var extend = _getExtendFunctionAndProperty(extendClassItem, 'template');
                        _.isEmpty(extend)? '':extend = _getRidOf(classOrNamespaceItem['template'], extend);
                        classOrNamespaceItem['template'] = classOrNamespaceItem['template'] || [];
                        classOrNamespaceItem['template'] = classOrNamespaceItem['template'].concat(extend);
                        break;
                }
            }
        }
    }
    return classOrNamespaceItem[property] || [];
}

//根据名称和类型去获取class和namespace对象
function _getClassOrNamespaceByName(name, type) {
    var arr = [];
    switch (type) {
        case INFO_TYPE.CLASS:
            arr = privateData.classList;
            break;
        case INFO_TYPE.NAMESPACE:
            arr = privateData.namespaceList;
            break;
    }
    arr = arr.filter(function(item, index) {
        return item.name === name;
    });
    if (arr.length) {
        return arr[0];
    } else {
        return null;
    }
}

//根据tag名称生成指定的Info对象
function _generateInfoByTagname(tagSection){
    var info = {
        'type': INFO_TYPE.UNKNOWN,
        'name': '', //obj的名字 一般情况下是标志类型的标签的name属性
        'class': '',//构造函数名称
        'constructor': '',
        'staticObject': '',
        'namespace': '',
        'description': tagSection.description,
        'events': [], //提供的事件接口
        'propertys': [], //提供的属性
        'required': [], //需要的
        'extends': [], //集成的类
        'mixin': [], //混入的类
        'function': [], //当前类包含的function
        'params': [], //param
        'demo': '', //demo地址
        'example': '',//事例
        'memberOf': '',
        'staticFun':[],
        'path':'',
        'template':''

    };
    if(tagSection.tags.length){
        tagSection.tags.forEach(function(tags, index){  
            switch (tags.tag) {
                case 'namespace':
                    info.namespace = tags.name;
                    info.type = INFO_TYPE.NAMESPACE;
                    info.name = tags.name;
                    break;
                case 'class':
                case 'constructor':
                    if (tags.name) {
                        info.class = tags.name;
                        info.type = INFO_TYPE.CLASS;
                        info.name = tags.name;
                    }
                    break;
                case 'static':
                    info.static = true;
                    break;
                case 'extends':
                    if (!info.extends) {
                        info.extends = [];
                    }
                    info.extends = info.extends.concat(tags.name.split(','));
                    break;
                case 'mixin':

                    if (!info.mixin) {
                        info.mixin = [];
                    }
                    info.mixin = info.mixin.concat(tags.name.split(','));
                    break;
                case 'required':

                    if (!info.required) {
                        info.required = [];
                    }
                    var str = tags.name + tags.description;
                    info.required = info.required.concat(str.split(','));
                    break;
                case 'category':
                    info.category = tags.name;
                    break;
                case 'version':
                    info.version = tags.name;
                    break;
                case 'function':
                case 'method':
                    info.type = INFO_TYPE.FUNCTION;
                    info.params = info.params || [];
                    info.name = tags.name;
                    info.function = tags.name;
                    break;
                case 'return':
                    info['return'] = {
                        type: tags.type,
                        description: tags.name || tags.description,
                        name: tags.name
                    };
                    break;
                case 'param':
                    info.params = info.params || [];
                    info.params.push({
                        name: tags.name,
                        type: tags.type,
                        description: tags.description
                    });
                    break;
                case 'paramDetails':
                    info.paramDetails = info.paramDetails || [];
                    info.paramDetails.push({
                        name: tags.name,
                        type: tags.type,
                        description: tags.description
                    });
                    break;
                case 'memberOf':
                    info.memberOf = tags.name;
                    break;
                case 'demo':
                    info.demo = tags.name || tags.description
                    break;
                case 'example':
                    info.example = formatter(tags.source.substring(tags.source.indexOf('\n') + 1));
                    break;
                case 'object':
                    info.object = tags.name;
                    info.type = INFO_TYPE.STATIC_OBJECT;
                    info.name = tags.name;
                    break;
                case 'event':
                    info.params = info.params || [];
                    info.name = tags.name;
                    info.function = tags.name;
                    info.type = INFO_TYPE.EVENT;
                    break;
                case 'property':
                    var des = tags.description;
                    var a = des.indexOf('@require');
                    var obj = {
                        name: tags.name,
                        type: tags.type
                    };
                    if(a !== -1){
                        obj.require = true;
                        obj.description = des.slice(0,a).concat(des.slice(a+8));
                    }else{
                        obj.require = false;
                        obj.description = des;
                    }
                    info.type = INFO_TYPE.PROPERTY;
                    info.propertys = info.propertys || [];
                    info.propertys.push(obj);
                    break;
                case 'private':
                    info.private = true;
                    break;
                case 'template':
                    info.name = tags.name;
                    info.description = tags.description;
                    info.type = INFO_TYPE.TEMPLATE;
                    break;
                case 'path': 
                    if(info.memberOf){
                        info.path = tags.name;
                        info.content = fs.readFileSync(info.path ,'utf8');
                        break;
                    }else{
                        console.log(info.name + '配置失效，请将memberOf 写在path之前')
                    }
            }
        });
    }
    return info;
}

//将所有的tagSection处理后的info对象进行分类push到privateData对象中
function _classifyInfoObj(info){
    switch (info.type) {
        case INFO_TYPE.EVENT:
            privateData.eventList.push(info);
            break;
        case INFO_TYPE.PROPERTY:
            privateData.propertyList.push(info);
            break;
        case INFO_TYPE.CLASS:
            if (HIDE_PRIVATE && info.private) {
                break;
            }
            privateData.classList.push(info);
            privateData.nameTypeMap[info.name] = info.type;
            break;
        case INFO_TYPE.NAMESPACE:
            if (HIDE_PRIVATE && info.private) {
                break;
            }
            privateData.namespaceList.push(info);
            privateData.nameTypeMap[info.name] = info.type;
            break;
        case INFO_TYPE.FUNCTION:
            if (info.static) {
                privateData.staticFunList.push(info);
            } else if (info.private) {
                privateData.privateFunList.push(info);
            } else {
                privateData.functionList.push(info);
            }
            break;
        case INFO_TYPE.TEMPLATE:
            privateData.templateList.push(info);
            break;
    }
}


//目标文件使用comment解析并且归类至privateData对象
function _generatePrivateData(item) {
    var filesAllTags = commentParser(item);
    
    //演示test.js
    // fs.writeFile('test.json', JSON.stringify(filesAllTags), function(err){
    //     if(err)throw err;
    //     console.log("It's save");
    // })
    
    if (!filesAllTags.length) {
        console.info('目标文件不包含可以解析的注释，请核对文件路径');
        return;
    }
    filesAllTags.forEach(function(tagSection, index) {
        _classifyInfoObj(_generateInfoByTagname(tagSection));
    });
}


// 添加包含参数的title 针对函数和事件
function _addTitle(functionList){
    functionList.forEach(function(fun, index) {
        var paramArr = [];
        fun.params.forEach(function(param, index) {
            paramArr.push(param.name);
        });
        fun.title = fun.name + '(' + paramArr.join(', ') + ')';
    });
}

//遍历privateData对象的属性获取属于该构造函数|命名空间的内容
function _choseProperty(classProperty, classItem){
    var dir = {
        'function' : 'functionList',
        'staticFun': 'staticFunList',
        'privateFun': 'privateFunList',
        'event': 'eventList',
        'template': 'templateList',
        'property': 'propertyList'
    }
    var privateDataName = dir[classProperty];
    classItem[classProperty] = classItem[classProperty] || [];
    var arr = privateData[privateDataName].filter(function(item, index) {
        return item.memberOf === classItem.name;
    });
    if(classProperty == 'property'){
        arr.forEach(function(obj, index) {
            _.extend(classItem[classProperty], obj['propertys'])
        })
    }else{
        classItem[classProperty] = classItem[classProperty].concat(arr)
    }
    return classItem[classProperty];
};

//整理并输出Class以及NameSpace类型
function parseJS() {
    
    _addTitle(privateData.functionList);
    _addTitle(privateData.staticFunList);
    _addTitle(privateData.privateFunList);
    _addTitle(privateData.eventList);

    //【生成Class Object】
    privateData.classList.forEach(function(classItem, index) {
        _choseProperty('function', classItem);
        _choseProperty('staticFun', classItem);
        _choseProperty('event', classItem);
        _choseProperty('template', classItem);
        _choseProperty('property', classItem);
        if(!HIDE_PRIVATE){
            _choseProperty('privateFun', classItem);
        }
    });

    //【生成Namespace Object】
    privateData.namespaceList.forEach(function(namespaceItem, index) {
        _choseProperty('function',namespaceItem);
        _choseProperty('property',namespaceItem);
    });

    //获得classList的mixin和extend
    privateData.classList.forEach(function(classItem, index) {
        if (classItem.extends.length !== 0) {
            _getExtendFunctionAndProperty(classItem, 'function');
            _getExtendFunctionAndProperty(classItem, 'event');
            _getExtendFunctionAndProperty(classItem, 'property');
        }
        if (classItem.mixin.length !== 0) {
            _getMixinFunctionAndProperty(classItem, 'function');
            _getMixinFunctionAndProperty(classItem, 'event');
            _getMixinFunctionAndProperty(classItem, 'property');
        }
        //按照重要性进行排序
        classItem['property'].sort(_compare);
    });
    //获得namespace的mixin
    privateData.namespaceList.forEach(function(namespaceItem, index) {
        _getMixinFunctionAndProperty(namespaceItem);
    });
    var resultList = privateData.classList.concat(privateData.namespaceList);

    //将组件按照类别进行分类
    var categories = {};
    resultList.forEach(function(item){
        var a = item.category ? item.category : 'default';
        var category = categories[a] || [];
            category.push(item);
        categories[a] = category;
    });
    for (var i in categories){
        privateData.categoryList.push({
            categoryName: i,
            classList: categories[i],
            //title: config.categoryDir[i]
        })
    }

    return {
        list:privateData.categoryList
    }
}

//左侧目录生成名字
function _generateCategoryItem(item, list, itemName){
    var aliasObj = {
        'function': '',
        'staticFun': 'static',
        'privateFun': 'private',
        'event': 'event'
    }
    var alias = aliasObj[itemName];
    if (item[itemName] && item[itemName].length) {
        item[itemName].forEach(function(cont, index) {
            if (cont && cont.name) {
                list.push({
                    name: item.name + '-' + cont.name + (alias ? '-'+ alias : ''),
                    title: cont.name + (alias ? '('+ alias +')': '')
                });
            }
        });
    }
}

function packdoc() {
    var result = {
        menu: [
            //{
            //    title: '',
            //    name: ''
            //}
        ],
        page: [
            //{
            //    type: '',
            //    title: '',
            //    name: '',
            //    content: ''
            //}
        ]
    };

    var OUTPUT_FILE_TYPE = {
        HTML: 'html',
        JS: 'js',
        CSS: 'css'
    };

    var stream = through(function(file, encoding, callback) {
        var htmlStr, jsStr, that = this;
        var html = file.contents.toString('utf-8');
        _generatePrivateData(html);
        var content = parseJS();
        var sidebar = [];
        content.list.forEach(function(category, index) {
            var categoryItem = {
                title: category.title,
                name: category.categoryName,
                classList: []
            };
            category.classList.forEach(function(item, index){
                var list = [];
                if (item.type === INFO_TYPE.CLASS || item.type === INFO_TYPE.NAMESPACE) {
                    if (item.property && item.property.length) {
                        list.push({
                            name: item.name + '-property',
                            title: '属性'
                        });
                    }
                    _generateCategoryItem(item, list, 'event');
                    _generateCategoryItem(item, list, 'function');
                    _generateCategoryItem(item, list, 'staticFun');
                    _generateCategoryItem(item, list, 'privateFun');

                }
                var str;
                item.type === INFO_TYPE.NAMESPACE ? str = '命名空间' : str = '组件';
                categoryItem.classList.push({
                    title: item.name + str,
                    name: item.name,
                    list:list
                })
            });
            sidebar.push(categoryItem);
        });
        var page = {
            type: OUTPUT_FILE_TYPE.JS,
            title: "组件API",
            name: "widget",
            content: content,
            sidebar: sidebar,
            menu: config.project.pages
        };

        var data = {
            page: page,
            title: 'Kami',
            footer: 'Kami',
            banner: {
                title: 'Kami',
                description: '为移动而生的组件库'
            },
            menus: config.project.pages
        };

        file.contents = new Buffer(JSON.stringify(data));
        that.push(file);
        callback();
        _reset();
        // for(var i in privateData){
        //     privateData[i] =[];
        // }
    });
    return stream;
}

module.exports = packdoc;