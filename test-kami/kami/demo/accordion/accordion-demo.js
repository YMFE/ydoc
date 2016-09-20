window.$ = require('../../scripts/util/index.js');
var Accordion = require('../../scripts/accordion/index.js');

$(window).on('DOMContentLoaded',function(){
	var a = new Accordion({
		container:'#target'
	})
	a.render();

//TODO wrap 嵌套
	// var b = new Accordion({
	// 	container:'#accordion',
	// 	exclusive : false
	// })
	// b.render();

	// var c = new Accordion({
	// 	container:'#accordionChild',
	// 	exclusive:false
	// })
	// c.render();
})