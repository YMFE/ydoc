//
//  QRCTShadowTextView.m
//  QRCTTextInput
//
//  Created by yingdong.guo on 2015/11/30.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "QRCTTextView.h"
#import "QRCTShadowTextView.h"
#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RCTConvert.h"
#import "RCTUtils.h"
#import "CSSLayout.h"
#import <UIKit/UIKit.h>

@interface QRCTShadowTextView ()

@property (nonatomic, strong) UIFont *font;
@property (nonatomic, assign) BOOL autoResizeHasSet;
@property (nonatomic, assign) BOOL textHasUpdated;
@property (nonatomic, assign) CGSize updatedSize;
@property (nonatomic, weak) RCTBridge *bridge;

@end

@implementation QRCTShadowTextView

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    self = [super init];
    if (self) {
        _bridge = bridge;
        CSSNodeSetMeasureFunc(self.cssNode, RCTMeasure);
    }
    return self;
}

static CSSSize RCTMeasure(void *context, float width, CSSMeasureMode widthMode, float height, CSSMeasureMode heightMode)
{
    QRCTShadowTextView *thisView = (__bridge QRCTShadowTextView *)context;
    
    if (!thisView.autoResize) {
        // super.measure
        CSSSize result;
        result.width = thisView.width;
        result.height = isnan(thisView.height)?0:thisView.height;
        
        return result;
    }
    
    __block QRCTTextView *textView;
    __block float blockHeight = height;
  
    RCTExecuteOnMainThread( ^{
        textView = (QRCTTextView *)[thisView.bridge.uiManager viewForReactTag:thisView.reactTag];
        [textView setPlaceholder:thisView.placeholder];
        blockHeight = [textView calculateRecommendHeightForWidth: width + 5];
    },YES);
    height = blockHeight;
  
    CSSSize result;
    result.width = RCTCeilPixelValue(width);
    result.height = RCTCeilPixelValue(height);
    
    return result;
}

- (NSDictionary *)processUpdatedProperties:(NSMutableSet *)applierBlocks parentProperties:(NSDictionary *)parentProperties {
    parentProperties = [super processUpdatedProperties:applierBlocks parentProperties:parentProperties];
    
    __weak typeof(self) weakSelf = self;
    if (_autoResizeHasSet) {
        [applierBlocks addObject:^(NSDictionary *viewRegistry) {
            QRCTTextView *view = viewRegistry[weakSelf.reactTag];
            view.scrollEnabled = !weakSelf.autoResize;
        }];
        _autoResizeHasSet = NO;
    }
    
    return parentProperties;
}

- (void)setFontFamily:(NSString *)fontFamily {
    [self setNeedUpdate:YES];
}

- (void)setFontSize:(CGFloat)fontSize {
    [self setNeedUpdate:YES];
}

- (void)setFontStyle:(NSString *)fontStyle {
    [self setNeedUpdate:YES];
}

- (void)setFontWeight:(NSString *)fontWeight {
    [self setNeedUpdate:YES];
}

- (void)setPlaceholder:(NSString *)placeholder {
    _placeholder = placeholder;
    [self setNeedUpdate:YES];
}

- (void)setAutoResize:(BOOL)autoResize {
    if (_autoResize != autoResize) {
        _autoResizeHasSet = YES;
    }
    CSSNodeMarkDirty(self.cssNode);
  
    [self dirtyPropagation];
  
  _autoResize = autoResize;
}

@end
