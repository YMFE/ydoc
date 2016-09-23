//
//  QRCTCameraView.h
//  QRCTCamera
//
//  Created by 殷文昭 on 16/1/8.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "RCTView.h"
#import "QRCTCamera.h"
#import "RCTImageStoreManager.h"

@interface QRCTCameraView : UIView

@property (strong, nonatomic, readonly)QRCTCamera *camera;

@property (weak, nonatomic) RCTImageStoreManager *imageStoreManager;

- (void)focusAtPoint:(CGPoint)point;

- (void)takePhoto:(void (^)(NSString *imageURI,NSInteger errorCode))completeHandle;

@end
