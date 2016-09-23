//
//  QRCTImageCache.m
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "QRCTImageCache.h"

#import "QRCTImageCacheManager.h"

// 对象存储的公共key
#define kDataStructRootKey                          @"____DataStruct__Root____"             // 数据结构和数据内容的根节点

@interface QRCTImageCache ()

@property (nonatomic, strong) NSDate            *cacheDate;         // 图片写到文件存储的时间
@property (nonatomic, strong) NSString          *key;               // 图片的索引值，一般为图片的URL地址
@property (nonatomic, strong) NSData            *imageData;         // 图片的data数据
@property (nonatomic, strong) NSNumber          *validity;          // 图片有效时间(S秒)，以秒为单位计算，如果为空或值为0则默认为永不过期

@end

@implementation QRCTImageCache

+ (instancetype)imageCacheWithKey:(NSString *)key
{
  return [QRCTImageCacheManager imageCacheWithKey:key];
}

+ (BOOL)saveCacheWithKey:(NSString *)key
           withImageData:(NSData *)imageData
            withValidity:(NSInteger)validity
{
  QRCTImageCache *imageCache = [[QRCTImageCache alloc] initWithKey:key
                                                     withImageData:imageData
                                                      withValidity:validity];
  return [imageCache saveChache];
}

+ (void)deleteCacheWithKey:(NSString *)key
{
  if (key != nil)
  {
    [QRCTImageCacheManager deleteImageCacheWithKey:key];
  }
}

// 初始化
- (instancetype)initWithKey:(NSString *)key
              withImageData:(NSData *)imageData
               withValidity:(NSInteger)validity
{
  self = [super init];
  if (self)
  {
    _cacheDate = [[NSDate alloc] init];
    _key = key;
    _imageData = imageData;
    if (_validity >= 0)
    {
      _validity = [[NSNumber alloc] initWithInteger:validity];
    }
  }
  
  return self;
}

// 获取图片的key值
- (NSString *)key
{
  return _key;
}

// 获取图片
//- (UIImage *)image
//{
//  if (_imageData == nil)
//  {
//    return nil;
//  }
//  
//  if ([self isAvailability] == YES)
//  {
//    return [UIImage imageFromData:_imageData];
//  }
//  
//  return nil;
//}

// 获取而二进制数据
- (NSData *)data
{
  return _imageData;
}

// 当前时间是否有效
- (BOOL)isAvailability
{
  if (_validity == nil || [_validity integerValue] == 0)
  {
    return YES;
  }
  
  if (_cacheDate != nil && [_validity integerValue] > 0)
  {
    NSDate *date = [[NSDate alloc] init];
    
    if ([date timeIntervalSinceDate:_cacheDate] < [_validity integerValue])
    {
      return YES;
    }
  }
  
  return NO;
}

// 保存到图片文件缓存中
- (BOOL)saveChache
{
  if (_imageData != nil && _key != nil)
  {
    _cacheDate = [[NSDate alloc] init];
    return [QRCTImageCacheManager saveImageCache:self];
  }
  
  return NO;
}

// 删除图片文件缓存
- (void)deleteChache
{
  if (_key != nil)
  {
    [QRCTImageCache deleteCacheWithKey:_key];
  }
}

// 当存储的数据结构和对象的数据结构或数据结构版本或数据版本有差异的时候，才调用此函数
+ (id)mergeDataWithOriginData:(id<NSObject>)originData
                   withAppVID:(NSString *)appVID
            withStructVersion:(NSString *)originStructVersion
              withDataVersion:(NSString *)originDataVersion
                   withModule:(NSString *)module
                      withKey:(NSString *)key
{
  if (originData != nil && [originData isKindOfClass:[NSDictionary class]] == YES)
  {
    NSDictionary *dictionaryValue = [(NSDictionary *)originData objectForKey:kDataStructRootKey];
    
    QRCTImageCache *imageCache = [[QRCTImageCache alloc] init];
    
    [imageCache setCacheDate:[dictionaryValue objectForKey:@"cacheDate"]];
    [imageCache setKey:[dictionaryValue objectForKey:@"key"]];
    [imageCache setImageData:[dictionaryValue objectForKey:@"imageData"]];
    [imageCache setValidity:[dictionaryValue objectForKey:@"validity"]];
    
    if ([imageCache key] != nil && [imageCache imageData] != nil)
    {
      [QRCTImageCacheManager saveImageCache:imageCache];
      return imageCache;
    }
    else
    {
      [QRCTImageCacheManager deleteImageCacheWithKey:key];
    }
  }
  
  return nil;
}

@end
