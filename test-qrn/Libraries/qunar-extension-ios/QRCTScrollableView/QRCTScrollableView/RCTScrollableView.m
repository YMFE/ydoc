//
//  QRNCustomScrollView.m
//  RCTVibration
//
//  Created by jingxuan.dou on 16/3/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTScrollableView.h"
#import "RCTLog.h"
#import "UIView+Private.h"
#import "UIView+React.h"

CGFloat const QRN_ZINDEX_DEFAULT = 0;
CGFloat const QRN_ZINDEX_STICKY_HEADER = 50;

@interface RCTScrollableView ()
{
  CGRect _lastClippedToRect;
}

@end

@implementation RCTScrollableView
@synthesize contentOffset = _contentOffset;

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    _contentOffset = CGPointZero;
    self.layer.masksToBounds = YES;
  }
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)coder
{
  self = [super initWithCoder:coder];
  if (self) {
    _contentOffset = CGPointZero;
    self.layer.masksToBounds = YES;
  }
  return self;
}

- (void)setBounds:(CGRect)bounds{
  //设置ScrollableView的frame时，实际上RN内部是设置的bounds，因此需要重新设置上次使用的contentOffset
  CGRect newBounds = CGRectMake(_contentOffset.x, _contentOffset.y, CGRectGetWidth(bounds), CGRectGetHeight(bounds));
  [super setBounds:newBounds];
}

- (void)setContentOffset:(CGPoint)contentOffset
{
  _contentOffset = contentOffset;
  self.bounds = CGRectMake(contentOffset.x, contentOffset.y, CGRectGetWidth(self.bounds), CGRectGetHeight(self.bounds));
  self.contentSize = CGSizeMake(CGRectGetWidth(self.bounds), CGRectGetHeight(self.bounds));
}

- (CGPoint)contentOffset
{
  return _contentOffset;
}

- (void)scrollToX:(CGFloat)x y:(CGFloat)y
{
  CGPoint offset = CGPointMake(x,y);
  self.contentOffset = offset;
  [self dockClosestSectionHeader];
}

- (void)setStickyHeaderIndices:(NSIndexSet *)stickyHeaderIndices{
  if ([_stickyHeaderIndices isEqualToIndexSet:stickyHeaderIndices]){
    return;
  }
  
  if (self.subviews.count < 1) {
    _stickyHeaderIndices = [stickyHeaderIndices copy];
    return;
  }
  
  UIView *contentView = self.subviews[0];
  
  [_stickyHeaderIndices enumerateIndexesWithOptions:0 usingBlock:
   ^(NSUInteger idx, __unused BOOL *stop) {
     UIView *header = contentView.reactSubviews[idx];
     
     header.transform = CGAffineTransformIdentity;
     header.layer.zPosition = QRN_ZINDEX_DEFAULT;
   }];
  
  _stickyHeaderIndices = [stickyHeaderIndices copy];
}

- (void)dockClosestSectionHeader
{
  //根据查看层次判断出Scrollview的Subviews
  if (self.subviews.count < 1) {
    return;
  }
  
  UIView * tempContentView = self.subviews[0];
  UIView *contentView = tempContentView;
  
  CGFloat scrollTop = self.layer.bounds.origin.y + self.contentInset.top;
  
  // Find the section headers that need to be docked
  __block UIView *previousHeader = nil;
  __block UIView *currentHeader = nil;
  __block UIView *nextHeader = nil;
  
  NSUInteger subviewCount = contentView.reactSubviews.count;
  [_stickyHeaderIndices enumerateIndexesWithOptions:0 usingBlock:
   ^(NSUInteger idx, __unused BOOL *stop) {
     
     if (idx >= subviewCount) {
       RCTLogError(@"Sticky header index %zd was outside the range {0, %zd}", idx, subviewCount);
       return;
     }
     
     UIView *header = contentView.reactSubviews[idx];
     
     // If nextHeader not yet found, search for docked headers
     if (!nextHeader) {
       CGFloat height = header.bounds.size.height;
       CGFloat top = header.center.y - height * header.layer.anchorPoint.y;
       if (top > scrollTop) {
         nextHeader = header;
       } else {
         previousHeader = currentHeader;
         currentHeader = header;
       }
     }
     
     // Reset transforms for header views
     header.transform = CGAffineTransformIdentity;
     header.layer.zPosition = QRN_ZINDEX_DEFAULT;
     
   }];
  
  
  // If no docked header, bail out
  if (!currentHeader) {
    return;
  }
  
  // Adjust current header to hug the top of the screen
  CGFloat currentFrameHeight = currentHeader.bounds.size.height;
  CGFloat currentFrameTop = currentHeader.center.y - currentFrameHeight * currentHeader.layer.anchorPoint.y;
  CGFloat yOffset = scrollTop - currentFrameTop;
  if (nextHeader) {
    // The next header nudges the current header out of the way when it reaches
    // the top of the screen
    CGFloat nextFrameHeight = nextHeader.bounds.size.height;
    CGFloat nextFrameTop = nextHeader.center.y - nextFrameHeight * nextHeader.layer.anchorPoint.y;
    CGFloat overlap = currentFrameHeight - (nextFrameTop - scrollTop);
    yOffset -= MAX(0, overlap);
  }
  currentHeader.transform = CGAffineTransformMakeTranslation(0, yOffset);
  currentHeader.layer.zPosition = QRN_ZINDEX_STICKY_HEADER;
  
  if (previousHeader) {
    // The previous header sits right above the currentHeader's initial position
    // so it scrolls away nicely once the currentHeader has locked into place
    CGFloat previousFrameHeight = previousHeader.bounds.size.height;
    CGFloat targetCenter = currentFrameTop - previousFrameHeight * (1.0 - previousHeader.layer.anchorPoint.y);
    yOffset = targetCenter - previousHeader.center.y;
    previousHeader.transform = CGAffineTransformMakeTranslation(0, yOffset);
    previousHeader.layer.zPosition = QRN_ZINDEX_STICKY_HEADER;
  }
  
  
  //    //Native代码让 header的宽默认与Scrollview 一致 JS去保持改变宽  注释掉Native代码
  //     previousHeader.frame = CGRectMake(previousHeader.frame.origin.x,previousHeader.frame.origin.y, self.layer.frame.size.width, previousHeader.frame.size.height);
  //     currentHeader.frame = CGRectMake(currentHeader.frame.origin.x,currentHeader.frame.origin.y, self.layer.frame.size.width, currentHeader.frame.size.height);
  //     nextHeader.frame = CGRectMake(nextHeader.frame.origin.x,nextHeader.frame.origin.y, self.layer.frame.size.width, nextHeader.frame.size.height);
  
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  __block UIView *hitView;
  
  UIView *contentView =  self.subviews[0];
  
  [_stickyHeaderIndices enumerateIndexesWithOptions:0 usingBlock:^(NSUInteger idx, BOOL *stop) {
    UIView *stickyHeader = contentView.reactSubviews[idx];
    CGPoint convertedPoint = [stickyHeader convertPoint:point fromView:self];
    hitView = [stickyHeader hitTest:convertedPoint withEvent:event];
    *stop = (hitView != nil);
  }];
  
  return hitView ?: [super hitTest:point withEvent:event];
}

@end
