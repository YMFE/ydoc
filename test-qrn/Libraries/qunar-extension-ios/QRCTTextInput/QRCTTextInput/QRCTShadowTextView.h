//
//  QRCTShadowTextView.h
//  QRCTTextInput
//
//  Created by yingdong.guo on 2015/11/30.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "RCTShadowView.h"

@interface QRCTShadowTextView : RCTShadowView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, assign) BOOL autoResize;
@property (nonatomic, weak) NSString *fontFamily;
@property (nonatomic, assign) CGFloat fontSize;
@property (nonatomic, weak) NSString *fontWeight;
@property (nonatomic, weak) NSString *fontStyle;
@property (nonatomic, weak) NSString *placeholder;

@end
