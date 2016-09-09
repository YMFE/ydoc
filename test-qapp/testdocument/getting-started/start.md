# 从零开始搭建一个X1项目

## 一些需要了解的背景知识

* `Hy`是一套移动端整体解决方案，包括前端部分（即`X1`）和客户端部分（即`Hytive`）。
* `X1`[（文档）](http://ued.qunar.com/mobile/)主要包括移动前端框架`QApp`、组件`Kami`、样式`Yo`三部分。
* `Hytive`[（文档）](http://hy.qunar.com/)是一套移动端跨平台开发方案，在app应用中提供了供h5运行的多webview环境和可以供js调用native的接口（简称`桥`）。`Hytive`还提供了一套打包机制，可以将线上的html/js/css打包用于预置或下载。这样可以加快页面的加载速度，也可以避免HTTP劫持。
* 在前端工程中，可以直接调用`桥`，但是推荐使用`QunarAPI`封装好的接口来调用`桥`。

## 1. 项目的构建

推荐使用`qmb工具`[（文档）](http://ued.qunar.com/mobile/qmb/)进行项目的初始化和配置，它会自动生成目录结构和配置文件。

1. 打开`qmb`页面 <http://ued.qunar.com/mobile/qmb/>，启动服务`fekit qmb run`
2. 『构建』→『新建项目』
3. 『构建』→『QApp』→『添加』/『删除』/『升级』QApp组件（项目内会默认引用`QApp`和`QApp-Hy`）
4. 『构建』→『Kami』→『添加』/『删除』/『升级』Kami组件
5. 『构建』→『Yo』→『添加』/『删除』/『升级』Yo组件

这样一个X1项目就构建好了，目录如下。之后的开发和调试方式就跟常规fekit项目一样了。

	+--fekit_modules  // fekit模块，包括QApp、QApp-Hy以及其他QApp插件
	+--src
	|  +--html  // 页面载体，方便本地调试
	|  +--kami  // Kami组件
	|  +--scripts 
	|  |  +--config
	|  |  |  |
	|  |  |  +kami.js  // Kami的引用和配置文件
	|  |  |  +qapp.js  // QApp的引用和配置文件
	|  |  |  +viewport.js 
	|  |  +--views // 业务逻辑代码
	|  |  +app.js  // 代码入口
	|  |  +common.js  // 用来引入config
	|  +--yo   
	|     +--lib
	|     +--usage
	|        +--core
	|        +--element
	|        +--fragment
	|        +--layout
	|        +--module
	|        +--page
	|        +--widget
	+--fekit.config  // fekit配置
	+--kami.config   // kami配置
	+--README.md

**P.S.**

1. 如果是已有的项目而非新项目没法使用`qmb`，想要自己构建，请参照【附录1】。
2. `fekit qmb run`相当于`fekit server`的加强版，提供了构建项目和管理项目组件的功能，近期将推出`qmb2`，功能更强大。

## 2. 业务逻辑的编写

### 2.1 业务逻辑的入口

项目的入口为/src/scripts/app.js，主要为`QApp-Hy`的配置，也就是决定了业务代码是如何来适配`Hytive`框架的。

`Hytive`提供两种类型的webview：带header的、不带header的。对于业务来说，页面上都是需要header的，主要区别体现在配置上，带header的webview需要为header配置显示内容。

**P.S.**

1. 是否使用header可以通过webViewType来进行配置，也可以针对每个view单独配置。
2. header的配置参见[文档](http://hy.qunar.com/source/qunarapi.html#附录-附录1 - 导航栏选项)
3. QApp-Hy的更多详细配置参见[QApp-Hy文档](http://ued.qunar.com/mobile/docs/qapp/hybird.html#QApp-Hy)

代码如下:

	// 第一种：默认使用native的header的配置方式
	QApp.hy.config({
		indexView: 'index', // 主view，必须配置
		viewOptions: { // 所有view的配置
			'index': {
				nav: { // Hytive header的配置，API: <http://hy.qunar.com/source/qunarapi.html#附录-附录1 - 导航栏选项>
					title: {
						style: 'text',
						text: '标题'
					},
					left: {
						style: 'icon',
						icon: 'f001'
					},
					right: {
						style: 'text',
						text: '分享'
					}
				}
			},
			'list': { 
				nav: {
					type: 'navibar-none' // 可以单独的view配置是否使用header
				}
			}
		}
	});

	// 第二种：不使用native的header的配置方式
	QApp.hy.config({
		indexView: 'index',
		webViewType: 'navibar-none', // 默认为 navibar-normal，使用view
		viewOptions: {
			'list': {
				nav: { // Hytive header的配置，API: <http://hy.qunar.com/source/qunarapi.html#附录-附录1 - 导航栏选项>
					type: 'navibar-normal', // 可以单独的view配置是否使用header
					title: {
						style: 'text',
						text: '标题'
					},
					left: {
						style: 'icon',
						icon: 'f001'
					},
					right: {
						style: 'text',
						text: '分享'
					}
				}
			}
		}
	});


### 2.2 view的基本写法

一个view的完整配置项写法如下：


	QApp.defineView('viewName', { // 【viewName是view的唯一标识，推荐使用命名空间的方式，aaa.bbb.ccc】
	    html: '', // view模板
	    classNames: ['class1', 'class2'], // 给视图根节点view.root添加的样式
	    attrs: {
	        'data-some': 'qunar'
	    }, // 给视图根节点view.root添加的属性
	    styles: {
	        'background-color': 'red'
	    }, // 给视图根节点view.root添加的样式
	    plugins: [ // 插件配置，这里列出了一些常用插件
	        'ajax',
	        'scroll',
	        'delegated',
	        'doms', {
	            name: 'hogan',
	            options: {
	                xxxInfo: { // 模块名
	                    container: '.xxx',
	                    appendType: 'inner',
	                    template: ''
	                }
	            }
	        }
	    ],
	    init: { // 给视图实例添加属性和方法，直接用view.xxx来调用
	        someValue: '',
	        doSomething: function() {
	            // this指向当前view实例
	        }
	    },
	    modules: [{ // 嵌套配置，【当view里面嵌套view的时候使用，比如通用的tab】
	        name: 'module', // 名称
	        defaultTag: 'someView', // 默认 tag
	        container: '.module-container', // 容器
	        views: [
	            'someView1', {
	                tag: 'someName2',
	                view: 'someView2'
	            }
	        ]
	    }],
	    bindEvents: { // 视图生命周期事件绑定
	        'show': function() {
	            // this指向当前view实例
	            // 业务逻辑不推荐写在ready里，尤其是涉及到dom操作的，推荐写在show里，因为show是在view的打开动画完成之后，这样就不会影响动画的性能了】
	        },
	        'actived': function() {
	            // this指向当前view实例
	            // view每次打开或者激活的时候会触发

	            var preView = QApp.router.getPreViewName(); // 获取上一个viewName的方法，用来判断是从哪个页面回来的
	        },
	        'receiveData': function(data) {
	            // this指向当前view实例
	            // 当QApp.open打开的view传东西回来时会触发

	            var preView = data.view, //  上一个view的name
	                params = data.data; //  上一个view带回来的数据
	        },
	        'beforeHide': function() {
	            // 一些需要手动销毁的内容可以放在这里
	            // plugin们都是会自己销毁的
	        }
	    },
	    bindActions: { // 当引用了delegated时，可以通过这种方式，给页面上action-type="xxx"的dom绑定事件（也就是一种方便的绑定事件的方式，并且是通过delegate来实现的，不用担心是否已经渲染什么的）
	        'xxx': function(dom, data) { // 默认的绑定是tap事件
	        },
	        'yyy:click': function(dom, data) { // 可以通过:eventType的方式指定事件类型         
	        }
	    },
	    ready: function() { // 视图创建完成的回调
	        // this指向当前view实例
	        // 【业务逻辑不推荐写在ready里，尤其是涉及到dom操作的，推荐写在show里，因为show是在view的打开动画完成之后，这样就不会影响动画的性能了】
	    }
	});

当然，一个简单的view其实不用配置那么多属性，一般也就是：

	QApp.defineView('viewName', { 
	    html: '',
	    plugins: ['ajax', 'scroll', 'delegated'], 
	    init: {
	        someValue: '',
	        doSomething: function() {
	        }
	    },
	    bindEvents: {
	        'show': function() {
	        },
	        'actived': function() {
	        },
	        'receiveData': function() {
	        }
	    },
	    bindActions: { 
	    },
	    ready: function() {}
	});

**之后会在`qmb`工具中提供一些常用的view模板来迅速构建特定类型的view。**

### 2.3 view之间的跳转和数据传递

除了view的定义，最重要的就是view之间的调用和数据传递了。

view之间的跳转都是通过`QApp.router`来实现的，常用的方法包括：

* QApp.show = QApp.router.show：打开
* QApp.router.back：后退
* QApp.router.backTo：后退到
* QApp.router.goto：跳转到（没有打开则打开，打开了就后退到）
* QApp.router.home：回到indexView
* QApp.router.exit：退出项目

view之间的数据传递是通过`QApp.router.xxx(viewName, options)`和`view.hide(data)`来实现的。一个简单的例子如下：

	var _ = QApp.util;

	var html = require('./tpl/index.string');

	QApp.defineView('a', {
		html: html,
		bindEvents: {
			'show': function() {
				QApp.logger.debug('A: show');
			},
			'actived': function() {
				QApp.logger.debug('A: actived');
			},
			'deactived': function() {
				QApp.logger.debug('A: deactived ')
			},
			'receiveData': function(data) {
				QApp.logger.debug('A: receive data:', data);
			}
		},
		ready: function() {
			var me = this;

			// 打印携带参数
			console.log('携带参数：')
			console.log(me.param)

			me.root.querySelector('#hide').addEventListener('tap', function() {
				// 通过 View.hide(data) 方法实现返回前一个历史，并传数据
				me.hide({
					from: 'a',
					action: 'hide'
				})
			});
		}
	});

	QApp.defineView('b', {
		html: html,
		bindEvents: {
			'show': function() {
				QApp.logger.debug('B: show');
			},
			'actived': function() {
				QApp.logger.debug('B: actived');
			},
			'deactived': function() {
				QApp.logger.debug('B: deactived ')
			},
			'receiveData': function(data) {
				QApp.logger.debug('B: receive data:', data);
			}
		},
		ready: function() {
			var me = this;
			me.root.querySelector('#exit').addEventListener('tap', function() {
				// 通过 QApp.open() 方法 实现跳转
				QApp.router.exit()
			});
		}
	});

	QApp.defineView('c', {
		html: html,
		bindEvents: {
			'show': function() {
				QApp.logger.debug('C: show');
			},
			'actived': function() {
				QApp.logger.debug('C: actived');
			},
			'deactived': function() {
				QApp.logger.debug('C: deactived ')
			},
			'receiveData': function(data) {
				QApp.logger.debug('C: receive data:', data);
			}
		}
	});

	QApp.defineView('index', {
		html: html,
		// 配置 嵌套
		bindEvents: {
			'show': function() {
				QApp.logger.debug('index: show');
			},
			'actived': function() {
				QApp.logger.debug('index: actived');
			},
			'deactived': function() {
				QApp.logger.debug('index: deactived ')
			},
			'receiveData': function(data) {
				QApp.logger.debug('index: receive data:', data);
			}
		},
		ready: function() {
			var me = this;

			me.root.querySelector('#goto1').addEventListener('tap', function() {
				// 通过 QApp.open() 方法 实现跳转
				QApp.open('a', {
					param: {
						from: 'base',
						to: 'a',
						by: 'Qapp.router.goto'
					}
				})
			});

			me.root.querySelector('#open1').addEventListener('tap', function() {
				// 通过 QApp.open() 方法 实现跳转
				QApp.open('a')
			});
			me.root.querySelector('#open2').addEventListener('tap', function() {
				// 通过 QApp.open() 方法 实现跳转
				QApp.open('a', {
					param: {
						from: 'base',
						to: 'a',
						by: 'QApp.open'
					}
				})
			});
		}
	});


### 2.4 QunarAPI

在`Hy`框架中，是通过`QunarAPI`来调用h5和native之间的`桥`的。

`QunarAPI`[（文档）](http://hy.qunar.com/source/qunarapi.html)需要在fekit.config中添加依赖然后安装，在项目里`require('QunarAPI');`来引入。

**P.S.**

所有的API的引用必须放在`QunarAPI.ready`的回调中，

	QunarAPI.ready(function() { // 【不放在回调里后果自负啊！！！】
	    QunarAPI.hy.login({
	        shouldOpenLogin: true,
	        success: function(ret) {
	        },
	        fail: function() {
	        }
	    });
	});

## 3. 一些开发中遇到的坑

待完善。

## 附录1 自己构建X1项目

### 1.1 构建目录结构

目录结构如下：

	+--fekit_modules  // fekit模块，包括QApp、QApp-Hy以及其他QApp插件
	+--src
	|  +--html  // 页面载体，方便本地调试
	|  +--kami  // Kami组件
	|  +--scripts 
	|  |  +--config
	|  |  |  |
	|  |  |  +kami.js  // Kami的引用和配置文件
	|  |  |  +qapp.js  // QApp的引用和配置文件
	|  |  |  +viewport.js 
	|  |  +--views // 业务逻辑代码
	|  |  +app.js  // 代码入口
	|  |  +common.js  // 用来引入config
	|  +--yo   
	|     +--lib
	|     +--usage
	|        +--core
	|        +--element
	|        +--fragment
	|        +--layout
	|        +--module
	|        +--page
	|        +--widget
	+--fekit.config  // fekit配置
	+--kami.config   // kami配置
	+--README.md

### 1.2 QApp的引用

1. 在fekit.config中配置依赖，用fekit install安装。

配置如下:

	{
		"dependencies": {
			"QApp": "*",
			"QApp-Hy": "*",
			"QApp-plugin-ajax": "*",
			"QApp-plugin-basic": "*",
			"QApp-plugin-delegated": "*",
			"QApp-plugin-doms": "*",
			"QApp-plugin-hogan": "*",
			"QApp-plugin-jsonp": "*",
			"QApp-plugin-scroll": "*",
			"QApp-plugin-storage": "*"
		}
    }

2. 在配置文件（/src/scripts/config/qapp.js）中引用和配置。

脚本如下:

	require('QApp');
	require('QApp-Hy');
	require('QApp-plugin-ajax');
	require('QApp-plugin-basic');
	require('QApp-plugin-delegated');
	require('QApp-plugin-doms');
	require('QApp-plugin-hogan');
	require('QApp-plugin-jsonp');
	require('QApp-plugin-scroll');
	require('QApp-plugin-storage');

	// QApp全局配置，API：http://ued.qunar.com/mobile/docs/qapp/api.html#QApp-	config
	QApp.config({}); 

	**注：`QApp`和`QApp-Hy`是必须要引用的，其他的是一些常用的插件，使用方法见[API文档](http://ued.qunar.com/mobile/docs/qapp/plugins.html)。**

### 1.3 Kami的引用

1. 安装fekit的`kami插件`（[文档](http://ued.qunar.com/mobile/kami//tool/build/)），或fekit的`qmb`插件。

2. 在kami.config中配置依赖，用fekit kami -i或fekit qmb kami -i安装。

配置如下:

	{
		"scripts": {
			"datepicker": "*",
			"list": "*",
			"loading": "*",
			"numbers": "*",
			"suggest": "*",
			"switch": "*",
			"tips": "*",
			"adapter-qapp": "*" //Kami针对QApp的adapter，必须引用
		}
	}

3. 在fekit.config中配置Kami的别名。

配置如下:

	{
		"alias": {
    		"Kami": "./src/kami"
		},
	}

4. 在配置文件（/src/scripts/config/kami.js）中引用和配置。

脚本如下:

	// Import
	var KamiCalendar = require('Kami/adapter/qapp/src/calendar.js');
	var KamiDatepicker = require('Kami/adapter/qapp/src/datepicker.js');
	var KamiNumbers = require('Kami/adapter/qapp/src/numbers.js');
	var KamiSuggest = require('Kami/adapter/qapp/src/suggest.js');
	var KamiSwitch = require('Kami/adapter/qapp/src/switch.js');
	var KamiTips = require('Kami/adapter/qapp/src/tips.js');

	// Config
	window.Kami = window.Kami || {};
	window.Kami.disableTapEvent = true;
	window.Kami.theme = 'yo';

### 1.4 引入qapp和kami的配置

1. 在/src/scripts/common.js中引用qapp和kami的配置文件。

脚本如下:

	require('./config/qapp.js');
	require('./config/kami.js');

2. 在/src/scripts/app.js中引用common.js。

脚本如下:

	require('common.js');
	
## 附录2 参考文档和资源

* X1的文档：<http://ued.qunar.com/mobile/>
* Hytive的文档：<http://hy.qunar.com/>
* Kami的文档：<http://ued.qunar.com/mobile/kami/>
* Yo的文档：<http://ued.qunar.com/mobile/yo/demo/>
* QunarAPI的文档：<http://hy.qunar.com/source/qunarapi.html>
* QApp的文档：<http://ued.qunar.com/mobile/docs/qapp/>
* QApp-Hy的文档：<http://ued.qunar.com/mobile/docs/qapp/hybird.html>
* QApp的插件文档：<http://ued.qunar.com/mobile/docs/qapp/plugins.html>
	
		
	

	
	
	
	




