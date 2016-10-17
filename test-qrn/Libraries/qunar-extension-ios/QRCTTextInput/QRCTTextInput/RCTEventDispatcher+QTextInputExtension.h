//
//  RCTEventDispatcher+QExtension.h
//  QRCTTextInput
//
//  Created by yingdong.guo on 2015/11/24.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "RCTEventDispatcher.h"

@interface RCTEventDispatcher (QTextInputExtension)

- (void)sendTextEventWithType:(RCTTextEventType)type
                     reactTag:(NSNumber *)reactTag
                         text:(NSString *)text
              recommendHeight:(CGFloat)recommendHeight
                   eventCount:(NSInteger)eventCount;

@end
