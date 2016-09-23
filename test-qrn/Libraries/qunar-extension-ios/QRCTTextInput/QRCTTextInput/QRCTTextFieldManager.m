/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "QRCTTextFieldManager.h"

#import "RCTBridge.h"
#import "RCTShadowView.h"
#import "QRCTTextField.h"
#import "RCTUIManager.h"

@interface QRCTTextFieldManager() <UITextFieldDelegate>

@end

@implementation QRCTTextFieldManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  QRCTTextField *textField = [[QRCTTextField alloc] initWithBridge:self.bridge];
  textField.delegate = self;
  return textField;
}

- (BOOL)textField:(QRCTTextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
  if (textField.maxLength == nil || [string isEqualToString:@"\n"]) {  // Make sure forms can be submitted via return
    return YES;
  }
  
  //有中文输入
  if (textField.markedTextRange != nil) {
    return YES;
  }
  //文本超过长度
  if (textField.text.length >= textField.maxLength.unsignedIntegerValue) {
    NSMutableString *newString = textField.text.mutableCopy;
    [newString replaceCharactersInRange:[newString rangeOfComposedCharacterSequencesForRange:range] withString:string];
    
    if (newString.length > textField.maxLength.unsignedIntegerValue){
      NSRange newStringRange = [newString rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, textField.maxLength.unsignedIntegerValue)];
      textField.text = [newString substringWithRange:newStringRange];
    } else {
      textField.text = newString;
    }
    
    [textField textFieldDidChange];
    return NO;
  }
  
  NSInteger allowedLength = textField.maxLength.integerValue + range.length - textField.text.length;
  if ((NSInteger)string.length > allowedLength) {
    if (string.length > 1) {
      // Truncate the input string so the result is exactly maxLength
      NSString *limitedString = [string substringWithRange:[string rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, allowedLength)]];
      NSMutableString *newString = textField.text.mutableCopy;
      [newString replaceCharactersInRange:range withString:limitedString];
      textField.text = newString;
      // Collapse selection at end of insert to match normal paste behavior
      UITextPosition *insertEnd = [textField positionFromPosition:textField.beginningOfDocument
                                                           offset:(range.location + allowedLength)];
      textField.selectedTextRange = [textField textRangeFromPosition:insertEnd toPosition:insertEnd];
      [textField textFieldDidChange];
    }
    return NO;
  } else {
    return YES;
  }
}

RCT_EXPORT_VIEW_PROPERTY(caretHidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCorrect, BOOL)
RCT_REMAP_VIEW_PROPERTY(editable, enabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholderTextColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(maxLength, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clearButtonMode, UITextFieldViewMode)
RCT_REMAP_VIEW_PROPERTY(clearTextOnFocus, clearsOnBeginEditing, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selectTextOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
RCT_EXPORT_VIEW_PROPERTY(returnKeyType, UIReturnKeyType)
RCT_EXPORT_VIEW_PROPERTY(enablesReturnKeyAutomatically, BOOL)
RCT_EXPORT_VIEW_PROPERTY(secureTextEntry, BOOL)
RCT_REMAP_VIEW_PROPERTY(password, secureTextEntry, BOOL) // backwards compatibility
RCT_REMAP_VIEW_PROPERTY(color, textColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(autoCapitalize, autocapitalizationType, UITextAutocapitalizationType)
RCT_REMAP_VIEW_PROPERTY(textAlign, textAlignment, NSTextAlignment)
RCT_CUSTOM_VIEW_PROPERTY(fontSize, CGFloat, QRCTTextField)
{
  view.font = [RCTConvert UIFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, __unused QRCTTextField)
{
  view.font = [RCTConvert UIFont:view.font withWeight:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, __unused QRCTTextField)
{
  view.font = [RCTConvert UIFont:view.font withStyle:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, QRCTTextField)
{
  view.font = [RCTConvert UIFont:view.font withFamily:json ?: defaultView.font.familyName];
}
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)

- (RCTViewManagerUIBlock)uiBlockToAmendWithShadowView:(RCTShadowView *)shadowView
{
  NSNumber *reactTag = shadowView.reactTag;
  UIEdgeInsets padding = shadowView.paddingAsInsets;
  return ^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    ((QRCTTextField *)viewRegistry[reactTag]).contentInset = padding;
  };
}

RCT_EXPORT_METHOD(getCursorPosition:(NSNumber *)reactTag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    QRCTTextField *view = (QRCTTextField *)viewRegistry[reactTag];
    if (!view) {
      RCTLogError(@"Cannot find view with tag #%@", reactTag);
      return;
    }
    
    callback(@[@(view.cursorPosition)]);
  }];
}

@end
