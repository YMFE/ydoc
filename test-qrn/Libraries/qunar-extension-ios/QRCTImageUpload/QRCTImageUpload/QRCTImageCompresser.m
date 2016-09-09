//
//  QRCTImageCompresser.m
//  QRCTImageUpload
//
//  Created by yingdong.guo on 2015/12/23.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "QRCTImageCompresser.h"
#import "QRCTDataUploader.h"

@import UIKit;
@import CoreGraphics;
@import Photos;
@import AVFoundation;
@import AssetsLibrary;

NSString *const QRCTImageCompressMaxHeightKey = @"QRCTImageCompressMaxHeightKey";
NSString *const QRCTImageCompressMaxWidthKey = @"QRCTImageCompressMaxWidthKey";
NSString *const QRCTImageCompressQualityKey = @"QRCTImageCompressQualityKey";

__attribute((__always_inline__)) BOOL floatEquals(CGFloat f1, CGFloat f2) {
    const static CGFloat eps = 1e-10;
    return fabs(f1-f2) < eps;
}

@interface QRCTImageCompresser ()

@property (nonatomic, strong) dispatch_queue_t workQueue;

@end

@implementation QRCTImageCompresser

- (instancetype)initWithQueue:(dispatch_queue_t)workQueue {
    self = [super init];
    if (self) {
        _workQueue = workQueue;
    }
    return self;
}

- (void)compressImage:(UIImage *)image
          withOptions:(NSMutableDictionary *)options
           completion:(void (^)(NSData *, NSError *))completion {
    __weak typeof(self) weakSelf = self;
    dispatch_async(_workQueue, ^{
        NSError *error;
        NSData *data = [weakSelf p_compressImage:image withOptions:options error:&error];
        completion(data, error);
    });
}

- (NSData *)p_compressImage:(UIImage *)image
                withOptions:(NSMutableDictionary *)options
                      error:(NSError **)error {
    CGFloat maxHeight = [options[QRCTImageCompressMaxHeightKey] floatValue];
    CGFloat maxWidth = [options[QRCTImageCompressMaxWidthKey] floatValue];
    CGFloat quality = [options[QRCTImageCompressQualityKey] floatValue] / 100.0;
    
    if (floatEquals(maxHeight, 0.0) || maxHeight > image.size.height) {
        maxHeight = image.size.height;
    }
    if (floatEquals(maxWidth, 0.0) || maxWidth > image.size.width) {
        maxWidth = image.size.width;
    }
    
    CGRect restrictedRect = {
        .origin = CGPointZero,
        .size = {
            .width = maxWidth,
            .height = maxHeight
        }
    };
    
    CGRect targetRect = AVMakeRectWithAspectRatioInsideRect(image.size, restrictedRect);
    targetRect.origin = CGPointZero;

    UIGraphicsBeginImageContextWithOptions(targetRect.size, NO, 1.0);
    [image drawInRect:targetRect];
    UIImage *compressedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    NSData *compressedData = UIImageJPEGRepresentation(compressedImage, quality);

    return compressedData;
}

- (void)compressImageUsingPHAsset:(PHAsset *)phAsset
                      withOptions:(NSMutableDictionary *)options
                       completion:(void (^)(NSData *, NSError * _Nullable))completion {
    CGFloat maxHeight = [options[QRCTImageCompressMaxHeightKey] floatValue];
    CGFloat maxWidth = [options[QRCTImageCompressMaxWidthKey] floatValue];
    CGFloat quality = [options[QRCTImageCompressQualityKey] floatValue] / 100.0;
    
    BOOL isOriginal = ((floatEquals(maxHeight, 0.0) && floatEquals(maxWidth, 0.0)) ||
                       (maxHeight >= phAsset.pixelHeight && maxWidth >= phAsset.pixelWidth)) &&
                      floatEquals(quality, 1.0);

    /*NSArray<PHAssetResource *> *assetResources = [PHAssetResource assetResourcesForAsset:phAsset];
    PHAssetResource *assetResource = assetResources.firstObject;
    [options setObject:assetResource.originalFilename forKey:QRCTImageUploadOptionsFileNameKey];*/
    
    
    //__block NSMutableData *assetData = [NSMutableData new];
    __weak typeof(self) weakSelf = self;
    [[PHImageManager defaultManager] requestImageDataForAsset:phAsset options:nil resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation orientation, NSDictionary * _Nullable info) {
        if (info[PHImageErrorKey]) {
            completion(nil, info[PHImageErrorKey]);
            return;
        }
        
        if(info[@"PHImageFileURLKey"]) {
            [options setObject:info[@"PHImageFileURLKey"] forKey:QRCTImageUploadOptionsFileNameKey];
        }
        
        char fileHeader[4];
        [imageData getBytes:fileHeader length:4];
        if (isOriginal && [self imageHeaderIsJpegOrPng:fileHeader]) {
            completion(imageData, nil);
        }
        else {
            UIImage *image = [UIImage imageWithData:imageData];
            [weakSelf compressImage:image withOptions:options completion:completion];
        }
    }];
    /*[[PHAssetResourceManager defaultManager] requestDataForAssetResource:assetResource
                                                                 options:nil
                                                     dataReceivedHandler:^(NSData *data) {
                                                         [assetData appendData:data];
                                                     } completionHandler:^(NSError *error) {
                                                         if (error) {
                                                             completion(nil, error);
                                                             return;
                                                         }
                                                         
                                                         if (isOriginal) {
                                                             completion(assetData, nil);
                                                         }
                                                         else {
                                                             UIImage *image = [UIImage imageWithData:assetData];
                                                             [weakSelf compressImage:image withOptions:options completion:completion];
                                                         }
                                                     }];*/
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
- (void)compressImageUsingALAsset:(ALAsset *)alAsset
                      withOptions:(NSMutableDictionary * _Nullable)options
                       completion:(void(^)(NSData * _Nullable, NSError * _Nullable))completion {
    CGFloat maxHeight = [options[QRCTImageCompressMaxHeightKey] floatValue];
    CGFloat maxWidth = [options[QRCTImageCompressMaxWidthKey] floatValue];
    CGFloat quality = [options[QRCTImageCompressQualityKey] floatValue] / 100.0;
    
    ALAssetRepresentation *assetRepresentation = alAsset.defaultRepresentation;
    
    BOOL isOriginal = ((floatEquals(maxHeight, 0.0) && floatEquals(maxWidth, 0.0)) ||
                       (maxHeight >= assetRepresentation.dimensions.height && maxWidth >= assetRepresentation.dimensions.width)) &&
                       floatEquals(quality, 1.0);
    
    [options setObject:assetRepresentation.filename forKey:QRCTImageUploadOptionsFileNameKey];
    
    if (isOriginal) {
        NSError *error;
        
        char fileHeader[4];
        [assetRepresentation getBytes:(uint8_t *)fileHeader fromOffset:0 length:4 error:&error];
        
        if ([self imageHeaderIsJpegOrPng:fileHeader]) {
            long long dataSize = assetRepresentation.size;
            uint8_t *dataBuffer = malloc(dataSize);
            [assetRepresentation getBytes:dataBuffer fromOffset:0 length:dataSize error:&error];
            if (error) {
                completion(nil, error);
                return;
            }
            
            completion([NSData dataWithBytesNoCopy:dataBuffer length:dataSize], nil);
            return;
        }
    }
    
    UIImage *image = [UIImage imageWithCGImage:assetRepresentation.fullResolutionImage];
    [self compressImage:image withOptions:options completion:completion];
}
#pragma clang diagnostic pop

- (BOOL)imageHeaderIsJpegOrPng:(char *)headerBytes {
    BOOL isJpeg = (headerBytes[0] == '\xFF') && (headerBytes[1] == '\xD8');
    BOOL isPNG = (headerBytes[0] == '\x89') && (headerBytes[1] == 'P') && (headerBytes[2] == 'N') && (headerBytes[3] == 'G');
    
    return isJpeg || isPNG;
}

@end
