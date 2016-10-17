//
//  QRCTImageCacheManager.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class QRCTImageCache;
@interface QRCTImageCacheManager : NSObject

+ (QRCTImageCache *)imageCacheWithKey:(NSString *)key;

+ (BOOL)saveImageCache:(QRCTImageCache *)imageCache;

+ (void)deleteImageCacheWithKey:(NSString *)key;

@end
