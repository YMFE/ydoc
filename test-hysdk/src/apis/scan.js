module.exports = {
    scanQRCode: {
        hy: {
            key: 'scanQRCode'
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    result: ret.resultStr
                };
            }
        }
    }
};
