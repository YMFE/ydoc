/**
 * @author sharon.li<xuan.li@qunar.com>
 */

window.Kami = window.Kami || {};
window.QApp.Kami = window.Kami;
window.kamiData = window.kamiData || {};
var QApp = window.QApp,
    _ = QApp.util;

var KamiAdapterFactory = _.KamiAdapterFactory = (function () {

    var defaultOptionsList = {};

    function setDefaultOptions(name, defaultOptions) {

        if (null == name) {
            return;
        } else {
            defaultOptionsList[name] = defaultOptions;
        }
    }


    function register(name, Clazz, defaultOptions) {
        if (!name && !_.isString(name)) {
            console.error('invalid param: name is must be parse and!!!');
            return;
        }
        //alert and confirm tips is singleton, so is plainObject;
        if (!Clazz && (!_.isFunction(Clazz) || !_.isPlainObject(Clazz))) {
            console.error('invalid param: name is must be parse and!!!');
            return;
        }

        if (!defaultOptionsList[name]) {
            defaultOptionsList[name] = {};
        }

        if (_.isPlainObject(defaultOptions)) {

            _.extend(defaultOptionsList[name], defaultOptions);
        }

        //是否是单例组件
        var isSingletonComponent = ['alert','confirm','tips','loading'].indexOf(name) > -1;


        //normal kami widget like select and so on
        if (!isSingletonComponent) {

            QApp.addWidget(name, function (element, opt, view) {
                //处理opt
                opt = opt || {};

                var widgetInstance = null;

                var defaultOpt = defaultOptionsList[name] || {};

                //当前view里的参数
                var viewOptions = {};

                //全局kamiData里的参数
                var kamiDataOptions = {};

                //特殊处理一下window.kamiData中的传参
                //为了兼容老版本的adapter里有通过kamiData传参处理
                var kamiData = window.kamiData;

                for (var key in opt) {
                    if (opt.hasOwnProperty(key)) {
                        var optValue = opt[key];
                        if (!kamiData.hasOwnProperty(optValue)) {
                            continue;
                        }
                        var kamiDataProperty = kamiData[optValue];
                        if (_.isFunction(kamiDataProperty)) {

                            kamiDataOptions[key] = (function () {
                                return function () {
                                    kamiDataProperty.apply(this, arguments);
                                };
                            }());
                        } else if (_.isPlainObject(kamiDataProperty)) {
                            kamiDataOptions[key] = _.extend(true, {}, kamiDataProperty);
                        } else if (_.isArrray(kamiDataProperty)) {
                            kamiDataOptions[key] = kamiDataProperty.slice(0);
                        } else {
                            //do Nothing
                            continue;
                        }
                    }
                }



                //老本版的QApp里面只有是html的节点才有可能有view
                //showWidget的时候是不会有view的
                //所以viewOptions只在有view的情况下才会去获取view的options
                //默认viewOptions是空数组
                if (view) {

                    //如果是从view的节点中创建的，并且存在element
                    //那么将element作为组件的容器
                    element && (viewOptions['container'] = element);

                    //需要在show里面可能会需要使用组件，所以在beforeShow的时候将组件初始化
                    //组件的选项在ready里面写
                    view.on('beforeShow', function () {
                        //特殊处理一下view的传参
                        //处理view的options，当通过html节点创建一个组件时,例如:
                        //<div class="" qapp-widget="switch" data-switch-id="isInvoice"
                        //  data-switch-value="0" data-switch-onchangevalue="onInvoiceChange">
                        //</div>
                        for (var key in opt) {

                            //过滤param, opt和view都默认带param
                            if ('param' !== key && opt.hasOwnProperty(key)) {

                                var optValue =  opt[key];


                                if (!view.hasOwnProperty(optValue)) {
                                    continue;
                                }

                                var viewProperty = view[optValue];
                                if (_.isFunction(viewProperty)) {

                                    viewOptions[key] = (function () {
                                        return function () {
                                            viewProperty.apply(this, arguments);
                                        };
                                    }());
                                } else if (_.isPlainObject(viewProperty)) {
                                    viewOptions[key] = _.extend(true, {}, viewProperty);
                                } else if (_.isArray(viewProperty)) {
                                    viewOptions[key] = viewProperty.slice(0);
                                } else {
                                    //do Nothing
                                    continue;
                                }
                            }
                        }
                        widgetInstance = _createInstance();
                        var widgetId = opt.id || 'widgets_' + setTimeout(1);
                        view.widgets[widgetId] = widgetInstance;

                    });
                    view.on('destroy', function () {
                        if (widgetInstance && widgetInstance.destroy) {
                            widgetInstance.destroy();
                            widgetInstance = null;
                        }
                    });
                }
                else {
                    widgetInstance = _createInstance();
                    return widgetInstance;
                }

                /**
                 * 创建私有的实例
                 * @return {Kami} 返回Kami实例
                 */
                function _createInstance() {

                    //get instance of clazz
                    //options的传质的优先级是
                    //1.view的options优先级最高
                    //2.window的kamiData
                    //3.节点上的options
                    //4.default默认的options
                    //
                    var _widgetInstance = new Clazz(
                        _.extend(
                            {},
                            defaultOpt,
                            opt,
                            kamiDataOptions,
                            viewOptions
                        )
                    );
                    //在QApp的Kami全局变量中，保存一份变量
                    QApp.Kami[name] = Clazz;
                    switch (name) {
                        case 'dialog':
                        case 'overlay':
                            _widgetInstance.show();
                            break;
                        default:
                            _widgetInstance.render();
                    }

                    return _widgetInstance;
                }

            });
        } else {
            //Kami 对 tip / alert / confirm / loading 提供了单例模式
            //使用 Alert.show
            var instance = QApp.Kami[name] = Clazz;
            QApp.addWidget(name, function (element, opt, view) {

                instance.show(opt);

                if (view) {
                    view.on('destroy', function () {
                        if (instance && instance.destroy) {
                            instance.destroy();
                            instance = null;
                        }
                    });
                }

                //showWidget的返回值
                return instance;
            });
        }

    }
    return {
        register: register,
        setDefaultOptions: setDefaultOptions
    };
}());
module.exports = KamiAdapterFactory;