/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "QRCTTextView.h"

#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"
#import "UIView+React.h"
#import "RCTEventDispatcher+QTextInputExtension.h"

static const CGFloat kTextViewLeftOffset = 4;

@implementation QRCTTextView
{
  RCTEventDispatcher *_eventDispatcher;
  BOOL _jsRequestingFirstResponder;
  NSString *_placeholder;
  UITextView *_placeholderView;
  UITextView *_textView;
  NSInteger _nativeEventCount;
  RCTBridge *_bridge;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    RCTAssertParam(bridge);

  if ((self = [super initWithFrame:CGRectZero])) {
    _acceptReturn = YES;
    _contentInset = UIEdgeInsetsZero;
    _bridge = bridge;
    _eventDispatcher = bridge.eventDispatcher;
    _placeholderTextColor = [self defaultPlaceholderTextColor];

    _textView = [[UITextView alloc] initWithFrame:self.bounds];
    _textView.backgroundColor = [UIColor clearColor];
    _textView.scrollsToTop = NO;
    _textView.delegate = self;
      
      UIEdgeInsets containerInset = {.top = 5};
      _textView.textContainerInset = containerInset;
      
    [self addSubview:_textView];
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)updateFrames
{
  // Adjust the insets so that they are as close as possible to single-line
  // RCTTextField defaults, using the system defaults of font size 17 and a
  // height of 31 points.
  //
  // We apply the left inset to the frame since a negative left text-container
  // inset mysteriously causes the text to be hidden until the text view is
  // first focused.
  /*UIEdgeInsets adjustedFrameInset = UIEdgeInsetsZero;
  adjustedFrameInset.left = _contentInset.left - 5;*/
  
  UIEdgeInsets adjustedTextContainerInset = _contentInset;
  adjustedTextContainerInset.top += 5;
  adjustedTextContainerInset.left = 0;
  /*
  CGRect frame = UIEdgeInsetsInsetRect(self.bounds, adjustedFrameInset);
  _textView.frame = frame;
  _placeholderView.frame = frame;
  */
  _textView.textContainerInset = adjustedTextContainerInset;
  _placeholderView.textContainerInset = adjustedTextContainerInset;
}

- (void)updatePlaceholder
{
  [_placeholderView removeFromSuperview];
  _placeholderView = nil;

  if (_placeholder) {
    _placeholderView = [[UITextView alloc] initWithFrame:self.bounds];
    _placeholderView.backgroundColor = [UIColor clearColor];
    _placeholderView.scrollEnabled = false;
    _placeholderView.scrollsToTop = NO;
      _placeholderView.textContainerInset = (UIEdgeInsets){.top=5};
    _placeholderView.attributedText =
    [[NSAttributedString alloc] initWithString:_placeholder attributes:@{
      NSFontAttributeName : (_textView.font ? _textView.font : [self defaultPlaceholderFont]),
      NSForegroundColorAttributeName : _placeholderTextColor
    }];

    [self insertSubview:_placeholderView belowSubview:_textView];
    [self _setPlaceholderVisibility];
  }
}

- (UIFont *)font
{
  return _textView.font;
}

- (void)setFont:(UIFont *)font
{
  _textView.font = font;
  [self updatePlaceholder];
}

- (UIColor *)textColor
{
  return _textView.textColor;
}

- (void)setTextColor:(UIColor *)textColor
{
  _textView.textColor = textColor;
}

- (void)setPlaceholder:(NSString *)placeholder
{
  _placeholder = placeholder;
  [self updatePlaceholder];
}

- (void)setPlaceholderTextColor:(UIColor *)placeholderTextColor
{
  if (placeholderTextColor) {
    _placeholderTextColor = placeholderTextColor;
  } else {
    _placeholderTextColor = [self defaultPlaceholderTextColor];
  }
  [self updatePlaceholder];
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
    if (contentInset.top == _contentInset.top &&
        contentInset.left == _contentInset.left &&
        contentInset.right == _contentInset.right &&
        contentInset.bottom == _contentInset.bottom) {
        return;
    }
  _contentInset = contentInset;
  [self updateFrames];
}

- (void)reactSetFrame:(CGRect)frame {
    UIEdgeInsets adjustedFrameInset = UIEdgeInsetsZero;
    adjustedFrameInset.left = _contentInset.left - 5;
    CGRect newFrame = UIEdgeInsetsInsetRect(frame, adjustedFrameInset);
    [super reactSetFrame:newFrame];
}

- (NSString *)text
{
  return _textView.text;
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text
{
    if (!_acceptReturn) {
        if ([text isEqualToString:@"\n"]) {
            [self textViewDidReturn:textView];
            return NO;
        }
    }
  if (_maxLength ==  nil) {
      return YES;
  }
    NSUInteger allowedLength = _maxLength.integerValue - textView.text.length + range.length;
    if (text.length > allowedLength) {
        if (text.length > 1) {
            // Truncate the input string so the result is exactly maxLength
            NSString *limitedString = [text substringToIndex:allowedLength];
            NSMutableString *newString = textView.text.mutableCopy;
            [newString replaceCharactersInRange:range withString:limitedString];
            textView.text = newString;
            // Collapse selection at end of insert to match normal paste behavior
            UITextPosition *insertEnd = [textView positionFromPosition:textView.beginningOfDocument
                                                                offset:(range.location + allowedLength)];
            textView.selectedTextRange = [textView textRangeFromPosition:insertEnd toPosition:insertEnd];
            [self textViewDidChange:textView];
        }
        return NO;
    } else {
        return YES;
    }
}

- (void)setText:(NSString *)text
{
  NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
  if (eventLag == 0 && ![text isEqualToString:_textView.text]) {
    UITextRange *selection = _textView.selectedTextRange;
    _textView.text = text;
    [self _setPlaceholderVisibility];
    _textView.selectedTextRange = selection; // maintain cursor position/selection - this is robust to out of bounds
    [self textViewDidChange:_textView];
  } else if (eventLag > RCTTextUpdateLagWarningThreshold) {
    RCTLogWarn(@"Native TextInput(%@) is %zd events ahead of JS - try to make your JS faster.", self.text, eventLag);
  }
}

- (void)_setPlaceholderVisibility
{
  if (_textView.text.length > 0) {
    [_placeholderView setHidden:YES];
  } else {
    [_placeholderView setHidden:NO];
  }
}

- (void)setAutoCorrect:(BOOL)autoCorrect
{
  _textView.autocorrectionType = (autoCorrect ? UITextAutocorrectionTypeYes : UITextAutocorrectionTypeNo);
}

- (BOOL)autoCorrect
{
  return _textView.autocorrectionType == UITextAutocorrectionTypeYes;
}

- (BOOL)textViewShouldBeginEditing:(UITextView *)textView
{
  if (_selectTextOnFocus) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [textView selectAll:nil];
    });
  }
  return YES;
}

- (void)textViewDidBeginEditing:(UITextView *)textView
{
  if (_clearTextOnFocus) {
    _textView.text = @"";
    [self _setPlaceholderVisibility];
  }
  CGFloat recommendHeight = [self calculateRecommendHeight];

  [_bridge enqueueJSCall:@"TextInputState._setCurrentlyFocused" args:@[self.reactTag]];

  [_eventDispatcher sendTextEventWithType:RCTTextEventTypeFocus
                                 reactTag:self.reactTag
                                     text:textView.text
                          recommendHeight:recommendHeight
                               eventCount:_nativeEventCount];
}

- (void)textViewDidChange:(UITextView *)textView
{
  [self _setPlaceholderVisibility];
  CGFloat recommendHeight = [self calculateRecommendHeight];
  _nativeEventCount++;
    [_bridge directCallWithModules:@[@"RCTUIManager"]
                           methods:@[@"updateView"]
                         arguments:@[@[self.reactTag, @"QRCTTextView", @{@"needUpdate": @YES}]]];
  [_eventDispatcher sendTextEventWithType:RCTTextEventTypeChange
                                 reactTag:self.reactTag
                                     text:textView.text
                          recommendHeight:recommendHeight
                               eventCount:_nativeEventCount];

}

- (void)textViewDidEndEditing:(UITextView *)textView
{
  CGFloat recommendHeight = [self calculateRecommendHeight];
  [_eventDispatcher sendTextEventWithType:RCTTextEventTypeEnd
                                 reactTag:self.reactTag
                                     text:textView.text
                          recommendHeight:recommendHeight
                               eventCount:_nativeEventCount];
}

- (void)textViewDidReturn:(UITextView *)textView {
    CGFloat recommendHeight = [self calculateRecommendHeight];
    [_eventDispatcher sendTextEventWithType:RCTTextEventTypeSubmit
                                   reactTag:self.reactTag
                                       text:textView.text
                            recommendHeight:recommendHeight
                                 eventCount:_nativeEventCount];
}

- (CGFloat)calculateRecommendHeight
{
    return [self calculateRecommendHeightForWidth:self.frame.size.width];
}

- (CGFloat)calculateRecommendHeightForWidth:(CGFloat)width
{
    CGSize restrictedSize = {width, CGFLOAT_MAX};
    CGSize textSize = [_textView sizeThatFits:restrictedSize];
    
    if (_textView.text.length > 0) {
        return textSize.height;
    }
    
    if (_placeholder.length > 0) {
        CGSize placeHolderSize = [_placeholderView sizeThatFits:restrictedSize];
        return MAX(textSize.height, placeHolderSize.height);
    }
    
    return _textView.font.lineHeight;
}

- (NSInteger)cursorPosition {
    UITextRange *selectedRange = _textView.selectedTextRange;
    UITextPosition *position = selectedRange.start;
    if (!(selectedRange.empty) && _textView.selectionAffinity == UITextStorageDirectionForward) {
        position = selectedRange.end;
    }
    return [_textView offsetFromPosition:_textView.beginningOfDocument toPosition:position];
}

- (void)setSelectionFrom:(NSInteger)selectionStart to:(NSInteger)selectionEnd {
    [_textView setSelectedRange:NSMakeRange(selectionStart, selectionEnd - selectionStart)];
}

- (CGRect)cursorRect {
    UITextRange *selectedRange = _textView.selectedTextRange;
    UITextPosition *position = selectedRange.start;
    if (!(selectedRange.empty) && _textView.selectionAffinity == UITextStorageDirectionForward) {
        position = selectedRange.end;
    }
    CGRect caretRect = [_textView caretRectForPosition:position];
    if (isinf(caretRect.origin.x)) {
        caretRect.origin.x = 0;
    }
    if (isinf(caretRect.origin.y)) {
        caretRect.origin.y = self.frame.size.height;
    }
    if (caretRect.origin.y < 0 && [self cursorPosition] == _textView.text.length) {
        // 在文档末尾换行会产生莫名的负数偏移
        caretRect.origin.y = _textView.frame.size.height - _textView.font.lineHeight;
    }
    
    return caretRect;
}

- (void)setScrollEnabled:(BOOL)scrollEnabled {
    _scrollEnabled = scrollEnabled;
    _textView.scrollEnabled = scrollEnabled;
}

- (BOOL)isFirstResponder
{
    return _textView.isFirstResponder;
}

- (BOOL)becomeFirstResponder
{
  _jsRequestingFirstResponder = YES;
  BOOL result = [_textView becomeFirstResponder];
  _jsRequestingFirstResponder = NO;
  return result;
}

- (BOOL)resignFirstResponder
{
  [super resignFirstResponder];
  BOOL result = [_textView resignFirstResponder];
  if (result) {
    [_eventDispatcher sendTextEventWithType:RCTTextEventTypeBlur
                                   reactTag:self.reactTag
                                       text:_textView.text
                                        key:nil
                                 eventCount:_nativeEventCount];
  }
  return result;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
    CGRect fixRect = (CGRect){-kTextViewLeftOffset,0,self.bounds.size.width + kTextViewLeftOffset, self.bounds.size.height};
    _textView.frame = fixRect;
    _placeholderView.frame = fixRect;
  [self updateFrames];
}

- (BOOL)canBecomeFirstResponder
{
  return _jsRequestingFirstResponder;
}

- (UIFont *)defaultPlaceholderFont
{
  return [UIFont systemFontOfSize:17];
}

- (UIColor *)defaultPlaceholderTextColor
{
  return [UIColor colorWithRed:0.0/255.0 green:0.0/255.0 blue:0.098/255.0 alpha:0.22];
}

@end
