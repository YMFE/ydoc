/*
 * @providesModule MapUtils
 */

/**
 * MapUtils 模块
 *
 * @component MapUtils
 * @description 该模块提供了地图坐标转换相关的 API
 */

const CoordTranslate = require('./CoordTranslate');

const MapUtils = {
    /**
     * @property CoordType
     * @type object
     * @description 这里定义了三种坐标类型:
     *
     * - WGS84: GPS定位坐标
     * - GCJ02: 火星坐标
     * - BD09: 百度坐标
     */
    CoordType: {
        WGS84: 'WGS84', // GPS定位坐标
        GCJ02: 'GCJ02', // 火星坐标
        BD09: 'BD09'    // 百度坐标
    },
    /**
     * @property calculateRoute
     * @type function
     * @description 很遗憾, 目前不支持。
     */
    calculateRoute: function (startPosition, endPosition, routeType, successCallback, errorCallback) {
        errorCallback(new Error('暂不支持该方法'));
    },
    /**
     * @property getLocation
     * @type function
     * @description 很遗憾, 目前不支持。
     */
    getLocation: function(coord, callback, errorCallback) {
        errorCallback(new Error('暂不支持该方法'));
    },

    /**
     * @property goNavigation
     * @type function
     * @description 很遗憾, 目前不支持。
     */
    goNavigation: function(positions, routeType) {
    },

    /**
     * @property translate
     * @type function
     * @param {object} coord 需要转换的坐标
     * @param {string} srcType 转换前坐标的类型
     * @param {string} desType 转换后的希望得到的坐标的类型
     * @return {object} 转换后的坐标
     * @description 转换的坐标为一个对象, 该对象包含经度和纬度 `{latitude: 39.983667, longitude:116.312638}`
     * 坐标类型同 CoordType 中列举的类型。
     */
    translate: function(coord, srcType, desType) {
        const CoordType = this.CoordType;
        switch (srcType) {
            case CoordType.WGS84:
                switch (desType) {
                    case CoordType.WGS84:
                        return coord;

                    case CoordType.GCJ02:
                        return CoordTranslate.wgs2gcj(coord);

                    case CoordType.BD09:
                        return CoordTranslate.wgs2bd(coord);

                    default:
                        throw 'Coordinate type error';
                }
                break;

            case CoordType.GCJ02:
                switch (desType) {
                    case CoordType.WGS84:
                        return CoordTranslate.gcj2wgs(coord);

                    case CoordType.GCJ02:
                        return coord;

                    case CoordType.BD09:
                        return CoordTranslate.gcj2bd(coord);

                    default:
                        throw 'Coordinate type error';
                }
                break;

            case CoordType.BD09:
                switch (desType) {
                    case CoordType.WGS84:
                        return CoordTranslate.bd2wgs(coord);

                    case CoordType.GCJ02:
                        return CoordTranslate.bd2gcj(coord);

                    case CoordType.BD09:
                        return coord;

                    default:
                        throw 'Coordinate type error';
                }
                break;

            default:
                throw 'Coordinate type error';
        }
    }
};

module.exports = MapUtils;
