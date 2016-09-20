var Slider = require('../../scripts/slider/index.js');

window.onload =  function(){
	window.slider = new Slider({
		defaultValue: [3, 5],
		dataSource:[
                {
                    value: 1,
                    text: '1星级'
                },{
                    value: 2,
                    text: '2星级'
                },{
                    value: 3,
                    text: '3星级'
                },{
                    value: 4,
                    text: '4星级'
                },{
                    value: 5,
                    text: '5星级'
                }

            ],
		container: '#sliderContainer',
        label:false,
        disable: false,
        between: false,
        minRange: 0,
        onafterstart:function(){
            document.getElementById('error').innerHTML +='<p>start</p>';
        },
        onaftermove:function(){
            document.getElementById('error').innerHTML +='<p>move</p>';
        },
        onafterend:function(){
            document.getElementById('error').innerHTML +='<p>end</p>';
        }
	});
	window.slider.render();
}