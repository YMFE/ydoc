/** -*- mode: web; -*-
 * @providesModule MapUtils
 **/

'use strict';

import {QRCTMapUtils} from 'NativeModules';
const CoordTranslate = require('./CoordTranslate');

const MapUtils = {
    CoordType: {
        WGS84: 'WGS84', // GPS定位坐标
        GCJ02: 'GCJ02', // 火星坐标
        BD09: 'BD09'    // 百度坐标
    },

    calculateRoute: function (startPosition, endPosition, routeType, successCallback, errorCallback) {
        QRCTMapUtils.calculateRoute(startPosition, endPosition, routeType, successCallback, errorCallback);
    },

    getLocation: function(coord, callback, errorCallback) {
        QRCTMapUtils.getLocation(coord, callback, errorCallback);
    },

    /**
       @param {Array<position>} positions
       @param {string} routeType
     **/
    goNavigation: function(positions, routeType) {
        QRCTMapUtils.goNavigation(positions, routeType);
    },

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
