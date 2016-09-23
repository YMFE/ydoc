/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTImageView.h"

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTImageLoader.h"
#import "RCTImageSource.h"
#import "RCTImageUtils.h"
#import "RCTUtils.h"
#import "RCTImageBlurUtils.h"

#import "UIView+React.h"

@interface RCTImageView ()
@property (nonatomic, strong) RCTImageSource *imageSource;
@property (nonatomic, copy) RCTDirectEventBlock onLoadStart;
@property (nonatomic, copy) RCTDirectEventBlock onProgress;
@property (nonatomic, copy) RCTDirectEventBlock onError;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onLoadEnd;

@property (nonatomic, strong) CALayer *imageLayer;
@property (nonatomic, strong) UIImage *image;

@end

@implementation RCTImageView
{
  __weak RCTBridge *_bridge;

  /**
   * A block that can be invoked to cancel the most recent call to -reloadImage,
   * if any.
   */
  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
  
  UIColor *_tintColor;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if ((self = [super initWithFrame:CGRectZero])) {
    _bridge = bridge;
    _tintColor = nil;
    _imageLayer = [CALayer layer];
    _imageLayer.contentsScale = [UIScreen mainScreen].scale;
    [self.layer addSublayer:_imageLayer];
    
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self
               selector:@selector(clearImageIfDetached)
                   name:UIApplicationDidReceiveMemoryWarningNotification
                 object:nil];
    [center addObserver:self
               selector:@selector(clearImageIfDetached)
                   name:UIApplicationDidEnterBackgroundNotification
                 object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)
RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (void)setFocusPoint:(CGPoint )focusPoint{
  if (!CGPointEqualToPoint(focusPoint, _focusPoint)) {
    _focusPoint = focusPoint;
    if (_resizeMode == RCTResizeModeFocusCrop) {
      [self reloadImage];
    }
  }
  
};

- (void)setImage:(UIImage *)image
{
  image = image ?: _defaultImage;
  if (image != _image) {
    _image = image;
    [self resetImageLayerInSize:self.bounds.size];
  }
}

- (void)setCapInsets:(UIEdgeInsets)capInsets
{
  if (!UIEdgeInsetsEqualToEdgeInsets(_capInsets, capInsets)) {
    _capInsets = capInsets;
    [self reloadImage];
  }
}

- (void)setSource:(NSArray<RCTImageSource *> *)source
{
  if (![source isEqual:_source]) {
    _source = [source copy];
    [self reloadImage];
  }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode
{
  if (_resizeMode != resizeMode) {
    _resizeMode  = resizeMode;
    [self reloadImage];
  }
}

- (void)setImageScale:(CGFloat)imageScale
{
  if (imageScale < 0) {
    imageScale = 0;
  }
  
  if (imageScale != _imageScale) {
    _imageScale = imageScale;
    [self reloadImage];
  }
}

// //////////////////////////////////////////////////////
- (void)clearImageIfDetached
{
  if (!self.window) {
    [self clearImage];
  }
}

- (BOOL)hasMultipleSources
{
  return _source.count > 1;
}

- (RCTImageSource *)imageSourceForSize:(CGSize)size
{
  if (![self hasMultipleSources]) {
    return _source.firstObject;
  }
  // Need to wait for layout pass before deciding.
  if (CGSizeEqualToSize(size, CGSizeZero)) {
    return nil;
  }
  const CGFloat scale = RCTScreenScale();
  const CGFloat targetImagePixels = size.width * size.height * scale * scale;
  
  RCTImageSource *bestSource = nil;
  CGFloat bestFit = CGFLOAT_MAX;
  for (RCTImageSource *source in _source) {
    CGSize imgSize = source.size;
    const CGFloat imagePixels =
    imgSize.width * imgSize.height * source.scale * source.scale;
    const CGFloat fit = ABS(1 - (imagePixels / targetImagePixels));
    
    if (fit < bestFit) {
      bestFit = fit;
      bestSource = source;
    }
  }
  return bestSource;
}

- (BOOL)desiredImageSourceDidChange
{
  return ![[self imageSourceForSize:self.frame.size] isEqual:_imageSource];
}
// //////////////////////////////////////////////////////

- (UIColor *)tintColor
{
  return _tintColor;
}

- (void)setTintColor:(UIColor *)tintColor
{
    if (![tintColor isEqual:_tintColor]) {
      _tintColor = tintColor;
      [self reRenderImage];
    }
}

- (BOOL)sourceNeedsReload
{
  // If capInsets are set, image doesn't need reloading when resized
  return UIEdgeInsetsEqualToEdgeInsets(_capInsets, UIEdgeInsetsZero);

}

- (void)cancelImageLoad
{
  //取消
  RCTImageLoaderCancellationBlock previousCancellationBlock = _reloadImageCancellationBlock;
  if (previousCancellationBlock) {
    previousCancellationBlock();
    _reloadImageCancellationBlock = nil;
  }
}

- (void)clearImage
{
  [self cancelImageLoad];
  [self.layer removeAnimationForKey:@"contents"];
  _image = nil;
  _imageLayer.contents = nil;
}

- (void)reloadImage
{
  [self cancelImageLoad];

  _imageSource = [self imageSourceForSize:self.frame.size];
  
  if (_imageSource && self.frame.size.width > 0 && self.frame.size.height > 0) {
    if (_onLoadStart) {
      _onLoadStart(nil);
    }
    [self loadDefaultImage];

    RCTImageLoaderProgressBlock progressHandler = nil;
    if (_onProgress) {
      progressHandler = ^(int64_t loaded, int64_t total) {
        self->_onProgress(@{
          @"loaded": @((double)loaded),
          @"total": @((double)total),
        });
      };
    }

    CGSize imageSize = self.bounds.size;
    CGFloat imageScale = _imageScale ?: RCTScreenScale();
    if (!UIEdgeInsetsEqualToEdgeInsets(_capInsets, UIEdgeInsetsZero)) {
      // Don't resize images that use capInsets
      imageSize = CGSizeZero;
      imageScale = _imageSource.scale;
    }

    RCTImageSource *source = _imageSource;
    CGFloat blurRadius = _blurRadius;
    __weak RCTImageView *weakSelf = self;
    _reloadImageCancellationBlock =
    [_bridge.imageLoader loadImageWithURLRequest:source.request
                                            size:imageSize
                                           scale:imageScale
                                         clipped:NO
                                      resizeMode:_resizeMode
                                   progressBlock:progressHandler
                                 completionBlock:^(NSError *error, UIImage *loadedImage) {
        RCTImageView *strongSelf = weakSelf;
        void (^setImageBlock)(UIImage *) = ^(UIImage *image) {
          if (![source isEqual:strongSelf.imageSource]) {
            // Bail out if source has changed since we started loading
            return;
          }
          _image = image;
          [strongSelf resetImageLayerInSize:strongSelf.bounds.size];
          
          if (error) {
            if (strongSelf->_onError) {
              strongSelf->_onError(@{ @"error": error.localizedDescription });
            }
          } else {
            if (strongSelf->_onLoad) {
              strongSelf->_onLoad(nil);
            }
          }
          if (strongSelf->_onLoadEnd) {
            strongSelf->_onLoadEnd(nil);
          }
        };

        if (blurRadius > __FLT_EPSILON__) {
          // Blur on a background thread to avoid blocking interaction
          dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            UIImage *image = RCTBlurredImageWithRadius(loadedImage, blurRadius);
            RCTExecuteOnMainQueue(^{
              setImageBlock(image);
            });
          });
        } else {
          // No blur, so try to set the image on the main thread synchronously to minimize image
          // flashing. (For instance, if this view gets attached to a window, then -didMoveToWindow
          // calls -reloadImage, and we want to set the image synchronously if possible so that the
          // image property is set in the same CATransaction that attaches this view to the window.)
          RCTExecuteOnMainQueue(^{
            setImageBlock(loadedImage);
          });
        }
    }];
  } else {
    [self clearImage];
  }
}

- (void)loadDefaultImage {
  if (_defaultImage) {
    _image = _defaultImage;
    [self resetImageLayerInSize:self.bounds.size];
  }
}

- (void) resetImageLayerInSize:(CGSize)frameSize{
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  
  if (!UIEdgeInsetsEqualToEdgeInsets(_capInsets, UIEdgeInsetsZero)) {
    // Don't resize images that use capInsets
    _imageLayer.frame = (CGRect){{0, 0}, frameSize};
  } else {
    _imageLayer.frame = QRCTImageFrame(_image.size,_image.scale, frameSize, _resizeMode, _focusPoint);
  }
  
  [CATransaction commit];
  
  if (_image.reactKeyframeAnimation) {
    _imageLayer.contents = nil;
    [_imageLayer addAnimation:_image.reactKeyframeAnimation forKey:@"contents"];
  } else {
    [_imageLayer removeAnimationForKey:@"contents"];
    [self reRenderImage];
  }
}

- (void)reRenderImage
{
  if (!_image) {
    return;
  }
  CGImageRef cgImage = nil;

  @autoreleasepool {
    CGRect bounds = CGRectMake(0.0f, 0.0f, _image.size.width*_image.scale, _image.size.height*_image.scale);
    
    UIGraphicsBeginImageContextWithOptions(bounds.size, NO, 1);
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    if (_tintColor) {
      [_tintColor setFill];
      UIRectFill(bounds);
      //保留透明度信息
      [_image drawInRect:bounds blendMode:kCGBlendModeDestinationIn alpha:1.0f];
    } else {
      [_image drawInRect:bounds];
    }
    cgImage = CGBitmapContextCreateImage(context);

    _image = [UIImage imageWithCGImage:cgImage scale:_image.scale orientation:UIImageOrientationUp];
    UIGraphicsEndImageContext();
  }
  
  [self resetContentsCenter];
  if ( RCTResizeModeRepeat == _resizeMode) {
    _imageLayer.contents = nil;
    _imageLayer.backgroundColor = [UIColor colorWithPatternImage:_image].CGColor ;
  } else {
    _imageLayer.backgroundColor = nil;
    _imageLayer.contents = CFBridgingRelease(cgImage);
  }
}

- (void)resetContentsCenter{
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  
  if (UIEdgeInsetsEqualToEdgeInsets(_capInsets, UIEdgeInsetsZero) || RCTResizeModeRepeat == _resizeMode) {
    _imageLayer.contentsScale  =  [UIScreen mainScreen].scale;
    _imageLayer.contentsCenter =  (CGRect){{0, 0}, {1, 1}};
    
  } else {
    
    _imageLayer.contentsScale = _image.scale;
    _imageLayer.contentsCenter =  (CGRect){{_capInsets.left/_image.size.width, _capInsets.top/_image.size.height},
      {1 - (_capInsets.left + _capInsets.right)/_image.size.width, 1 - (_capInsets.top + _capInsets.bottom)/_image.size.height}};
  }
  
  [CATransaction commit];
}

- (void)reactSetFrame:(CGRect)frame
{
  CGSize oldBoundSize = self.bounds.size;
  
  [super reactSetFrame:frame];

  if (CGSizeEqualToSize(oldBoundSize, frame.size)) {
    return;
  }
  
  if (!self.image || self.image == _defaultImage) {
    [self reloadImage];
  } else if ([self sourceNeedsReload]) {
    [self resetImageLayerInSize:frame.size];
    [self reloadImage];
  }else{
    [self resetImageLayerInSize:frame.size];
  }
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (!self.window) {
    // Don't keep self alive through the asynchronous dispatch, if the intention
    // was to remove the view so it would deallocate.
    __weak typeof(self) weakSelf = self;

    dispatch_async(dispatch_get_main_queue(), ^{
      __strong typeof(self) strongSelf = weakSelf;
      if (!strongSelf) {
        return;
      }

      // If we haven't been re-added to a window by this run loop iteration,
      // clear out the image to save memory.
      if (!strongSelf.window) {
        [strongSelf clearImage];
      }
    });
  } else if (!self.image || self.image == _defaultImage) {
    [self reloadImage];
  }
}

@end
