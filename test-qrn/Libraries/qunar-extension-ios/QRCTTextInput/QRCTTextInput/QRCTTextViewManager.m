/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "QRCTTextViewManager.h"

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTShadowView.h"
#import "QRCTTextView.h"
#import "QRCTShadowTextView.h"
#import "RCTUIManager.h"

@implementation QRCTTextViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[QRCTTextView alloc] initWithBridge:self.bridge];
}

- (RCTShadowView *)shadowView {
    return [[QRCTShadowTextView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(autoCorrect, BOOL)
RCT_REMAP_VIEW_PROPERTY(editable, textView.editable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholderTextColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(maxLength, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clearTextOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selectTextOnFocus, BOOL)
RCT_REMAP_VIEW_PROPERTY(keyboardType, textView.keyboardType, UIKeyboardType)
RCT_REMAP_VIEW_PROPERTY(returnKeyType, textView.returnKeyType, UIReturnKeyType)
RCT_REMAP_VIEW_PROPERTY(enablesReturnKeyAutomatically, textView.enablesReturnKeyAutomatically, BOOL)
RCT_REMAP_VIEW_PROPERTY(color, textColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(autoCapitalize, textView.autocapitalizationType, UITextAutocapitalizationType)
RCT_CUSTOM_VIEW_PROPERTY(fontSize, CGFloat, QRCTTextView)
{
  view.font = [RCTConvert UIFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, QRCTTextView)
{
  view.font = [RCTConvert UIFont:view.font withWeight:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, QRCTTextView)
{
  view.font = [RCTConvert UIFont:view.font withStyle:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, QRCTTextView)
{
  view.font = [RCTConvert UIFont:view.font withFamily:json ?: defaultView.font.familyName];
}
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)

- (RCTViewManagerUIBlock)uiBlockToAmendWithShadowView:(RCTShadowView *)shadowView
{
  NSNumber *reactTag = shadowView.reactTag;
  UIEdgeInsets padding = shadowView.paddingAsInsets;
  return ^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    ((QRCTTextView *)viewRegistry[reactTag]).contentInset = padding;
  };
}

RCT_EXPORT_VIEW_PROPERTY(acceptReturn, BOOL)

// 目前不支持Shadow view自己map property的setter，BOOM
RCT_EXPORT_SHADOW_PROPERTY(autoResize, BOOL)
RCT_EXPORT_SHADOW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_SHADOW_PROPERTY(fontSize, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(fontWeight, NSString)
RCT_EXPORT_SHADOW_PROPERTY(fontStyle, NSString)
RCT_EXPORT_SHADOW_PROPERTY(placeholder, NSString)

RCT_EXPORT_METHOD(getCursorPosition:(nonnull NSNumber *)reactTag
                  callback:(RCTResponseSenderBlock)callback)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        QRCTTextView *view = (QRCTTextView *)viewRegistry[reactTag];
        if (!view) {
            RCTLogError(@"Cannot find view with tag #%@", reactTag);
            return;
        }
        
        NSInteger cursorPosition = view.cursorPosition;
        CGRect caretRect = view.cursorRect;
        callback(@[@(cursorPosition), @(caretRect.origin.x), @(caretRect.origin.y)]);
    }];
}

RCT_EXPORT_METHOD(setCursorPosition:(nonnull NSNumber *)reactTag
                  from:(nonnull NSNumber *)start
                  to:(nullable NSNumber *)end) {
    NSInteger startValue = [start integerValue];
    NSInteger endValue = startValue;
    if (end) {
        endValue = [end integerValue];
    }
    
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        QRCTTextView *view = (QRCTTextView *)viewRegistry[reactTag];
        if (!view) {
            RCTLogError(@"Cannot find view with tag #%@", reactTag);
            return;
        }
        
        [view setSelectionFrom:startValue to:endValue];
    }];
}

@end
