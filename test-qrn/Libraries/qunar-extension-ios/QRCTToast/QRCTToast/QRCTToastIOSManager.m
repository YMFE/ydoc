//
//  ToastIOSManager.m
//  QRCTToast
//
//  Created by 殷文昭 on 16/1/6.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "QRCTToastIOSManager.h"
#import "QRCTArrowToaster.h"

#define FixTopSpace 40
#define FixButtomSpace 40

@interface QRCTToastIOSManager ()

@property (strong, nonatomic) QRCTArrowToaster *toaster;
@property (weak, nonatomic) NSTimer *timer;
@end


@implementation QRCTToastIOSManager

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}



RCT_EXPORT_METHOD(show:(NSString *)message duringTime:(NSTimeInterval)duringTime topOffSet:(CGFloat)offset)
{
    [self showMessage:message duringTime:duringTime topOffSet:offset];
}

- (void)showMessage:(NSString *)message duringTime:(NSTimeInterval)duringTime topOffSet:(CGFloat)offset
{
    if (_toaster) {
        [self dismissToast];
    }
    
    _toaster = [[QRCTArrowToaster alloc] initWithMinWidth:10 andText:message dismissAfterTime:0];
    CGSize toasterSize = [_toaster getToasterSize];
    UIWindow *topWindow = [[UIApplication sharedApplication] delegate].window;
    // 获取程序代理
    CGRect topWindowFrame = topWindow.frame;
    
    
    // 初始化控制器view
    CGSize screanSize  = [UIScreen mainScreen].bounds.size;
    
    
    if(offset + toasterSize.height/2 + FixButtomSpace >  screanSize.height){
        offset = screanSize.height - FixButtomSpace - toasterSize.height/2;
    }
    if (offset < toasterSize.height/2 + FixTopSpace) {
        offset = toasterSize.height/2 + FixTopSpace;
    }
    
    CGRect newFrame = CGRectMake((CGFloat)((screanSize.width -toasterSize.width) / 2 - topWindowFrame.origin.x),
                                 offset - topWindowFrame.origin.y - toasterSize.height/2,
                                 toasterSize.width,
                                 toasterSize.height);
    
    [_toaster setFrame:newFrame];
    
    [_toaster setBackgroundColor:[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.5]];
    [_toaster setTextAlignment:NSTextAlignmentCenter];
    [_toaster showInView:topWindow];
    
    
    if (duringTime >0) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:duringTime target:self selector:@selector(dismissToast) userInfo:nil repeats:NO];
    }
}

- (void) dismissToast{
    
    if (_timer) {
        [_timer invalidate];
    }
    
    [_toaster removeFromSuperview];
    
    _toaster = nil;
}

- (NSDictionary<NSString *, id> *)constantsToExport{
    
    return @{
             @"LONG": @1000,
             @"SHORT": @400,
             @"TOP":@0,
             @"MIDDLE":[NSNumber numberWithFloat:[UIScreen mainScreen].bounds.size.height/2],
             @"BOTTOM":[NSNumber numberWithFloat:[UIScreen mainScreen].bounds.size.height],
             };
};
@end
