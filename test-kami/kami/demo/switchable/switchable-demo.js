var $kami = require('../../scripts/util/index.js');
var Switchable = require('../../scripts/switchable/index.js');

$kami('#switchableBtn').one('tap',function(){
	window.switchable && window.switchable.destroy && window.switchable.destroy();
	window.switchable = new Switchable({
		container:'#switchtarget',
		indicator: true,
		auto : true,
		datasource:[
			{
				img:'http://img02.taobaocdn.com/imgextra/i2/420567757/TB2isO1bFXXXXXUXpXXXXXXXXXX-420567757.jpg_q50.jpg',
				href:'www.baidu.com'
			},{
				img:'http://i.mmcdn.cn/simba/img/TB1v8hQGXXXXXX1XXXXSutbFXXX.jpg_q502a.jpg',
				href:'www.baidu.com'

			},{
				img:'http://i.mmcdn.cn/simba/img/TB10J9OHXXXXXbUXFXXSutbFXXX.jpg_q50.jpg',
				href:'www.baidu.com'
			},{
				img:'http://gw.alicdn.com/tps/i1/TB12_iHHXXXXXaCXVXXdIns_XXX-1125-352.jpg_q50.jpg',
				href:'www.baidu.com'
			}
		],
		onaftermove : function(page) {
			console.log('page','aaa');
		}
	});
	window.switchable.render();
})
