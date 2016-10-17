//
//  QRCTCameraView.m
//  QRCTCamera
//
//  Created by 殷文昭 on 16/1/8.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "QRCTCameraView.h"
#import "QRCTCamera.h"

@interface QRCTCameraView()
@property (strong, nonatomic, readwrite)QRCTCamera *camera;
@property (nonatomic) BOOL startCamera;
@property (assign, nonatomic) QRCTCameraFlash flash;
@property (assign, nonatomic) QRCTCameraPosition position;
@property (strong, atomic) NSMutableArray<NSString *> *photos;
@property (nonatomic, copy) void (^onCameraError)(QRCTCamera *camera, NSInteger errorCode);
@property (atomic) BOOL firstShowed;
@end


@implementation QRCTCameraView


- (instancetype) initWithFrame:(CGRect)frame{
    if ((self = [super initWithFrame:frame])) {
        _photos = [[NSMutableArray alloc] init];
        _firstShowed = NO;
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [_camera resizePreviewView:self.bounds.size];
}

#pragma mark - setCamera

- (void)setCameraFlash:(NSString *)flash{
    QRCTCameraFlash tempFlash;
    
    do {
        if ([flash isEqualToString:@"on"]) {
            tempFlash = QRCTCameraFlashOn;
            break ;
        }
        
        if ([flash isEqualToString:@"off"]) {
            tempFlash = QRCTCameraFlashOff;
            break;
            
        }
        
        if ([flash isEqualToString:@"auto"]) {
            tempFlash = QRCTCameraFlashAuto;
            break;
        }
        return;
        
    } while (NO);
    
    if (tempFlash!=_flash) {
        _flash = tempFlash;
        _camera.flash = _flash;
    }
}


- (void)setCameraPosition:(NSString *)cameraPosition{
    
    QRCTCameraPosition tempPositon;
    do {
        if ([cameraPosition isEqualToString:@"rear"]) {
            tempPositon = QRCTCameraPositionRear;
            break ;
        }
        
        if ([cameraPosition isEqualToString:@"front"]) {
            tempPositon = QRCTCameraPositionFront;
            break ;
        }
        return;
    } while (NO);
    
    if (tempPositon != _position) {
        _position = tempPositon;
        _camera.cameraPosition = _position;
    }
}

- (void)setStartCamera:(BOOL)startCamera{
    _startCamera = startCamera;

    if (!_firstShowed) {
        _firstShowed = YES;
        return;
    }
   
    if (startCamera) {
        if (_onCameraError) {
            [_camera start];
            [self setCameraPara];
        }
    }else{
        [_camera stop];
    }
}

-(void)setOnError:(RCTDirectEventBlock)onError{
  
    _onCameraError = ^(QRCTCamera *camera,NSInteger errorCode){
        if (!onError) {
            return ;
        }
        onError(QJSEventFail(errorCode, QRCTErrorCodeCameraMapMessage(errorCode)));
        
    };
    _camera.onError = _onCameraError;
}

- (void)setCameraPara{
    _camera.cameraPosition = _position;
    _camera.flash = _flash;
    _camera.onError = _onCameraError;
}

#pragma mark - Camera Function

- (void)focusAtPoint:(CGPoint)point{
    [_camera focusAtPoint:point];
}

- (void) takePhoto:(void (^)(NSString *imageURI,NSInteger errorCode))completeHandle{
    
    if (!_camera) {
        if (completeHandle) {
            completeHandle(nil,QRCTErrorCodeCameraCapture);
        }
        return;
    }
    
    [_camera capture:^(QRCTCamera *camera, UIImage *image, NSDictionary *metadata, NSError *error) {
        if (error) {
            if (completeHandle) {
                completeHandle(nil, QRCTErrorCodeCameraCapture);
            }
            return;
        }
        
        [_imageStoreManager storeImage:image withBlock:^(NSString *imageTag) {
            if (!imageTag) {
                if (completeHandle) {
                    completeHandle(nil, QRCTErrorCodeCameraCapture);
                }
                return;
            }
            [_photos addObject:imageTag];
            if (completeHandle) {
                completeHandle(imageTag,0);
            }
        }];
        
    }
      exactSeenImage:YES];
    
};


#pragma mark - CameraView Lift Cycle
-(void) willMoveToWindow:(UIWindow *)newWindow{

    //⚠️ 如果在2个都需要使用这个View的页面之间切换，如TabVC的2个页面，则调用的顺序是先调用newWindow为非nil，后调用newWindow为nil的。
    // 导致的是camera先调用的start，后调用stop。
    // 不过[_camera start]函数是异步的，调用返回后开始的操作并没有真正执行，其会在后面的[_camera stop]之后执行真正的开始摄像机操作，因此不用担心新的view中的📷被关闭掉

    if (newWindow) {
        
        _camera = [QRCTCamera shareCamera];
        [_camera resizePreviewView:self.bounds.size];
        [_camera attachToView:self];
        
        if (_startCamera) {
            [_camera start];
            [self setCameraPara];
        }else{
            [_camera stop];
        }
        
    }else{
        [_camera stop];
        [_camera removeFromView:self];
        _camera = nil;
    }
}

- (void)dealloc{
    
    [_camera removeFromView:self];
    _camera = nil;
    
    for (NSString* photoTag in _photos) {
        [_imageStoreManager removeImageForTag:photoTag withBlock:nil];
    }
}

@end
