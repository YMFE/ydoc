module.exports = {
    chooseImage: {
        hy: {
            key: 'chooseImage'
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    //TODO 是否还支持缩略图 thumbnails
                    localIds: ret.localIds
                };
            }
        }
    },
    uploadImage: {
        hy: {
            //TODO 验证
            key: 'uploadImage.v1'
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    serverId: ret.serverId
                };
            }
        }
    },
    previewImage: {
        hy: {
            //TODO 现在是否支持？
        },
        wechat: {
            key: 'previewImage'
        }
    },
    downloadImage: {
        hy: {
            //TODO 验证现在是否支持？
        },
        wechat: {
            successHandle: (ret) => {
                return {
                    localId: ret.localId
                };
            }
        }
    }
};
