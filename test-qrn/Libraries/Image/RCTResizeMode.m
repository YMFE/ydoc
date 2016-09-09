/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTResizeMode.h"

@implementation RCTConvert(RCTResizeMode)

// 默认值为拉伸填充
RCT_ENUM_CONVERTER(RCTResizeMode, (@{
                                     @"center": @(RCTResizeModeCenter),
                                     @"centerCrop": @(RCTResizeModeCenterCrop),
                                     @"focusCrop": @(RCTResizeModeFocusCrop),
                                     @"centerInside": @(RCTResizeModeCenterInside),
                                     @"fitCenter": @(RCTResizeModeFitCenter),
                                     @"fitStart": @(RCTResizeModeFitStart),
                                     @"fitEnd": @(RCTResizeModeFitEnd),
                                     @"fitXy": @(RCTResizeModeFitXY),
                                     // React-Native values
                                     @"cover": @(RCTResizeModeCenterCrop),
                                     @"contain": @(RCTResizeModeFitCenter),
                                     @"stretch": @(RCTResizeModeFitXY),
                                     @"repeat": @(RCTResizeModeRepeat),
                                     }), RCTResizeModeFitXY, integerValue)

@end
