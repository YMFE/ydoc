//=======================================================================
//             _________       _          _________    __________
//           / ________ /    /   \       |  _____  |  |  _____  |
//          / /      / /    / / \ \      | |     | |  | |     | |
//         / /  Q   / /    / / A \ \     | |  P  | |  | |  P  | |
//        / /  __  / /    / /_____\ \    | |_____| |  | |_____| |
//       / /___\ \/ /    /  _______  \   |  _______|  |  _______|
//      /________  /    / /         \ \  | |          | |
//               \_\   /_/           \_\ |_|          |_|
//
// QApp Mobile Framework
// Copyright (c) 2014-2015 Edwon Lim and other contributors in YMFE.
// WebSite: http://ymfe.tech
//
// 去哪儿平台移动组荣誉出品，Created By 林洋
//
// qapp.js *Version* build at *Date* By Edwon.lim (edwon.lim@gmail.com)
//======================================================================

/**
 * QApp 版本
 *
 * @category Base
 * @property QApp.version
 * @type {String}
 * @value "*Version*"
 */
var QApp = {
        version: '*Version*'
    },
    _packages = QApp._packages = {}; // 存放 package

// 预赋值，利于压缩
var win = window,
    doc = document,
    TRUE = true,
    FALSE = false,
    NULL = null,
    UNDEFINED = void 0;

// 定义包
function define(space, factory) {
    _packages[space] = factory();
}

// 引用包 require
// 为了避免和 fekit 冲突，所以不用 require
function r(space) {
    return _packages[space];
}

// 标签列表
var Tags = {
    app: 'qapp-app',
    view: 'qapp-view',
    widget: 'qapp-widget',
    role: 'qapp-role'
};
