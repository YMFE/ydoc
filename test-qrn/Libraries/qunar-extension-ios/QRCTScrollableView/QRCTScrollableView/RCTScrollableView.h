//
//  QRNCustomScrollView.h
//  RCTVibration
//
//  Created by jingxuan.dou on 16/3/1.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTView.h"

@interface RCTScrollableView : RCTView

@property (nonatomic, assign, getter=isDragging) BOOL dragging;
@property (nonatomic, assign) CGPoint contentOffset;
@property (nonatomic, assign) CGSize contentSize;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, copy) NSIndexSet *stickyHeaderIndices;


- (void)scrollToX:(CGFloat)x y:(CGFloat)y;

@end
