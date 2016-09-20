var $kami = require('../../scripts/util/index.js');
var Switch = require('../../scripts/switch/index.js');


$kami('#switchBtn').one('tap',function(){
	
	window.switchFirst = new Switch({
		container : '#switchtarget',
		name : 'options',
		value : '1',
		form : 'a'
	});
	window.switchFirst.render();

	window.switchSecond = new Switch({
		container : '#switchtarget',
		name : 'options',
		value : '2',
		form : 'a'
	});
	window.switchSecond.render();

	window.switchthird = new Switch({
		container : '#switchtarget',
		name : 'options',
		value : '3',
		form : 'a'
	});
	window.switchthird.render();
});
