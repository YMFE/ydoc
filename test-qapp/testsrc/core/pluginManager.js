define('pluginM', function () {

    var plugins = QApp._plugins = {},
        globalPlugins = [];

    return {
        /**
         * 增加插件
         *
         * @method QApp.plugin.add
         * @category Plugin
         * @alias QApp.addPlugin
         * @core
         * @param {String|Array<String>} name 插件名
         * @param {Object} options 默认配置
         * @param {Function} [adapter] 适配器
         * @example
         * QApp.addPlugin('some', someOpt, function(view, opt) {
         *      view.someAttr = someValue;
         *      return SomeObject;
         * });
         * @explain
         * `plugin` 可以通过监听生命周期事件来进行相关行为，也可以复写或增加视图的方法。
         */
        add: function (key, options, adapter) {
            var names = [].concat(key);
            names.forEach(function (name) {
                if (!plugins[name]) {
                    plugins[name] = {
                        options: options,
                        adapter: adapter
                    };
                } else {
                    //WARN 'Plugin "' + name + '" already exist.'
                }
            });
        },
        /**
         * 检测插件是否存在
         *
         * @method QApp.plugin.exists
         * @category Plugin
         * @param {String} name 插件名
         * @return {Boolean} flag 是否存在
         */
        exists: function (name) {
            return !!plugins[name];
        },
        /**
         * 获取插件当前配置
         *
         * @method QApp.plugin.get
         * @category Plugin
         * @param {String} name 插件名
         * @return {Object} options 当前配置
         */
        get: function (name) {
            return plugins[name];
        },
        /**
         * 设置插件当前配置
         *
         * @method QApp.plugin.setOpt
         * @category Plugin
         * @param {String} name 插件名
         * @param {Object} options 配置
         * @explain
         * 以 `extend` 的方式
         */
        setOpt: function (name, options) {
            if (plugins[name]) {
                _extend(TRUE, plugins[name].options, options);
            }
        },
        /**
         * 获取全局插件列表
         *
         * @method QApp.plugin.getGlobal
         * @category Plugin
         * @alias QApp.configPlugin
         * @return {Array} plugins 全局插件列表
         */
        getGlobal: function () {
            return globalPlugins;
        },
        /**
         * 设置全局插件
         *
         * @method QApp.plugin.setGlobal
         * @category Plugin
         * @alias QApp.setGlobalPlugins
         * @param {String|Array<String>} gPlugins 插件或列表
         * @explain
         * 内部逻辑是 `concat` 操作
         */
        setGlobal: function (gPlugins) {
            globalPlugins = globalPlugins.concat(gPlugins);
        }
    };
});
