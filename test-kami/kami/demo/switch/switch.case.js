var expect = chai.expext;
var $ = require('../../scripts/utill/index.js');


describe('switchOne', function(){
	$('#switchBtn').click();
	it('#the input after inionlize state should be false', function(){
		expect(window.switchOne.get('state') == 'false');
	})
});