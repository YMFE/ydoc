/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTImageUtils.h"

#import <ImageIO/ImageIO.h>
#import <MobileCoreServices/UTCoreTypes.h>
#import <tgmath.h>

#import "RCTLog.h"
#import "RCTUtils.h"

static CGFloat RCTCeilValue(CGFloat value, CGFloat scale)
{
  return ceil(value * scale) / scale;
}

static CGFloat RCTFloorValue(CGFloat value, CGFloat scale)
{
  return floor(value * scale) / scale;
}

static CGSize RCTCeilSize(CGSize size, CGFloat scale)
{
  return (CGSize){
    RCTCeilValue(size.width, scale),
    RCTCeilValue(size.height, scale)
  };
}

// 获取图片后根据图片来摆放位置, focusPoint是归一化后的值
CGRect QRCTImageFrame(CGSize imageSize,CGFloat imageScale, CGSize frameSize,
                      RCTResizeMode resizeMode, CGPoint focusPoint)
{
  imageSize.width = imageSize.width *imageScale / RCTScreenScale();
  imageSize.height = imageSize.height *imageScale / RCTScreenScale();

  if (CGSizeEqualToSize(frameSize, CGSizeZero)) {
    // Assume we require the largest size available
    return (CGRect){CGPointZero, imageSize};
  }
  
  if (imageSize.height == 0 || frameSize.height == 0) {
    return (CGRect){CGPointZero, imageSize};
  }
  
  CGFloat aspect = imageSize.width / imageSize.height;
  CGFloat targetAspect = frameSize.width / frameSize.height;
  
  //计算图片最终大小
  switch (resizeMode) {
    //图片拉伸填充
    case RCTResizeModeFitXY: // stretch fitXY
    case RCTResizeModeRepeat:
      imageSize = frameSize;
      break;
      
    //图片内嵌
    case RCTResizeModeFitCenter: // contain
    case RCTResizeModeFitStart:
    case RCTResizeModeFitEnd:
      if (targetAspect <= aspect) { // target is taller than content
        
        imageSize.width = frameSize.width;
        imageSize.height = imageSize.width / aspect;
        
      } else { // target is wider than content
        
        imageSize.height = frameSize.height;
        imageSize.width = imageSize.height * aspect;
      }
      break;
      
    //图片外嵌
    case RCTResizeModeCenterCrop: // cover
    case RCTResizeModeFocusCrop:
      if (targetAspect <= aspect) { // target is taller than content
        
        imageSize.height = frameSize.height;
        imageSize.width = imageSize.height * aspect;
        
      } else { // target is wider than content
        
        imageSize.width = frameSize.width;
        imageSize.height = imageSize.width / aspect;
      }
      break;
      
    //居中不缩放
    case RCTResizeModeCenter:
      break;
      
    //居中内嵌不放大
    case RCTResizeModeCenterInside:
      
      if (frameSize.width < imageSize.width || frameSize.height < imageSize.height) {
        //需要缩小
        if (targetAspect <= aspect) { // target is taller than content
          
          imageSize.width = frameSize.width = frameSize.width;
          imageSize.height = imageSize.width / aspect;
          
        } else { // target is wider than content
          
          imageSize.height = frameSize.height = frameSize.height;
          imageSize.width = imageSize.height * aspect;
        }
        
      }
      break;
      
    default:;
  }
  
  //确定图像偏移量并返回图像最终的frame
  switch (resizeMode) {
    //拉伸
    case RCTResizeModeFitXY:
      return (CGRect){CGPointZero,frameSize};
    
    case RCTResizeModeRepeat:
      return (CGRect){CGPointZero, frameSize};
      
    //图像均居中
    case RCTResizeModeFitCenter: // contain
    case RCTResizeModeCenterCrop: // cover
    case RCTResizeModeCenter:
    case RCTResizeModeCenterInside:
      return (CGRect){ {(frameSize.width - imageSize.width) / 2, (frameSize.height - imageSize.height) / 2}, imageSize};
      
    case RCTResizeModeFitStart:
      return (CGRect){CGPointZero,imageSize};
      
    case RCTResizeModeFitEnd:
       return (CGRect){ {frameSize.width - imageSize.width, frameSize.height - imageSize.height}, imageSize};
      
    case RCTResizeModeFocusCrop:
    {
      CGFloat widthOffset = (0.5f - focusPoint.x) * imageSize.width;    //偏移中心width方向距离
      CGFloat heightOffset = (0.5f - focusPoint.y) * imageSize.height;  //偏移中心height方向距离
      
      if (imageSize.width > frameSize.width) {
        heightOffset = 0.0f;
        CGFloat maxWidthOffset = (imageSize.width - frameSize.width) / 2.0f;
        if (fabs(widthOffset) > maxWidthOffset) {
          widthOffset = widthOffset > 0 ? maxWidthOffset : -maxWidthOffset;
        }
        
      }else if ( imageSize.height > frameSize.height) {
        widthOffset = 0.0f;
        CGFloat maxHeightOffset = (imageSize.height - frameSize.height) / 2.0f;
        if (fabs(heightOffset) > maxHeightOffset) {
          heightOffset = heightOffset > 0 ? maxHeightOffset : -maxHeightOffset;
        }
        
      }else {
        widthOffset = 0.0f;
        heightOffset = 0.0f;
      }
      
      return (CGRect){ {(frameSize.width - imageSize.width) / 2 + widthOffset, (frameSize.height - imageSize.height) / 2 + heightOffset}, imageSize};
      
    }
      return (CGRect){CGPointZero,imageSize};
      
  }

}


CGRect RCTTargetRect(CGSize sourceSize, CGSize destSize,
                     CGFloat destScale, RCTResizeMode resizeMode)
{
  if (CGSizeEqualToSize(destSize, CGSizeZero)) {
    // Assume we require the largest size available
    return (CGRect){CGPointZero, sourceSize};
  }

  CGFloat aspect = sourceSize.width / sourceSize.height;
  // If only one dimension in destSize is non-zero (for example, an Image
  // with `flex: 1` whose height is indeterminate), calculate the unknown
  // dimension based on the aspect ratio of sourceSize
  if (destSize.width == 0) {
    destSize.width = destSize.height * aspect;
  }
  if (destSize.height == 0) {
    destSize.height = destSize.width / aspect;
  }

  // Calculate target aspect ratio if needed
  CGFloat targetAspect = 0.0;
  if (resizeMode != RCTResizeModeCenter &&
      resizeMode != RCTResizeModeFitXY) {
    targetAspect = destSize.width / destSize.height;
    if (aspect == targetAspect) {
      resizeMode = RCTResizeModeFitXY;
    }
  }
  //确定图像尺寸
  switch (resizeMode) {
    //图片拉伸填充
    case RCTResizeModeFitXY: // stretch fitXY
      sourceSize = destSize;
      break;
      
    //图片内嵌
    case RCTResizeModeFitCenter: // contain
    case RCTResizeModeFitStart:
    case RCTResizeModeFitEnd:
      if (targetAspect <= aspect) { // target is taller than content

        sourceSize.width = destSize.width;
        sourceSize.height = sourceSize.width / aspect;

      } else { // target is wider than content

        sourceSize.height = destSize.height;
        sourceSize.width = sourceSize.height * aspect;
      }
      break;
      
    //图片外嵌
    case RCTResizeModeCenterCrop: // cover
    case RCTResizeModeFocusCrop:
      if (targetAspect <= aspect) { // target is taller than content
        sourceSize.height = destSize.height;
        sourceSize.width = sourceSize.height * aspect;

      } else { // target is wider than content
        sourceSize.width = destSize.width;
        sourceSize.height = sourceSize.width / aspect;
      }
      break;
    //居中不缩放
    case RCTResizeModeCenter:
    case RCTResizeModeRepeat:
      break;
      
    //居中内嵌不放大
    case RCTResizeModeCenterInside:
      
      if (destSize.width < sourceSize.width || destSize.height < sourceSize.height) {
        //需要缩小
        if (targetAspect <= aspect) { // target is taller than content
          
          sourceSize.width = destSize.width;
          sourceSize.height = sourceSize.width / aspect;
          
        } else { // target is wider than content
          
          sourceSize.height = destSize.height;
          sourceSize.width = sourceSize.height * aspect;
        }
        
      }
      break;
      
    default:
      RCTLogError(@"A resizeMode value of %zd is not supported", resizeMode);
      return (CGRect){CGPointZero, RCTCeilSize(destSize, destScale)};
  }
  
  
  sourceSize =  RCTCeilSize(sourceSize, destScale);
  
  //确定图像偏移量并返回图像最终的frame
  switch (resizeMode) {
    //拉伸
    case RCTResizeModeFitXY:
    case RCTResizeModeRepeat:
       return (CGRect){CGPointZero, sourceSize};
      
    //图像均居中
    case RCTResizeModeFitCenter: // contain
    case RCTResizeModeCenterCrop: // cover
    case RCTResizeModeCenter:
    case RCTResizeModeCenterInside:
    case RCTResizeModeFocusCrop://TODO: 因为函数无法传递point因此暂时不支持偏移
      return (CGRect){
        {
          RCTFloorValue( (destSize.width - sourceSize.width) / 2, destScale),
          RCTFloorValue( (destSize.height - sourceSize.height) / 2, destScale)
        },
        sourceSize
      };
      
    case RCTResizeModeFitStart:
      return (CGRect){CGPointZero,sourceSize};
      
    case RCTResizeModeFitEnd:
      return (CGRect){
        {
          RCTFloorValue(destSize.width - sourceSize.width, destScale),
          RCTFloorValue(destSize.height - sourceSize.height, destScale)
        },
        sourceSize
      };
  }

}

CGAffineTransform RCTTransformFromTargetRect(CGSize sourceSize, CGRect targetRect)
{
  //TODO: V0.20.0
  CGAffineTransform transform = CGAffineTransformIdentity;
  transform = CGAffineTransformTranslate(transform,
                                         targetRect.origin.x,
                                         targetRect.origin.y);
  transform = CGAffineTransformScale(transform,
                                     targetRect.size.width / sourceSize.width,
                                     targetRect.size.height / sourceSize.height);
  return transform;
}

CGSize RCTTargetSize(CGSize sourceSize, CGFloat sourceScale,
                     CGSize destSize, CGFloat destScale,
                     RCTResizeMode resizeMode,
                     BOOL allowUpscaling)
{
  switch (resizeMode) {
    case RCTResizeModeFitXY: // stretch

      if (!allowUpscaling) {
        CGFloat scale = sourceScale / destScale;
        destSize.width = MIN(sourceSize.width * scale, destSize.width);
        destSize.height = MIN(sourceSize.height * scale, destSize.height);
      }
      return RCTCeilSize(destSize, destScale);

    default: {

      // Get target size
      CGSize size = RCTTargetRect(sourceSize, destSize, destScale, resizeMode).size;
      if (!allowUpscaling) {
        // return sourceSize if target size is larger
        if (sourceSize.width * sourceScale < size.width * destScale || sourceSize.height *sourceScale < size.height*destScale) {
          return sourceSize;
        }
      }
      return size;
    }
  }
}

BOOL RCTUpscalingRequired(CGSize sourceSize, CGFloat sourceScale,
                          CGSize destSize, CGFloat destScale,
                          RCTResizeMode resizeMode)
{
  if (CGSizeEqualToSize(destSize, CGSizeZero)) {
    // Assume we require the largest size available
    return YES;
  }

  // Precompensate for scale
  CGFloat scale = sourceScale / destScale;
  sourceSize.width *= scale;
  sourceSize.height *= scale;

  // Calculate aspect ratios if needed (don't bother if resizeMode == stretch)
  CGFloat aspect = 0.0, targetAspect = 0.0;
  if (resizeMode != RCTResizeModeFitXY) {
    aspect = sourceSize.width / sourceSize.height;
    targetAspect = destSize.width / destSize.height;
    if (aspect == targetAspect) {
      resizeMode = RCTResizeModeFitXY;
    }
  }

  switch (resizeMode) {

    case RCTResizeModeFitXY: // stretch
      return destSize.width > sourceSize.width || destSize.height > sourceSize.height;

    //图片内嵌
    case RCTResizeModeFitCenter: // contain
    case RCTResizeModeFitStart:
    case RCTResizeModeFitEnd:
      if (targetAspect <= aspect) { // target is taller than content

        return destSize.width > sourceSize.width;

      } else { // target is wider than content

        return destSize.height > sourceSize.height;
      }
    
    //图片外嵌
    case RCTResizeModeCenterCrop: // cover
    case RCTResizeModeFocusCrop:
      if (targetAspect <= aspect) { // target is taller than content

        return destSize.height > sourceSize.height;

      } else { // target is wider than content

        return destSize.width > sourceSize.width;
      }
      
    case RCTResizeModeRepeat:
    case RCTResizeModeCenter:
    case RCTResizeModeCenterInside:
      
      return NO;
  }
}

UIImage *__nullable RCTDecodeImageWithData(NSData *data,
                                           CGSize destSize,
                                           CGFloat destScale,
                                           RCTResizeMode resizeMode)
{
  CGImageSourceRef sourceRef = CGImageSourceCreateWithData((__bridge CFDataRef)data, NULL);
  if (!sourceRef) {
    return nil;
  }

  // Get original image size
  CFDictionaryRef imageProperties = CGImageSourceCopyPropertiesAtIndex(sourceRef, 0, NULL);
  if (!imageProperties) {
    CFRelease(sourceRef);
    return nil;
  }
  NSNumber *width = CFDictionaryGetValue(imageProperties, kCGImagePropertyPixelWidth);
  NSNumber *height = CFDictionaryGetValue(imageProperties, kCGImagePropertyPixelHeight);
  CGSize sourceSize = {width.doubleValue, height.doubleValue};
  CFRelease(imageProperties);

  if (CGSizeEqualToSize(destSize, CGSizeZero)) {
    destSize = sourceSize;
    if (!destScale) {
      destScale = 1;//TODO: 是否应该是ScreenScale
    }
  } else if (!destScale) {
    destScale = RCTScreenScale();
  }

  // calculate target size
  CGSize targetSize = RCTTargetSize(sourceSize, 1, destSize, destScale, resizeMode, YES);
  CGFloat maxGetScale = fmin(sourceSize.width / targetSize.width,sourceSize.height/ targetSize.height);
  CGFloat maxPixelSize ;
  if (maxGetScale < 1) {
    maxPixelSize = fmax(sourceSize.width,sourceSize.height);
  }else{
    maxGetScale = fmin(maxGetScale, destScale);//对于destScale＝2的时候，可以取到scale＝1.5的图，这样比scale＝1的图更好
    maxPixelSize = fmax(fmin(sourceSize.width, targetSize.width * maxGetScale),
                        fmin(sourceSize.height, targetSize.height * maxGetScale));

  }


  NSDictionary<NSString *, NSNumber *> *options = @{
    (id)kCGImageSourceShouldAllowFloat: @YES,
    (id)kCGImageSourceCreateThumbnailWithTransform: @YES,
    (id)kCGImageSourceCreateThumbnailFromImageAlways: @YES,
    (id)kCGImageSourceThumbnailMaxPixelSize: @(maxPixelSize),
  };

  // Get thumbnail
  CGImageRef imageRef = CGImageSourceCreateThumbnailAtIndex(sourceRef, 0, (__bridge CFDictionaryRef)options);
  CFRelease(sourceRef);
  if (!imageRef) {
    return nil;
  }

  // Return image
  UIImage *image = [UIImage imageWithCGImage:imageRef
                                       scale:destScale
                                 orientation:UIImageOrientationUp];
  CGImageRelease(imageRef);
  return image;
}

NSDictionary<NSString *, id> *__nullable RCTGetImageMetadata(NSData *data)
{
  CGImageSourceRef sourceRef = CGImageSourceCreateWithData((__bridge CFDataRef)data, NULL);
  if (!sourceRef) {
    return nil;
  }
  CFDictionaryRef imageProperties = CGImageSourceCopyPropertiesAtIndex(sourceRef, 0, NULL);
  CFRelease(sourceRef);
  return (__bridge_transfer id)imageProperties;
}

NSData *__nullable RCTGetImageData(CGImageRef image, float quality)
{
  NSDictionary *properties;
  CGImageDestinationRef destination;
  CFMutableDataRef imageData = CFDataCreateMutable(NULL, 0);
  if (RCTImageHasAlpha(image)) {
    // get png data
    destination = CGImageDestinationCreateWithData(imageData, kUTTypePNG, 1, NULL);
  } else {
    // get jpeg data
    destination = CGImageDestinationCreateWithData(imageData, kUTTypeJPEG, 1, NULL);
    properties = @{(NSString *)kCGImageDestinationLossyCompressionQuality: @(quality)};
  }
  CGImageDestinationAddImage(destination, image, (__bridge CFDictionaryRef)properties);
  if (!CGImageDestinationFinalize(destination))
  {
    CFRelease(imageData);
    imageData = NULL;
  }
  CFRelease(destination);
  return (__bridge_transfer NSData *)imageData;
}

UIImage *__nullable RCTTransformImage(UIImage *image,
                                      CGSize destSize,
                                      CGFloat destScale,
                                      CGAffineTransform transform)
{
  if (destSize.width <= 0 | destSize.height <= 0 || destScale <= 0) {
    return nil;
  }

  BOOL opaque = !RCTImageHasAlpha(image.CGImage);
  UIGraphicsBeginImageContextWithOptions(destSize, opaque, destScale);
  CGContextRef currentContext = UIGraphicsGetCurrentContext();
  CGContextConcatCTM(currentContext, transform);
  [image drawAtPoint:CGPointZero];
  UIImage *result = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return result;
}

BOOL RCTImageHasAlpha(CGImageRef image)
{
  switch (CGImageGetAlphaInfo(image)) {
    case kCGImageAlphaNone:
    case kCGImageAlphaNoneSkipLast:
    case kCGImageAlphaNoneSkipFirst:
      return NO;
    default:
      return YES;
  }
}
