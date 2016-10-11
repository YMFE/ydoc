let ySniff = {
    browsers: {},
    info: {}
}; // 结果

let ua = navigator.userAgent,
    platform = navigator.platform,
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), // 匹配 android
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/), // 匹配 ipad
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), // 匹配 ipod
    iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/), // 匹配 iphone
    webApp = ua.indexOf('Safari') == -1; // 匹配 桌面 webApp

let browsers = {
    wechat: ua.match(/(MicroMessenger)\/([\d\.]+)/), // 匹配 weChat
    alipay: ua.match(/(AlipayClient)\/([\d\.]+)/), // 匹配 支付宝
    qq: ua.match(/(MQQBrowser)\/([\d\.]+)/), // 匹配 QQ 浏览器
    weibo: ua.match(/(weibo__)([\d\.]+)/), // 匹配 微博
    uc: ua.match(/(UCBrower)\/([\d\.]+)/), // 匹配 uc
    opera: ua.match(/(Opera)\/([\d\.]+)/) // 匹配 opera
};

// 系统

ySniff.ios = ySniff.android = ySniff.iphone = ySniff.ipad = ySniff.ipod = false;

if (android) {
    ySniff.os = 'android';
    ySniff.osVersion = android[2];
    ySniff.android = true;
}

if (ipad || iphone || ipod) {
    ySniff.os = 'ios';
    ySniff.ios = true;
}

if (iphone) {
    ySniff.osVersion = iphone[2].replace(/_/g, '.');
    ySniff.iphone = true;
    ySniff.imobile = true;
}

if (ipad) {
    ySniff.osVersion = ipad[2].replace(/_/g, '.');
    ySniff.ipad = true;
}

if (ipod) {
    ySniff.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    ySniff.ipod = true;
    ySniff.imobile = true;
}

// iOS 8+ changed UA
if (ySniff.ios && ySniff.osVersion && ua.indexOf('Version/') >= 0) {
    if (ySniff.osVersion.split('.')[0] === '10') {
        ySniff.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
}

if (ySniff.osVersion) {
    ySniff.osVersionN = parseInt(ySniff.osVersion.match(/\d+\.?\d*/)[0]);
}

// 配置

ySniff.pixelRatio = window.devicePixelRatio || 1;

ySniff.retina = ySniff.pixelRatio >= 2;

// 浏览器
for (let key in browsers) {
    if (browsers[key]) {
        webApp = false;
        ySniff.browsers[key] = browsers[key][2];
    } else {
        ySniff.browsers[key] = false;
    }
}

ySniff.webApp = ySniff.os == 'ios' && webApp;

// 其他信息
ua.split(' ').forEach((item) => {
    var kv = item.split('/');
    if (kv.length == 2) {
        ySniff.info[kv[0]] = kv[1];
    }
});

// PC
ySniff.pc = platform.indexOf('Mac') === 0 || platform.indexOf('Win') === 0 || (platform.indexOf('linux') === 0 && !ySniff.android);

module.exports = ySniff;
