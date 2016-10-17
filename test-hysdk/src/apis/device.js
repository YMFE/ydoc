module.exports = {
    getLocation: {
        hy: {
            key: 'geolocation.getCurrentPosition'
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    type: 'wechat',
                    coords: {
                        latitude: ret.latitude,
                        longitude: ret.longitude
                    }
                }
            }
        },
        h5: {
            // 新版chrome要求：getCurrentPosition()和watchPosition() 不再支持http等非安全协议.
            handle: (opt) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((data) => {
                        opt.success({
                            type: 'h5',
                            coords: data.coords
                        });
                    }, opt.fail, {
                        enableHighAccuracy: opt.enableHighAccuracy || true,
                        timeout: opt.timeout || 5000
                    });
                } else {
                    opt.fail({
                        ret: false,
                        errcode: -1,
                        errmsg: 'Geolocation is not supported!'
                    });
                }
            }
        }
    },
    openLocation: {
        hy: {
            //TODO Android是否支持？
            key: 'openLocation'
        },
        wechat: {
            //TODO: 待验证
            key: 'openLocation'
        }
    },
    getDeviceInfo: {
        hy: (() => {
            const platform = {
                // iPhone
                "iPhone1,1": "iPhone 2G (A1203)",
                "iPhone1,2": "iPhone 3G (A1241/A1324)",
                "iPhone2,1": "iPhone 3GS (A1303/A1325)",
                "iPhone3,1": "iPhone 4 (A1332)",
                "iPhone3,2": "iPhone 4 (A1332)",
                "iPhone3,3": "iPhone 4 (A1349)",
                "iPhone4,1": "iPhone 4S (A1387/A1431)",
                "iPhone5,1": "iPhone 5 (A1428)",
                "iPhone5,2": "iPhone 5 (A1429/A1442)",
                "iPhone5,3": "iPhone 5c (A1456/A1532)",
                "iPhone5,4": "iPhone 5c (A1507/A1516/A1526/A1529)",
                "iPhone6,1": "iPhone 5s (A1453/A1533)",
                "iPhone6,2": "iPhone 5s (A1457/A1518/A1528/A1530)",
                "iPhone7,1": "iPhone 6 Plus (A1522/A1524)",
                "iPhone7,2": "iPhone 6 (A1549/A1586)",
                "iPhone8,1": "iPhone 6s (A1633/A1688/A1691/A1700)",
                "iPhone8,2": "iPhone 6s Plus (A1634/A1687/A1690/A1699)",
                "iPhone9,1": "iPhone 7",
                "iPhone9,3": "iPhone 7",
                "iPhone9,2": "iPhone 7 Plus",
                "iPhone9,4": "iPhone 7 Plus",
                // iPod
                "iPod1,1": "iPod Touch (A1213)",
                "iPod2,1": "iPod Touch 2G (A1288)",
                "iPod3,1": "iPod Touch 3G (A1318)",
                "iPod4,1": "iPod Touch 4G (A1367)",
                "iPod5,1": "iPod Touch 5G (A1421/A1509)",
                "iPod7,1": "iPod Touch 6G (A1574)",
                // iPad
                "iPad1,1": "iPad (A1219/A1337)",
                "iPad2,1": "iPad 2 (A1395)",
                "iPad2,2": "iPad 2 (A1396)",
                "iPad2,3": "iPad 2 (A1397)",
                "iPad2,4": "iPad 2 (A1395+New Chip)",
                "iPad3,1": "iPad 3 (A1416)",
                "iPad3,2": "iPad 3 (A1403)",
                "iPad3,3": "iPad 3 (A1430)",
                "iPad3,4": "iPad 4 (A1458)",
                "iPad3,5": "iPad 4 (A1459)",
                "iPad3,6": "iPad 4 (A1460)",
                // iPad Air
                "iPad4,1": "iPad Air (A1474)",
                "iPad4,2": "iPad Air (A1475)",
                "iPad4,3": "iPad Air (A1476)",
                "iPad5,3": "iPad Air 2 (A1566)",
                "iPad5,4": "iPad Air 2 (A1567)",
                //iPad mini
                "iPad2,5": "iPad mini 1G (A1432)",
                "iPad2,6": "iPad mini 1G (A1454)",
                "iPad2,7": "iPad mini 1G (A1455)",
                "iPad4,4": "iPad mini 2 (A1489)",
                "iPad4,5": "iPad mini 2 (A1490)",
                "iPad4,6": "iPad mini 2 (A1491)",
                "iPad4,7": "iPad mini 3 (A1599)",
                "iPad4,8": "iPad mini 3 (A1600)",
                "iPad4,9": "iPad mini 3 (A1601)",
                "iPad5,1": "iPad mini 4 (A1538)",
                "iPad5,2": "iPad mini 4 (A1550)",
                // Simulator
                "i386": "iPhone Simulator",
                "x86_64": "iPhone Simulator"
            };
            return {
                resHandle: (res) => {
                    const re = { ret: res.ret, data: {} };
                    const data = res.data;
                    for(let key in data) {
                        const value = data[key];
                        re.data[key] = value;
                        if (key === 'model' && data[key]) re.data.platform = platform[value];
                    }
                    return re;
                },
                key: 'native.getDeviceInfo'
            };
        })()
    },
    getNetworkType: {
        hy: {
            key: 'network.getType'
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    networkType: ret.networkType
                };
            }
        }
    }
};
