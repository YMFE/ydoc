//
//  QRCTImageStoreManager.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, QRImageCacheType){
  QRImageCacheTypeNone,
  QRImageCacheTypeDisk ,
  QRImageCacheTypeMemory,
};

typedef void(^RetriveImageCompleteBlock)(NSData * imageData, QRImageCacheType  cacheType);

@interface QRCTImageStoreManager : NSObject

+ (instancetype)sharedInstance;

/**
 *  缓存图片数据  磁盘和内存都缓存一份 最好用这个方法   GIF图片缓存用UIImage 的话，会丢失数据
 */
+ (void)cacheImageData:(NSData *)imageData forKey:(NSString *)imageKey;

/**
 *  读取图片缓存 先从内存取 再从磁盘取 磁盘取采用异步的方式 防止阻塞主线程 使用 [NSOperation cancel] 可以执行取消操作
 */
+ (NSOperation *)retrieveImageDataForKey:(NSString *)imageKey complete:(RetriveImageCompleteBlock)complete;

/**
 *  清除特定缓存
 *
 *  @param key 缓存 key
 */
+ (void)removeCacheForKey:(NSString *)key;

/**
 *  读取缓存图片 先从内存缓存读，再从磁盘缓存 因为非异步，图片过大是有可能会阻塞线程
 */
+ (NSData *)imageDataForKey:(NSString *)key;

@end
