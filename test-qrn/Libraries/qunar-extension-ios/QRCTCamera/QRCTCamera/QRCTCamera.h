//
//  QRCTCamera.h
//  QRCTCamera
//
//  Created by 殷文昭 on 16/1/8.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <QRCTError.h>

@import UIKit;

typedef NS_ENUM(NSInteger, QRCTCameraPosition){
  QRCTCameraPositionRear = 10,
  QRCTCameraPositionFront
};

typedef NS_ENUM(NSInteger, QRCTCameraFlash){
  QRCTCameraFlashOff = 10,
  QRCTCameraFlashOn,
  QRCTCameraFlashAuto
};

typedef NS_ENUM(NSInteger,QRCTCameraMirror){
  QRCTCameraMirrorOff = 10,
  QRCTCameraMirrorOn,
  QRCTCameraMirrorAuto
};

typedef NS_ENUM(NSInteger, QRCTErrorCodeCamera){

    //设备错误
    QRCTErrorCodeCameraSession    = 20202,
    
    //参数设置错误
    QRCTErrorCodeCameraPara       = 20203,
    
    //拍照错误
    QRCTErrorCodeCameraCapture    = 20204,
    
};

#ifdef __cplusplus
extern "C" {
#endif
    NSString * QRCTErrorCodeCameraMapMessage(NSInteger errcode);
#ifdef __cplusplus
}
#endif

@interface QRCTCamera : NSObject

@property (nonatomic, copy) void (^onError)(QRCTCamera *camera, NSInteger errorCode);
@property (assign, nonatomic) QRCTCameraFlash flash;
@property (assign, nonatomic) QRCTCameraPosition cameraPosition;
@property (assign, nonatomic) QRCTCameraMirror mirror;

+ (instancetype)shareCamera;

- (void)start;
//
///**
// * Stops the running camera session. Needs to be called when the app doesn't show the view.
// */
- (void)stop;


- (void)attachToView:(UIView *)view;

- (void)removeFromView:(UIView *)view;

- (void)resizePreviewView:(CGSize)size;

- (void)focusAtPoint:(CGPoint)point;


-(void)capture:(void (^)(QRCTCamera *camera, UIImage *image, NSDictionary *metadata, NSError *error))onCapture exactSeenImage:(BOOL)exactSeenImage;

@end
