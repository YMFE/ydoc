/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>

#import "RCTView.h"
#import "UIView+React.h"

@class RCTBridge;

@interface QRCTTextView : RCTView <UITextViewDelegate>

@property (nonatomic, assign) BOOL autoCorrect;
@property (nonatomic, assign) BOOL clearTextOnFocus;
@property (nonatomic, assign) BOOL selectTextOnFocus;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, copy) NSString *text;
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, strong) UIColor *placeholderTextColor;
@property (nonatomic, strong) UIFont *font;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, strong) NSNumber *maxLength;
@property (nonatomic, readonly) NSInteger cursorPosition;
@property (nonatomic, readonly) CGRect cursorRect;
@property (nonatomic, assign) BOOL scrollEnabled;
@property (nonatomic, assign) BOOL acceptReturn;

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;
- (CGFloat)calculateRecommendHeightForWidth:(CGFloat)width;
- (void)setPlaceholder:(NSString *)placeholder;
- (void)setSelectionFrom:(NSInteger)selectionStart to:(NSInteger)selectionEnd;

@end
