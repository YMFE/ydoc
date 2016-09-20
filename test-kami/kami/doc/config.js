module.exports = {
	"menu": [{
		"name": "info",
		"title": "简介",
		"type": "html"
	}, {
		"name": "startup",
		"title": "起步",
		"type": "markdown"
	}, {
		"name": "widget",
		"title": "组件API",
		"type": "js"
	}, {
		"name": "tool",
		"title": "工具",
		"type": "markdown"
	}, {
		"name": "devspecification",
		"title": "开发规范",
		"type": "markdown"
	}, {
		"name": "history",
		"title": "历史",
		"type": "markdown"
	}],
	"categoryDir": {
		"tool": "工具组件",
		"primary": "基础组件",
		"core": "核心库",
		"business": "业务组件",
		"default": "未分类组件"
	},
	"outputpath": "./docsite",
	"templatedirepath": "./template/**/*",
	"templatepath": "./template/__template.html",
	"markdowndir": "./document/**/*.markdown",
	"JsSource": ["../scripts/**/*.js", "!**/index.js"],
	// "JsSource": "./src/alert.js",
	// "JsSource": "./src/test.js",
	"kamipath": "../",
	"hidePrivate": true,
}