var Rating = require('../../scripts/rating/index.js');

var $ = require('../../scripts/util/index.js');

// var now = new Date();
// now.setFullYear(1995);
// now.setMonth(0);
// now.setDate(1);

// var end = new Date();
// end.setFullYear(2035);
// end.setMonth(11);
// end.setDate(31);
document.addEventListener('DOMContentLoaded', function () {

    // $('#fromDefault').on('tap', function () {

    // });
    var rating = new Rating({
        container: '#canlendarWrap',
        readonly: true
    });
    rating.render();

    
    var rating1 = new Rating({
        container: '#canlendarWrap1',
        cur: 3,
        total: 5
        
    });
    rating1.on('changevalue', function(value) {
        console.log('curValue=' + value);
    });
    rating1.render();

    // // var str = 'isRender';
    // window.rating = rating;
    // window.rating1 = rating1;
    
    
    setTimeout(function () {
        rating.setValue(4);
    }, 2000);


    var customTpl = '<!--ddd-->' +
            '<div class="yo-rating">' +
            '<h3 class="index" data-role="curIndex"></h3>' +
            '{{#each list as item}}' +
            '<span class="item" index="{{item.index}}" data-role="item"><i></i></span>' +
            '{{/each}}' +
        '</div>';

    var rating3 = new Rating({
        container: '#canlendarWrap2',
        cur: 2,
        // total: 5,
        template: customTpl
        
    });
    rating3.render();


    
    // document.querySelector('#error').innerHTML = str;

    // var div1 = document.createElement('DIV');
    // div1.className = 'yo-rating';
    // var arr = [];
    // arr.push('<span class="index" style="width:20%" data-role="curIndex"></span>');
    // for (var i = 0;i < 5; i++) {
    //     arr.push('<span class="item"></span>');
    // }
    // div1.innerHTML = arr.join('');
    // document.getElementById('canlendarWrap1').appendChild(div1);
    // var div2 = document.createElement('DIV');
    // div2.className = 'yo-rating';
    // document.getElementById('canlendarWrap2').appendChild(div2);


});

// window.setTimeout(function(){
//         window.location.reload();
//     }, 5000); 
