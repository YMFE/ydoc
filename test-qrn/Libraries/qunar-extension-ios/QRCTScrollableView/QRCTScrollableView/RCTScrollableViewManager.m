//
//  QRNCustomScrollViewIOSManager.m
//  RCTVibration
//
//  Created by jingxuan.dou on 16/3/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTScrollableViewManager.h"
#import "RCTScrollableView.h"
#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RCTScrollableShadowView.h"

@implementation RCTScrollableViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RCTScrollableView new];
}
-(RCTScrollableShadowView*)shadowView
{
    return [RCTScrollableShadowView new];
}

RCT_EXPORT_VIEW_PROPERTY(stickyHeaderIndices, NSIndexSet)
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets)
RCT_EXPORT_SHADOW_PROPERTY(scrollPosition, CGPoint)


@end
