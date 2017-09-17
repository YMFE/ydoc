
myOpen({
    type: 'user', // 注释
    success: function(res) {
        console.log('success');
        window.open('http://ymfe.tech/');
    },
    fail: function() {
        console.log('fail');
    }
});
