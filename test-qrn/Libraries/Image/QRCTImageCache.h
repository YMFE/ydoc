//
//  QRCTImageCache.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "QRCTMergeDataStoragePrt.h"

@interface QRCTImageCache : NSObject <QRCTMergeDataStoragePrt>

+ (instancetype)imageCacheWithKey:(NSString *)key;

///////////////////////////////////////////////////////////////////////////////
// key                图片的索引值，一般为图片的URL地址
// imageData          图片的data数据
// validity           图片有效时间(S秒)，以秒为单位计算，如果为空或值为0则默认为永不过期
///////////////////////////////////////////////////////////////////////////////
+ (BOOL)saveCacheWithKey:(NSString *)key
           withImageData:(NSData *)imageData
            withValidity:(NSInteger)validity;

// 通过key删除图片文件缓存
+ (void)deleteCacheWithKey:(NSString *)key;

///////////////////////////////////////////////////////////////////////////////
// 初始化
// key                图片的索引值，一般为图片的URL地址
// imageData          图片的data数据
// validity           图片有效时间(S秒)，以秒为单位计算，如果为空或值为0则默认为永不过期
///////////////////////////////////////////////////////////////////////////////
- (instancetype)initWithKey:(NSString *)key
              withImageData:(NSData *)imageData
               withValidity:(NSInteger)validity;

// 获取图片的key值
- (NSString *)key;

/**
 *  暂不提供 alice.yang
 */
//// 获取图片
//- (UIImage *)image;

// 获取而二进制数据
- (NSData *)data;

// 当前时间是否有效
- (BOOL)isAvailability;

// 保存到图片文件缓存中
- (BOOL)saveChache;

// 删除图片文件缓存
- (void)deleteChache;

@end
