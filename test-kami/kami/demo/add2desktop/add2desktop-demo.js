window.$ = require('../../scripts/util/index.js');
var Add2desktop = require('../../scripts/add2desktop/index.js');

$(window).ready(function(){

	window.add2desktop = new Add2desktop();
	window.add2desktop.render();
	window.add2desktop.show();
})