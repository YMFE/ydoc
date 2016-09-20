var $kami = require('../../scripts/util/index.js');
var GoTop = require('../../scripts/gotop/index.js');


var li = [];
for(var i = 1; i<41; i++){
	li[i] = '<li>第'+i+'行</li>';
}
$kami('#target').html(li.join(''));

var top = new GoTop({
	container : "#container1"
});
top.render();



var lis =[];
for(var i = 0;i<41;i++){
	lis[i] = {text:i}
}

window.myscroll = new Scroll({
	datasource : lis,
	container : '#container2',
	onAfterMove: function(y){

	}
})
window.myscroll.render();

var top = new GoTop({
	container: '#container2',

})