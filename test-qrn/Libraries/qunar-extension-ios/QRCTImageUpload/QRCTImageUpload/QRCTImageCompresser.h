//
//  QRCTImageCompresser.h
//  QRCTImageUpload
//
//  Created by yingdong.guo on 2015/12/23.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import <Foundation/Foundation.h>
@import UIKit;

NS_ASSUME_NONNULL_BEGIN

extern NSString *const QRCTImageCompressMaxHeightKey;
extern NSString *const QRCTImageCompressMaxWidthKey;
extern NSString *const QRCTImageCompressQualityKey;

@class PHAsset;
@class ALAsset;

@interface QRCTImageCompresser : NSObject

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithQueue:(dispatch_queue_t)workQueue NS_DESIGNATED_INITIALIZER;

- (void)compressImage:(UIImage *)image
          withOptions:(NSMutableDictionary * _Nullable)options
           completion:(void (^)(NSData * _Nullable, NSError * _Nullable))completion;

- (void)compressImageUsingPHAsset:(PHAsset *)phAsset
                      withOptions:(NSMutableDictionary * _Nullable)options
                       completion:(void(^)(NSData * _Nullable, NSError * _Nullable))completion;

- (void)compressImageUsingALAsset:(ALAsset *)alAsset
                      withOptions:(NSMutableDictionary * _Nullable)options
                       completion:(void(^)(NSData * _Nullable, NSError * _Nullable))completion;

NS_ASSUME_NONNULL_END

@end
