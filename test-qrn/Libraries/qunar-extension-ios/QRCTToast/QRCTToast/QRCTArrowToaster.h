//
//  ArrowToaster.h
//  QunariPhone
//
//  Created by HeYichen on 14-2-13.
//  Copyright (c) 2014年 Qunar.com. All rights reserved.
//
@import UIKit;

typedef enum ArrowToasterPosition : NSUInteger
{
    eArrowToasterPositionTop,
    eArrowToasterPositionBottom,
} ArrowToasterPosition;

@interface QRCTArrowToaster : UIControl

// 显示一个Toaster在屏幕上
+ (void)toasterShowWithMinWidth:(NSInteger)minWidthInit andText:(NSString *)text dismissAfterTime:(NSTimeInterval)timeIntervalInit;

// 初始化(如果不自动消失，timeIntervalInit传入0)
- (instancetype)initWithMinWidth:(NSInteger)minWidthInit andText:(NSString *)text dismissAfterTime:(NSTimeInterval)timeIntervalInit;

// 获取Size
- (CGSize)getToasterSize;

// 使用默认位置显示Toaster
- (void)showToasterWithPosition:(ArrowToasterPosition)position;

// 设置Frame(重载)
- (void)setFrame:(CGRect)frameNew;

// 设置文本
- (void)setText:(NSString *)textNew;

// 设置对齐方式
- (void)setTextAlignment:(NSTextAlignment)textAlignment;

// 设置背景图片
- (void)setBackgroundImage:(UIImage *)imgNew;

// 设置edgeInsets
- (void)setEdgeInsets:(UIEdgeInsets)edgeInsets;

// 显示
- (void)showInView:(UIView *)viewParent;

@end
