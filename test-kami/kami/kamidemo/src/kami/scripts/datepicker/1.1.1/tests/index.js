var DatePicker = require('kami/datepicker/src/datepicker');

var datepicker = new DatePicker({
    container: "#container",
    // 默认checkin的日期
    // checkIn: '2015-09-11',
    // 默认checkout的日期
    // checkOut: '2015-09-21'
})
datepicker.on('ready', function(){
    console.log('ready')
});
datepicker.on('checked', function(checkIn, checkOut, days){
    console.log(arguments)
})
datepicker.render();

window.d = datepicker