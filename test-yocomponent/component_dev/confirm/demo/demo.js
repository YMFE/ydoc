'use strict';

import Confirm from '../src';

let btn = document.querySelectorAll('.demo');

btn[0].addEventListener('click', function() {
    console.log('confirm')
    Confirm('the confirm content', 'no title')
        .then(
            function(res) {console.log('resolve function ' + res);},
            function(res) {console.log('reject function ' + res)}
        );
}, false)

btn[1].addEventListener('click', function() {
    console.log('confirm2')
    Confirm('the confirm content2')
        .then(
            function(res) {console.log('resolve function2 ' + res);return 'resolve';},
            function(res) {console.log('reject function2 ' + res);return 'reject';}
        ).then(
            function(method) {console.log('second resolve function2 ' + method)}
        );
}, false)
