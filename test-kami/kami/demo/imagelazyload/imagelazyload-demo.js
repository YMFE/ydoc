var $= require('../../scripts/util/index.js');
var Imagelazyload = require('../../scripts/imagelazyload/index.js');


$(window).on('load',function(){

	var imglazyLoad = new Imagelazyload({
		container: '#target',
		iscroll: false
	});
});
