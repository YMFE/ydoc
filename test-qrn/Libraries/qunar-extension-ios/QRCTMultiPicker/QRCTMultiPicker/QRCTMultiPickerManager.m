//
//  Created by doujingxuan on 2/15/16.
//  Copyright (c) 2016 Qunar. All rights reserved.
//


#import "QRCTMultiPickerManager.h"

#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RCTConvert.h"
#import "QRCTMultiPicker.h"

@implementation QRCTMultiPickerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[QRCTMultiPicker alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_EXPORT_VIEW_PROPERTY(selectedIndexes, NSNumberArray);
RCT_EXPORT_VIEW_PROPERTY(componentData, NSArray);

- (NSDictionary *)constantsToExport
{
  QRCTMultiPicker *view = [[QRCTMultiPicker alloc] init];

  return @{
    @"ComponentHeight": @(CGRectGetHeight(view.frame)),
    @"ComponentWidth": @(CGRectGetWidth(view.frame))
  };
}

@end
