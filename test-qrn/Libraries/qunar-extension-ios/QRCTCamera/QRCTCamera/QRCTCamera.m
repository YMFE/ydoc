//
//  QRCTCamera.m
//  QRCTCamera
//
//  Created by 殷文昭 on 16/1/8.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "QRCTCamera.h"
#import <ImageIO/CGImageProperties.h>
#import "UIImage+QRCTFixOrientation.h"
@import AVFoundation;
@import CoreMotion;

@interface QRCTCamera()

@property (strong, nonatomic) NSString *cameraQuality;
@property (strong, nonatomic) AVCaptureStillImageOutput *stillImageOutput;
@property (strong, nonatomic) AVCaptureSession *session;
@property (strong, nonatomic) AVCaptureDevice *videoCaptureDevice;
@property (strong, nonatomic) AVCaptureDeviceInput *videoDeviceInput;
@property (strong, nonatomic) AVCaptureDeviceInput *audioDeviceInput;
@property (strong, nonatomic) AVCaptureVideoPreviewLayer *captureVideoPreviewLayer;
@property (strong, nonatomic) AVCaptureMovieFileOutput *movieFileOutput;

@property (strong, nonatomic) UIView *preview;

@property (nonatomic) BOOL fixOrientationAfterCapture;

@property (strong, nonatomic) CMMotionManager *motionManager;
@property  AVCaptureVideoOrientation cameraOrientation;

@end


NSString *const QRCTCameraErrorDomain = @"QRCTCameraErrorDomain";

NSString * QRCTErrorCodeCameraMapMessage(NSInteger errcode){
    
    switch (errcode) {
            
        case QRCTErrorCodeCameraPermission:
            return @"User denied access to camera.";
            
        case QRCTErrorCodeCameraSession:
            return @"Fail to edit device.";
            
        case QRCTErrorCodeCameraPara:
            return @"Fail to edit device parameter.";
            
        case QRCTErrorCodeCameraCapture:
            return @"Fail to take photo.";
            
        case QRCTErrorCodeViewInvalid:
            return @"Invalid view returned from registry, expecting QCameraView";
            
        default:
            return @"unknow error";
    }
};

@implementation QRCTCamera

+ (instancetype)shareCamera{
  static QRCTCamera *camera;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    camera = [[QRCTCamera alloc] initWithQuality:AVCaptureSessionPresetHigh position:QRCTCameraPositionRear];
  });
  return camera;
}

- (id)init {
  NSAssert(false,@"this method not available !");
  return nil;
}

- (void)dealloc {
  [self stop];
}

- (instancetype)initWithQuality:(NSString *)quality position:(QRCTCameraPosition)position
{
  self = [super init];
  if(self) {
    CGRect bounds =     [[UIScreen mainScreen]bounds];
    _preview = [[UIView alloc] initWithFrame:bounds];
    [self setupWithQuality:quality position:position];
  }
  
  return self;
}

- (void)setupWithQuality:(NSString *)quality
                position:(QRCTCameraPosition)position
{
  _cameraQuality = quality;
  _cameraPosition = position;
  _fixOrientationAfterCapture = YES;
  _flash = QRCTCameraFlashOff;
  _mirror = QRCTCameraMirrorAuto;

}


- (void)attachToView:(UIView *)view
{
  [self.preview removeFromSuperview];
  [view addSubview:self.preview];
}

- (void)removeFromView:(UIView *)view{
    
    if (self.preview.superview == view) {
        [self.preview removeFromSuperview];
    }
    
};

- (void)resizePreviewView:(CGSize)size
{
    [_captureVideoPreviewLayer removeFromSuperlayer];
  self.preview.frame = CGRectMake(0, 0,size.width,size.height);
  
  CGRect bounds = self.preview.bounds;
  self.captureVideoPreviewLayer.bounds = bounds;
  self.captureVideoPreviewLayer.position = CGPointMake(CGRectGetMidX(bounds), CGRectGetMidY(bounds));
  
    self.captureVideoPreviewLayer.connection.videoOrientation = AVCaptureVideoOrientationPortrait;        [self.preview.layer addSublayer:_captureVideoPreviewLayer];
}

- (void)start
{
  [QRCTCamera requestCameraPermission:^(BOOL granted) {
    if(granted) {
        [self startMotion];
        [self initialize];        
    }
    else {
      if(self.onError) {
        self.onError(self, QRCTErrorCodeCameraPermission);
      }
    }
  }];
}

- (void)initialize
{
  if(!_session) {
    _session = [[AVCaptureSession alloc] init];
    _session.sessionPreset = self.cameraQuality;
    
    // preview layer
    CGRect bounds = [_preview bounds];
    
//self.preview.layer.bounds;
    _captureVideoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:self.session];
    _captureVideoPreviewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    _captureVideoPreviewLayer.bounds = bounds;
    _captureVideoPreviewLayer.position = CGPointMake(CGRectGetMidX(bounds), CGRectGetMidY(bounds));
    [self.preview.layer addSublayer:_captureVideoPreviewLayer];
    
    AVCaptureDevicePosition devicePosition;
    switch (self.cameraPosition) {
      case QRCTCameraPositionRear:
        if([self.class isRearCameraAvailable]) {
          devicePosition = AVCaptureDevicePositionBack;
        } else {
          devicePosition = AVCaptureDevicePositionFront;
          _cameraPosition = QRCTCameraPositionFront;
        }
        break;
      case QRCTCameraPositionFront:
        if([self.class isFrontCameraAvailable]) {
          devicePosition = AVCaptureDevicePositionFront;
        } else {
          devicePosition = AVCaptureDevicePositionBack;
          _cameraPosition = QRCTCameraPositionRear;
        }
        break;
      default:
        devicePosition = AVCaptureDevicePositionUnspecified;
        break;
    }
    
    if(devicePosition == AVCaptureDevicePositionUnspecified) {
      _videoCaptureDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    } else {
      _videoCaptureDevice = [self cameraWithPosition:devicePosition];
    }
    
    NSError *error = nil;
    _videoDeviceInput = [AVCaptureDeviceInput deviceInputWithDevice:_videoCaptureDevice error:&error];
    
    if (!_videoDeviceInput) {
      if(self.onError) {
        self.onError(self, QRCTErrorCodeCameraSession);
      }
      return;
    }
    
    if([self.session canAddInput:_videoDeviceInput]) {
      [self.session  addInput:_videoDeviceInput];
        self.captureVideoPreviewLayer.connection.videoOrientation = AVCaptureVideoOrientationPortrait;
    }
    
    self.stillImageOutput = [[AVCaptureStillImageOutput alloc] init];
    NSDictionary *outputSettings = [[NSDictionary alloc] initWithObjectsAndKeys: AVVideoCodecJPEG, AVVideoCodecKey, nil];
    [self.stillImageOutput setOutputSettings:outputSettings];
    [self.session addOutput:self.stillImageOutput];
  }
  
  //if we had disabled the connection on capture, re-enable it
  if (![self.captureVideoPreviewLayer.connection isEnabled]) {
    [self.captureVideoPreviewLayer.connection setEnabled:YES];
  }
  
  [self.session startRunning];
}
- (void)startMotion{
  _cameraOrientation = AVCaptureVideoOrientationPortrait;
  _motionManager = [[CMMotionManager alloc] init];
  _motionManager.accelerometerUpdateInterval = .2;
  _motionManager.gyroUpdateInterval = .2;
  [_motionManager startAccelerometerUpdatesToQueue:[NSOperationQueue currentQueue]
                                       withHandler:^(CMAccelerometerData  *accelerometerData, NSError *error) {
                                         if (!error) {
                                           [self outputAccelertionData:accelerometerData.acceleration];
                                         }
                                         else{
                                           NSLog(@"%@", error);
                                         }
                                       }];
  

}

- (void)stop{
    [_motionManager stopAccelerometerUpdates];
    _motionManager = nil;
    [self.session stopRunning];
}


#pragma mark - Image Capture

-(void)capture:(void (^)(QRCTCamera *camera, UIImage *image, NSDictionary *metadata, NSError *error))onCapture exactSeenImage:(BOOL)exactSeenImage
{
  if(!self.session) {
    NSError *error = [NSError errorWithDomain:QRCTCameraErrorDomain
                                         code:QRCTErrorCodeCameraSession
                                     userInfo:nil];
    onCapture(self, nil, nil, error);
    return;
  }
  
  // get connection and set orientation
  AVCaptureConnection *videoConnection = [self captureConnection];
  videoConnection.videoOrientation = [self orientationForConnection];
  
  // freeze the screen
//  [self.captureVideoPreviewLayer.connection setEnabled:NO];
  
  [self.stillImageOutput captureStillImageAsynchronouslyFromConnection:videoConnection completionHandler: ^(CMSampleBufferRef imageSampleBuffer, NSError *error) {
    
    UIImage *image = nil;
    NSDictionary *metadata = nil;
    
    // check if we got the image buffer
    if (imageSampleBuffer != NULL) {
      CFDictionaryRef exifAttachments = CMGetAttachment(imageSampleBuffer, kCGImagePropertyExifDictionary, NULL);
      if(exifAttachments) {
        metadata = (__bridge NSDictionary*)exifAttachments;
      }
      
      NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageSampleBuffer];
      image = [[UIImage alloc] initWithData:imageData];
      
      if(exactSeenImage) {
        image = [self cropImageUsingPreviewBounds:image];
        
      }
      
      if(self.fixOrientationAfterCapture) {
        image = [image fixOrientation];
      }
    }
    
    // trigger the block
    if(onCapture) {
      dispatch_async(dispatch_get_main_queue(), ^{
        onCapture(self, image, metadata, error);
      });
    }
  }];
}

-(void)capture:(void (^)(QRCTCamera *camera, UIImage *image, NSDictionary *metadata, NSError *error))onCapture
{
  [self capture:onCapture exactSeenImage:NO];
}

#pragma mark - Helpers

- (UIImage *)cropImageUsingPreviewBounds:(UIImage *)image
{
  CGRect previewBounds = self.captureVideoPreviewLayer.bounds;
  CGRect outputRect = [self.captureVideoPreviewLayer metadataOutputRectOfInterestForRect:previewBounds];
  
  CGImageRef takenCGImage = image.CGImage;
  size_t width = CGImageGetWidth(takenCGImage);
  size_t height = CGImageGetHeight(takenCGImage);
  CGRect cropRect = CGRectMake(outputRect.origin.x * width, outputRect.origin.y * height,
                               outputRect.size.width * width, outputRect.size.height * height);
  
  CGImageRef cropCGImage = CGImageCreateWithImageInRect(takenCGImage, cropRect);
  image = [UIImage imageWithCGImage:cropCGImage scale:1 orientation:image.imageOrientation];
  CGImageRelease(cropCGImage);
  
  return image;
}

- (AVCaptureConnection *)captureConnection
{
  AVCaptureConnection *videoConnection = nil;
  for (AVCaptureConnection *connection in self.stillImageOutput.connections) {
    for (AVCaptureInputPort *port in [connection inputPorts]) {
      if ([[port mediaType] isEqual:AVMediaTypeVideo]) {
        videoConnection = connection;
        break;
      }
    }
    if (videoConnection) {
      break;
    }
  }
  
  return videoConnection;
}

- (void)setVideoCaptureDevice:(AVCaptureDevice *)videoCaptureDevice
{
  _videoCaptureDevice = videoCaptureDevice;
  
  if(videoCaptureDevice.flashMode == AVCaptureFlashModeAuto) {
    _flash = QRCTCameraFlashAuto;
  } else if(videoCaptureDevice.flashMode == AVCaptureFlashModeOn) {
    _flash = QRCTCameraFlashOn;
  } else if(videoCaptureDevice.flashMode == AVCaptureFlashModeOff) {
    _flash = QRCTCameraFlashOff;
  } else {
    _flash = QRCTCameraFlashOff;
  }
  
//  // trigger block
//  if(self.onDeviceChange) {
//    self.onDeviceChange(self, videoCaptureDevice);
//  }
}

- (BOOL)isFlashAvailable
{
  return self.videoCaptureDevice.hasFlash && self.videoCaptureDevice.isFlashAvailable;
}

- (BOOL)isTorchAvailable
{
  return self.videoCaptureDevice.hasTorch && self.videoCaptureDevice.isTorchAvailable;
}

- (void)setFlash:(QRCTCameraFlash)cameraFlash
{
    
  if(!self.session)
    return;
  
  AVCaptureFlashMode flashMode;
  
  if(cameraFlash == QRCTCameraFlashOn) {
    flashMode = AVCaptureFlashModeOn;
  } else if(cameraFlash == QRCTCameraFlashAuto) {
    flashMode = AVCaptureFlashModeAuto;
  } else {
    flashMode = AVCaptureFlashModeOff;
  }
  
  if([self.videoCaptureDevice isFlashModeSupported:flashMode]) {
    NSError *error;
    if([self.videoCaptureDevice lockForConfiguration:&error]) {
      self.videoCaptureDevice.flashMode = flashMode;
      [self.videoCaptureDevice unlockForConfiguration];
      
      return;
    }
    else {
      if(self.onError) {
        self.onError(self, QRCTErrorCodeCameraPara);
      }
    }
  }
}

- (void)setMirror:(QRCTCameraMirror)mirror
{
  _mirror = mirror;
  
  if(!self.session) {
    return;
  }
  
  AVCaptureConnection *videoConnection = [_movieFileOutput connectionWithMediaType:AVMediaTypeVideo];
  AVCaptureConnection *pictureConnection = [_stillImageOutput connectionWithMediaType:AVMediaTypeVideo];
  
  switch (mirror) {
    case QRCTCameraMirrorOff: {
      if ([videoConnection isVideoMirroringSupported]) {
        [videoConnection setVideoMirrored:NO];
      }
      
      if ([pictureConnection isVideoMirroringSupported]) {
        [pictureConnection setVideoMirrored:NO];
      }
      break;
    }
      
    case QRCTCameraMirrorOn: {
      if ([videoConnection isVideoMirroringSupported]) {
        [videoConnection setVideoMirrored:YES];
      }
      
      if ([pictureConnection isVideoMirroringSupported]) {
        [pictureConnection setVideoMirrored:YES];
      }
      break;
    }
      
    case QRCTCameraMirrorAuto: {
      BOOL shouldMirror = (_cameraPosition == QRCTCameraPositionFront);
      if ([videoConnection isVideoMirroringSupported]) {
        [videoConnection setVideoMirrored:shouldMirror];
      }
      
      if ([pictureConnection isVideoMirroringSupported]) {
        [pictureConnection setVideoMirrored:shouldMirror];
      }
      break;
    }
  }
  
  return;
}

- (QRCTCameraPosition)togglePosition
{
  if(!self.session) {
    return self.cameraPosition;
  }
  
  if(self.cameraPosition == QRCTCameraPositionRear) {
    self.cameraPosition = QRCTCameraPositionFront;
  } else {
    self.cameraPosition = QRCTCameraPositionRear;
  }
  
  return self.cameraPosition;
}

- (void)setCameraPosition:(QRCTCameraPosition)cameraPosition
{
  if(_cameraPosition == cameraPosition || !self.session) {
    return;
  }
  
  if(cameraPosition == QRCTCameraPositionRear && ![self.class isRearCameraAvailable]) {
    return;
  }
  
  if(cameraPosition == QRCTCameraPositionFront && ![self.class isFrontCameraAvailable]) {
    return;
  }
  
  [self.session beginConfiguration];
  
  // remove existing input
  [self.session removeInput:self.videoDeviceInput];
  
  // get new input
  AVCaptureDevice *device = nil;
  if(self.videoDeviceInput.device.position == AVCaptureDevicePositionBack) {
    device = [self cameraWithPosition:AVCaptureDevicePositionFront];
  } else {
    device = [self cameraWithPosition:AVCaptureDevicePositionBack];
  }
  
  if(!device) {
    return;
  }
  
  // add input to session
  NSError *error = nil;
  AVCaptureDeviceInput *videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:device error:&error];
  if(error) {
    if(self.onError) {
      self.onError(self, QRCTErrorCodeCameraPara);
    }
    [self.session commitConfiguration];
    return;
  }
  
  _cameraPosition = cameraPosition;
  
  [self.session addInput:videoInput];
  [self.session commitConfiguration];
  
  self.videoCaptureDevice = device;
  self.videoDeviceInput = videoInput;
  
  [self setMirror:_mirror];
}


// Find a camera with the specified AVCaptureDevicePosition, returning nil if one is not found
- (AVCaptureDevice *) cameraWithPosition:(AVCaptureDevicePosition) position
{
  NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
  for (AVCaptureDevice *device in devices) {
    if (device.position == position) return device;
  }
  return nil;
}

- (AVCaptureVideoOrientation)orientationForConnection
{
  return _cameraOrientation;
}


#pragma mark - Focus

- (void)focusAtPoint:(CGPoint)point
{
  //坐标转换
  point = [self convertToPointOfInterestFromViewCoordinates:point];
  
  AVCaptureDevice *device = self.videoCaptureDevice;
  if (device.isFocusPointOfInterestSupported && [device isFocusModeSupported:AVCaptureFocusModeAutoFocus]) {
    NSError *error;
    if ([device lockForConfiguration:&error]) {
      device.focusPointOfInterest = point;
      device.focusMode = AVCaptureFocusModeAutoFocus;
      [device unlockForConfiguration];
    }
    
    if(error && self.onError) {
      self.onError(self, QRCTErrorCodeCameraSession);
    }
  }
}


- (CGPoint)convertToPointOfInterestFromViewCoordinates:(CGPoint)viewCoordinates
{
  AVCaptureVideoPreviewLayer *previewLayer = self.captureVideoPreviewLayer;
  
  CGPoint pointOfInterest = CGPointMake(.5f, .5f);
  CGSize frameSize = previewLayer.frame.size;
  
  if ( [previewLayer.videoGravity isEqualToString:AVLayerVideoGravityResize] ) {
    pointOfInterest = CGPointMake(viewCoordinates.y / frameSize.height, 1.f - (viewCoordinates.x / frameSize.width));
  } else {
    CGRect cleanAperture;
    for (AVCaptureInputPort *port in [self.videoDeviceInput ports]) {
      if (port.mediaType == AVMediaTypeVideo) {
        cleanAperture = CMVideoFormatDescriptionGetCleanAperture([port formatDescription], YES);
        CGSize apertureSize = cleanAperture.size;
        CGPoint point = viewCoordinates;
        
        CGFloat apertureRatio = apertureSize.height / apertureSize.width;
        CGFloat viewRatio = frameSize.width / frameSize.height;
        CGFloat xc = .5f;
        CGFloat yc = .5f;
        
        if ( [previewLayer.videoGravity isEqualToString:AVLayerVideoGravityResizeAspect] ) {
          if (viewRatio > apertureRatio) {
            CGFloat y2 = frameSize.height;
            CGFloat x2 = frameSize.height * apertureRatio;
            CGFloat x1 = frameSize.width;
            CGFloat blackBar = (x1 - x2) / 2;
            if (point.x >= blackBar && point.x <= blackBar + x2) {
              xc = point.y / y2;
              yc = 1.f - ((point.x - blackBar) / x2);
            }
          } else {
            CGFloat y2 = frameSize.width / apertureRatio;
            CGFloat y1 = frameSize.height;
            CGFloat x2 = frameSize.width;
            CGFloat blackBar = (y1 - y2) / 2;
            if (point.y >= blackBar && point.y <= blackBar + y2) {
              xc = ((point.y - blackBar) / y2);
              yc = 1.f - (point.x / x2);
            }
          }
        } else if ([previewLayer.videoGravity isEqualToString:AVLayerVideoGravityResizeAspectFill]) {
          if (viewRatio > apertureRatio) {
            CGFloat y2 = apertureSize.width * (frameSize.width / apertureSize.height);
            xc = (point.y + ((y2 - frameSize.height) / 2.f)) / y2;
            yc = (frameSize.width - point.x) / frameSize.width;
          } else {
            CGFloat x2 = apertureSize.height * (frameSize.height / apertureSize.width);
            yc = 1.f - ((point.x + ((x2 - frameSize.width) / 2)) / x2);
            xc = point.y / frameSize.height;
          }
        }
        
        pointOfInterest = CGPointMake(xc, yc);
        break;
      }
    }
  }
  
  return pointOfInterest;
}



#pragma mark - motionManager
- (void)outputAccelertionData:(CMAcceleration)acceleration{
  AVCaptureVideoOrientation orientationNew;
  if (acceleration.x*acceleration.x > acceleration.y*acceleration.y){
    if (acceleration.x > 0) {
      orientationNew = AVCaptureVideoOrientationLandscapeLeft;
    }else{
      orientationNew = AVCaptureVideoOrientationLandscapeRight;
    }
  } else if(acceleration.y > 0){
    orientationNew = AVCaptureVideoOrientationPortraitUpsideDown;
  } else {
    orientationNew = AVCaptureVideoOrientationPortrait;
  }
  
  if (orientationNew == _cameraOrientation)
    return;
//  NSLog(@"方向：%ld",(long)orientationNew);
  _cameraOrientation = orientationNew;
}

#pragma mark - Class Methods

+ (void)requestCameraPermission:(void (^)(BOOL granted))completionBlock
{
  if ([AVCaptureDevice respondsToSelector:@selector(requestAccessForMediaType: completionHandler:)]) {
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
      // return to main thread
      dispatch_async(dispatch_get_main_queue(), ^{
        if(completionBlock) {
          completionBlock(granted);
        }
      });
    }];
  } else {
    completionBlock(YES);
  }
  
}

+ (BOOL)isFrontCameraAvailable
{
  return [UIImagePickerController isCameraDeviceAvailable:UIImagePickerControllerCameraDeviceFront];
}

+ (BOOL)isRearCameraAvailable
{
  return [UIImagePickerController isCameraDeviceAvailable:UIImagePickerControllerCameraDeviceRear];
}

@end
