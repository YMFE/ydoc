//
//  QRCTImageUpload.m
//  QRCTImageUpload
//
//  Created by yingdong.guo on 2015/12/23.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "QRCTImageUploader.h"

#import "RCTUtils.h"
#import "RCTImageLoader.h"
#import "QRCTImageCompresser.h"
#import "QRCTDataUploader.h"

@import UIKit;
@import AssetsLibrary;
@import Photos;

extern NSDictionary *g_QRCTPhotoCache;

@interface QRCTImageUploader ()

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic, strong) ALAssetsLibrary *assetsLibrary;
#pragma clang diagnostic pop
@property (nonatomic, strong) QRCTImageCompresser *imageCompresser;

@end

@implementation QRCTImageUploader

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _methodQueue = dispatch_queue_create("com.qunar.extension.imageuploader", DISPATCH_QUEUE_SERIAL);
        _imageCompresser = [[QRCTImageCompresser alloc] initWithQueue:_methodQueue];
        
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        _assetsLibrary = [ALAssetsLibrary new];
#pragma clang diagnostic pop
    }
    return self;
}

- (dispatch_queue_t)methodQueue {
    return _methodQueue;
}

RCT_EXPORT_METHOD(uploadImage:(NSString *)imageUri
                  options:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback
                  errorCallback:(RCTResponseErrorBlock)errorCallback)
{
    NSMutableDictionary *compressOptions = [NSMutableDictionary dictionaryWithDictionary:[self parseCompressOptionsFrom:options]];
    NSDictionary *uploadOptions = [self parseUploadOptionsFrom:options];
    
    if ([imageUri hasPrefix:@"assets-library://"]) {
        // TODO asset-library access
        NSURL *assetUrl = [NSURL URLWithString:imageUri];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        [_assetsLibrary assetForURL:assetUrl resultBlock:^(ALAsset *alAsset) {
            [_imageCompresser compressImageUsingALAsset:alAsset
                                               withOptions:compressOptions
                                                completion:^(NSData *data, NSError *imageCompressError) {
                                                    if (imageCompressError) {
                                                        errorCallback(imageCompressError);
                                                        return;
                                                    }
                                                    [self uploadData:data
                                                         WithOptions:uploadOptions
                                                            callback:callback
                                                       errorCallback:errorCallback];

                                                }];
        } failureBlock:^(NSError *error) {
            errorCallback(error);
        }];
#pragma clang diagnostic pop
    }
    else if ([imageUri hasPrefix:@"ph://"]) {
        PHAsset *phAsset = [g_QRCTPhotoCache objectForKey:imageUri];
        if (!phAsset) {
            NSString *phAssetID = [imageUri substringFromIndex:@"ph://".length];
            PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[phAssetID] options:nil];
            if (results.count == 0) {
                NSString *errorText = [NSString stringWithFormat:@"Failed to fetch PHAsset with local identifier %@ with no error message.", phAssetID];
                errorCallback(RCTErrorWithMessage(errorText));
                return;
            }
            
            phAsset = [results firstObject];
        }
        
        [_imageCompresser compressImageUsingPHAsset:phAsset
                                        withOptions:compressOptions
                                         completion:^(NSData *data, NSError *imageCompressError) {
                                             if (imageCompressError) {
                                                 errorCallback(imageCompressError);
                                                 return;
                                             }
                                             [self uploadData:data
                                                  WithOptions:uploadOptions
                                                     callback:callback
                                                errorCallback:errorCallback];
                                         }];
    }
    else {
        // other uri, let react image loader fetch these images
        [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:imageUri]  callback:^(NSError *imageLoadError, UIImage *image) {
            if (imageLoadError) {
                errorCallback(imageLoadError);
                return;
            }

            [_imageCompresser compressImage:image
                                withOptions:compressOptions
                                 completion:^(NSData *imageData, NSError *imageCompressError) {
                                     if (imageCompressError) {
                                         errorCallback(imageCompressError);
                                         return;
                                     }
                                     
                                     [self uploadData:imageData
                                          WithOptions:uploadOptions
                                             callback:callback
                                        errorCallback:errorCallback];
                                 }];
        }];
    }
}

- (void)uploadData:(NSData *)data WithOptions:(NSDictionary *)uploadOptions
          callback:(RCTResponseSenderBlock)callback
     errorCallback:(RCTResponseErrorBlock)errorCallback {
    [QRCTDataUploader uploadFileData:data
                         withFileKey:uploadOptions[QRCTImageUploadOptionsFileKey]
                            fileName:uploadOptions[QRCTImageUploadOptionsFileNameKey]
                         contentType:@"image/jpeg"
                               toUrl:uploadOptions[QRCTImageUploadOptionsURLKey]
                   withAdditionParam:uploadOptions[QRCTImageUploadOptionsServerParamKey]
                   completionHandler:^(NSData *responseData, NSError *uploadError) {
                       if (uploadError) {
                           errorCallback(uploadError);
                           return;
                       }
                       
                       NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
                       
                       callback(@[responseString]);
                   }];
}

- (NSDictionary *)parseCompressOptionsFrom:(NSDictionary *)options {
    NSNumber *maxWidth = options[@"maxWidth"] ?: @0;
    NSNumber *maxHeight = options[@"maxHeight"] ?: @0;
    NSNumber *quality = options[@"quality"] ?: @100;
    
    return @{QRCTImageCompressMaxWidthKey: maxWidth,
             QRCTImageCompressMaxHeightKey: maxHeight,
             QRCTImageCompressQualityKey: quality
             };
}

- (NSDictionary *)parseUploadOptionsFrom:(NSDictionary *)options {
    NSString *urlString = options[@"serverAddress"];
    RCTAssertParam(urlString);
    
    NSURL *url = [NSURL URLWithString:urlString];
    NSDictionary *serverParams = options[@"serverParams"] ?: @{};
    NSString *fileKey = options[@"fileKey"] ?: @"file";
    
    return @{QRCTImageUploadOptionsFileKey: fileKey,
             QRCTImageUploadOptionsFileNameKey: @"image",
             QRCTImageUploadOptionsServerParamKey: serverParams,
             QRCTImageUploadOptionsURLKey: url
             };
}

@end
