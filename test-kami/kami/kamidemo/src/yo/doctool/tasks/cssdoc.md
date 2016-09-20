### 注释规范
    /**
     * @module 一级分类 module
     * @class 二级分类
     * @skip 是否解析改注释块,有此标签为不解析
     * @method 方法名
     * @description 描述信息
     * @demo demo描述 demo地址（空格区分）
     * @param {type} $name param描述 &版本支持 （空格区分，版本号为&区分）
     * @param {Color} {type} $name param描述 &版本支持  #废除不推荐版本 （空格区分 版本号为&区分 废除不推荐版本为#区分）
     * @private 改方法是否标示为私有
     * @version 此method在yo的哪个版本以上支持
     * @example example描述|example code （|区分）
     */

### 注释参考示例
    /**
     * @module ani
     * @class fade
     * @skip
     * @method yo-checked
     * @description 构造单选多选的自定义使用方法，可同时作用于 checkbox 与 radio
     * @demo 使用方法，详见 http://doyoe.github.io/Yo/demo/element/yo-checked.html
     * @param {String} $name 为新的扩展定义一个名称
     * @param {String} $content 标记（对勾，圆点或者任意字符，可以是webfonts的编码）
     * @param {Length} $size 元件大小 &1.1.0
     * @param {Length} $font-size 标记大小 &1.1.0
     * @param {Length} $border-width 边框厚度
     * @param {Color} $bordercolor 边框色
     * @param {Color} $bgcolor 背景色
     * @param {Color} $color 标记色
     * @param {Color} $on-bordercolor 选中时的边框色
     * @param {Color} $on-bgcolor 选中时的背景色
     * @param {Color} $on-color 选中时的标记色 &1.1.0+ 

     * @param {Length} $radius 圆角半径长度
     * @private
     * @demo dfasdfas http://doyoe.github.io/Yo/demo/element/yo-checked.html
     * @version 1.1.1
     * @example 实例代码描述拓展yo-checked | @include .yo-checked(
     *   $name: default,
     *   $content: default,
     *   $size: default,
     *   $on-bgcolor: default)
     *
     */