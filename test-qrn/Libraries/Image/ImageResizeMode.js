/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ImageResizeMode
 * @flow
 */
'use strict';

var keyMirror = require('fbjs/lib/keyMirror');

/**
 * ImageResizeMode - Enum for different image resizing modes, set via
 * `resizeMode` style property on `<Image>` components.
 */
var ImageResizeMode = keyMirror({
  /**
   * contain - The image will be resized such that it will be completely
   * visible, contained within the frame of the View.
   */
  contain: null,

  /**
   * cover - The image will be resized such that the entire area of the view
   * is covered by the image, potentially clipping parts of the image.
   */
  cover: null,

  /**
   * stretch - The image will be stretched to fill the entire frame of the
   * view without clipping. This may change the aspect ratio of the image,
   * distorting it.
   */
  stretch: null,

  /**
   * center - 图片居中显示（这个和官方的不一致）
   * 图片不会进行缩放居中显示
   */
  center: null,

  /**
   * repeat - The image will be repeated to cover the frame of the View. The
   * image will keep it's size and aspect ratio.
   */
  repeat: null,


  //////  QAdd      /////////////////

  /**
   * centerCrop - 图片居中外嵌
   * 与 cover 一致
   *  保持宽高比缩小或放大，使得两边都大于或等于显示边界，且宽或高契合显示边界。居中显示。 
   */
  centerCrop: null,

  /**
   * focusCrop - 图片外嵌, 中心点靠近指定 focusPoint 点
   * 类似centerCrop, 但居中点不是中点，而是指定的某个点。显示时就会尽量️以此点为中心
   */
  focusCrop: null,

  /**
   * centerInside - 内嵌会缩小居中，但是不放大
   * 和官方的 center 一致。缩放图片使两边都在显示边界内，居中显示。
   * 和 fitCenter、contain 不同，不会对图片进行放大。如果图尺寸大于显示边界，则保持长宽比缩小图片。
   */
  centerInside: null,

  /**
   * fitCenter - 图片内嵌居中
   * 与 contain 一致
   * 保持宽高比，缩小或者放大，使得图片完全显示在显示边界内，且宽或高契合显示边界。居中显示。
   */
  fitCenter: null,

  /**
   * fitStart - 图片内嵌对齐左上角
   * 与 fitCenter 类似，保持宽高比，缩小或者放大，使得图片完全显示在显示边界内，且宽或高契合显示边界。
   * 但是不居中，和显示区域的左上角对齐
   */
  fitStart: null,

  /**
   * fitEnd - 图片内嵌对齐右下角
   * 与 fitCenter 类似，保持宽高比，缩小或者放大，使得图片完全显示在显示边界内，且宽或高契合显示边界。
   * 但是不居中，和显示区域的右下角对齐
   */
  fitEnd: null,

  /**
   * fitXy - 图片拉伸填充
   * 与 stretch 一致，不保持宽高比，填充满显示边界。
   */
  fitXy: null,

  //////  QAdd end  ////////////////

});

module.exports = ImageResizeMode;
