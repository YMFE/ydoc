//
//  QRCTCameraViewManager.m
//  QRCTCamera
//
//  Created by 殷文昭 on 16/1/8.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "QRCTCameraViewManager.h"
#import "QRCTCameraView.h"
#import "QRCTCamera.h"
#import <RCTShadowView.h>
#import "RCTBridge.h"
#import "RCTUIManager.h"
#import <RCTUtils.h>

@interface QRCTCameraViewManager()

@end

@implementation QRCTCameraViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    QRCTCameraView *view = [[QRCTCameraView alloc] init];
    view.imageStoreManager = self.bridge.imageStoreManager;
    return  view;
}

RCT_REMAP_VIEW_PROPERTY(cameraStart, startCamera, BOOL);
RCT_EXPORT_VIEW_PROPERTY(cameraFlash, NSString);
RCT_EXPORT_VIEW_PROPERTY(cameraPosition, NSString);
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)



RCT_EXPORT_METHOD(focusCamera:(nonnull NSNumber *)reactTag XPosition:(CGFloat)x YPosition:(CGFloat)y)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, QRCTCameraView *> *viewRegistry) {
        
        QRCTCameraView *view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[QRCTCameraView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting QCameraView, got: %@", view);
            
        } else {
            CGPoint point  = CGPointMake(x, y);
            [view focusAtPoint:point];
        }
    }];
}


RCT_EXPORT_METHOD(takePhoto:(nonnull NSNumber *)reactTag
                  successCallback:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, QRCTCameraView *> *viewRegistry) {
        QRCTCameraView *view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[QRCTCameraView class]]) {
        
            RCTLogError(@"Invalid view returned from registry, expecting QCameraView, got: %@", view);
            
            //TODO :
            errorCallback(QJSResponseFail(QRCTErrorCodeViewInvalid, QRCTErrorCodeCameraMapMessage(QRCTErrorCodeViewInvalid)));

        
        } else {
            [view takePhoto:^(NSString *imageURI, NSInteger errorCode) {
                if (imageURI) {
                    successCallback(@[imageURI]);
                } else {
                    errorCallback(QJSResponseFail(errorCode, QRCTErrorCodeCameraMapMessage(errorCode)));
                }
            }];
        }
    }];
    
}
@end
