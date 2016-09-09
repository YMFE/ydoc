/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTConvert.h"


/**
 *  RCTResizeMode
 *  在RCT官方的基础上RCTResizeModeCover、 RCTResizeModeContain、RCTResizeModeStretch 添加了多种支持的模式
 */
typedef NS_ENUM(NSInteger,RCTResizeMode) {
  
  /**
   *  不保持宽高比，填充满显示边界。
   *  图片拉伸填充
   */
  RCTResizeModeFitXY = UIViewContentModeScaleToFill,
  RCTResizeModeStretch = UIViewContentModeScaleToFill,
  
  /**
   *  保持宽高比缩小或放大，使得两边都大于或等于显示边界，且宽或高契合显示边界。居中显示。
   *  图片居中外嵌
   */
  RCTResizeModeCenterCrop = UIViewContentModeScaleAspectFill,
  RCTResizeModeCover = UIViewContentModeScaleAspectFill,
  
  /**
   *  保持宽高比，缩小或者放大，使得图片完全显示在显示边界内，且宽或高契合显示边界。居中显示。
   *  图片内嵌居中
   */
  RCTResizeModeFitCenter = UIViewContentModeScaleAspectFit,
  RCTResizeModeContain = UIViewContentModeScaleAspectFit,
  
  /**
   *  同RCTResizeModeModeFitCenter，但不居中，和显示边界左上对齐。
   *  图片内嵌左上角对齐
   */
  RCTResizeModeFitStart  = 200,
  
  /**
   *  同RCTResizeModeModeFitCenter， 但不居中，和显示边界右下对齐
   *  图片内嵌右下角对齐
   */
  RCTResizeModeFitEnd,
  
  /**
   *  同RCTResizeModeCenterCrop, 但居中点不是中点，而是指定的某个点。显示时就会⚠️尽量⚠️以此点为中心。
   *  图片外嵌, 中心点靠近指定点
   */
  RCTResizeModeFocusCrop,
  
  /**
   *  居中，无缩放。
   */
  RCTResizeModeCenter,
  
  /**
   *  缩放图片使两边都在显示边界内，居中显示。和 RCTResizeModeModeFitCenter 不同，不会对图片进行放大。如果图尺寸大于显示边界，则保持长宽比缩小图片。
   *  内嵌居中不放大
   */
  RCTResizeModeCenterInside,
  
  
  /**
   *  Repeat the image to cover the frame of the view. The image will keep it's size and aspect ratio
   */
  RCTResizeModeRepeat, // Use negative values to avoid conflicts with iOS enum values.
};



@interface RCTConvert(RCTResizeMode)

+ (RCTResizeMode)RCTResizeMode:(id)json;

@end
