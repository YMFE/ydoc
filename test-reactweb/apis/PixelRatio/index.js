/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * @providesModule PixelRatio
 * @flow
 */



 /**
 * PixelRatio
 *
 * @component PixelRatio
 * @example ./PixelRatio.js[1-34]
 * @version >=v1.4.0
 * @description PixelRatio为用户提供了获得设备像素密度的方法。
 *
 * ![PixelRatio](./images/api/PixelRatio.gif)
 *
 */


var Dimensions = require('Dimensions')

/**
 * PixelRatio gives access to the device pixel density.
 */
class PixelRatio {
  /**
   * @method get
   * @description 返回设备的像素密度。例如：
   *
   * ** PixelRatio.get() === 1 **
   * - mdpi Android 设备 (160 dpi)
   *
   * ** PixelRatio.get() === 1.5 ** 
   * - hdpi Android 设备 (240 dpi)
   *
   * ** PixelRatio.get() === 2 ** 
   * - iPhone 4, 4S
   * - iPhone 5, 5c, 5s
   * - iPhone 6
   * - xhdpi Android 设备 (320 dpi)
   *
   * **  PixelRatio.get() === 3 ** 
   * - iPhone 6 plus
   * - xxhdpi Android 设备 (480 dpi)
   *
   * **  PixelRatio.get() === 3.5 ** 
   * - Nexus 6
   */ 

  /**
   * Returns the device pixel density.
   */
  static get(): number {
    return Dimensions.get('window').scale
  }




  /**
   * No equivalent for Web
   */
  static getFontScale(): number {
    return Dimensions.get('window').fontScale || PixelRatio.get()
  }

  /**
   * @method getPixelSizeForLayoutSize
   * @param {number} layoutSize 布局尺寸
   * @description 将布局尺寸（dp）转换为像素尺寸（px），返回一个整数值。
   */ 
  /**
   * Converts a layout size (dp) to pixel size (px).
   * Guaranteed to return an integer number.
   */
  static getPixelSizeForLayoutSize(layoutSize: number): number {
    return Math.round(layoutSize * PixelRatio.get())
  }

  /**
   * @method roundToNearestPixel
   * @param {number} layoutSize 布局尺寸
   * @description 得到一个布局尺寸转化为像素尺寸保留整数时最接近的布局尺寸值。例如，在一个PixelRatio为3的设备中，`PixelRatio.roundToNearestPixel(8.4) = 8.333333333333334`, 因为 `(8.33 * 3) = 25 px`, 25px是8.4dp在3像素密度的情况下最接近的px值。
   */ 
  /**
   * Rounds a layout size (dp) to the nearest layout size that corresponds to
   * an integer number of pixels. For example, on a device with a PixelRatio
   * of 3, `PixelRatio.roundToNearestPixel(8.4) = 8.33`, which corresponds to
   * exactly (8.33 * 3) = 25 pixels.
   */
  static roundToNearestPixel(layoutSize: number): number {
    const ratio = PixelRatio.get()
    return Math.round(layoutSize * ratio) / ratio
  }
}

module.exports = PixelRatio