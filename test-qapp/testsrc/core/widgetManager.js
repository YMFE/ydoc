define('widgetM', function () {

    var widgets = QApp._widgets = {};

    return {
        /**
         * 添加组件
         *
         * @method QApp.widget.add
         * @category Widget
         * @alias QApp.addWidget
         * @core
         * @param {String} name 组件名
         * @param {Function} adapter 适配器
         * @param {Boolean|String} [isEvent] 是否由事件触发
         * @example
         * QApp.addWidget('some', function(element, opt, view) {
         *      todoSomething();
         * })
         * @explain
         * `isEvent` 是 `true` 或者是 事件名 (`tap`) 时为触发式组件，反之为渲染式组件
         */
        add: function (name, adapter, isEvent) {
            widgets[name] = {
                eventName: isEvent && (_isString(isEvent) ? isEvent : 'tap'),
                adapter: adapter
            };
        },
        /**
         * 检查组件是否存在
         *
         * @method QApp.widget.exists
         * @category Widget
         * @param {String} name 组件名
         * @return {Boolean} flag 是否存在
         */
        exists: function (name) {
            return !!widgets[name];
        },
        isEvent: function (name) {
            return !!widgets[name].eventName;
        },
        /**
         * 获取组件当前配置
         *
         * @method QApp.widget.get
         * @category Widget
         * @param {String} name 组件名
         * @return {Object} options 当前组件配置
         */
        get: function (name) {
            return widgets[name];
        },
        /**
         * 显示组件
         *
         * @method QApp.widget.show
         * @category Widget
         * @alias QApp.showWidget
         * @core
         * @param {String} name 组件名
         * @param {Element} [el] 节点
         * @param {Object} options 配置
         * @param {View} [view] 关联的视图
         * @return {Any} obj 组件返回的对象
         * @example
         * var widget = QApp.showWidget('searchlist', {
         *    onComplete: function() {
         *          todoSomething();
         *    }
         * });
         * @explain
         * 所需参数和返回的对象由组件的适配器决定
         */
        show: function (name, el, options, view) {
            if (widgets[name]) {
                if (_isElement(el)) {
                    return widgets[name].adapter(el, options, view);
                } else {
                    return widgets[name].adapter(NULL, el, options);
                }
            }
        }
    };

});
