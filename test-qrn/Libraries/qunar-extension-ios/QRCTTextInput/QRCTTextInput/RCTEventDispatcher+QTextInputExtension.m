//
//  RCTEventDispatcher+QExtension.m
//  QRCTTextInput
//
//  Created by yingdong.guo on 2015/11/24.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "RCTEventDispatcher+QTextInputExtension.h"

@implementation RCTEventDispatcher (QTextInputExtension)

- (void)sendTextEventWithType:(RCTTextEventType)type
                     reactTag:(NSNumber *)reactTag
                         text:(NSString *)text
              recommendHeight:(CGFloat)recommendHeight
                   eventCount:(NSInteger)eventCount
{
    static NSString *events[] = {
        @"focus",
        @"blur",
        @"change",
        @"submitEditing",
        @"endEditing",
    };
    
    [self sendInputEventWithName:events[type] body:text ?
     @{
       @"text": text,
       @"eventCount": @(eventCount),
       @"recommendHeight": @(recommendHeight),
       @"target": reactTag
       } :
     @{
       @"eventCount": @(eventCount),
       @"target": reactTag
       }];
}

@end
