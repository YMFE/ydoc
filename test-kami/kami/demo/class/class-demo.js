var KamiClass = require('../../scripts/rating/index.js');
var KamiClass2 = require('../../scripts/rating/index.js');

var options = {
    container: '#canlendarWrap',
    readonly: true
};
var singleton = KamiClass.singleton(options);
var singleton2 = KamiClass2.singleton(options);

console.log(singleton2 === singleton);

singleton.render();