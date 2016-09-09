//
//  QRCTImageCacheManager.m
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "QRCTImageCacheManager.h"

#import "QRCTImageCache.h"
#import "QRCTStorageManager.h"
#include <sys/stat.h>
#import "NSString+QRCTImage.h"

#define kRCTImageModuleName                         @"RCTImage"             // 图片缓存存储模块
#define kFrameworkModuleName                        @"CommonFramework"
#define kImageCacheModuleKey                        @"ImageCache"
#define kImageCacheModuleTempKey                    @"ImageCacheTemp"
#define kImageCacheTotalSizeKey                     @"ImageCacheTotalSize"
#define kImageCacheModuleSizeMax                    1000*1000*100

@interface QRCTImageCacheManager ()

@property (nonatomic, strong) NSNumber                  *isExchangeFolder;  // 是否需要交换目录

@end

static QRCTImageCacheManager *globalImageCacheManager = nil;
@implementation QRCTImageCacheManager

+ (instancetype)getInstance
{
  @synchronized(self)
  {
    if(globalImageCacheManager == nil)
    {
      globalImageCacheManager = [[super allocWithZone:NULL] init];
      
      // 初始化
      NSNumber *totalSize = (NSNumber *)[QRCTStorageManager objectWithModule:kRCTImageModuleName
                                                                     withKey:kImageCacheTotalSizeKey
                                                                   withMerge:nil];
      if (totalSize != nil && [totalSize longLongValue] > kImageCacheModuleSizeMax)
      {
        [globalImageCacheManager exchangeImageCacheFolder];
        [QRCTStorageManager deleteDataWithModule:kRCTImageModuleName
                                         withKey:kImageCacheTotalSizeKey];
      }
      else if ([globalImageCacheManager checkImageCacheTempFolder] == YES)
      {
        [globalImageCacheManager performSelectorInBackground:@selector(clearImageCacheTempFolder) withObject:nil];
      }
      else
      {
        [globalImageCacheManager performSelectorInBackground:@selector(checkImageCacheSize) withObject:nil];
      }
    }
  }
  
  return globalImageCacheManager;
}

+ (QRCTImageCache *)imageCacheWithKey:(NSString *)key
{
  return [[QRCTImageCacheManager getInstance] imageCacheForKey:key];
}

+ (BOOL)saveImageCache:(QRCTImageCache *)imageCache
{
  return [[QRCTImageCacheManager getInstance] saveImageCache:imageCache
                                                      forKey:[imageCache key]];
}

+ (void)deleteImageCacheWithKey:(NSString *)key
{
  [[QRCTImageCacheManager getInstance] removeCacheForKey:key];
}

- (BOOL)checkImageCacheTempFolder
{
  // 获取document文件夹位置
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentDirectory = [paths objectAtIndex:0];
  
  // 存储目录
  NSString *folderPath = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@", [kImageCacheModuleTempKey hexStringFromString:kImageCacheModuleTempKey]]];
  
  //如果文件夹存在
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if([fileManager fileExistsAtPath:folderPath] == YES)
  {
    return YES;
  }
  
  return NO;
}

- (void)clearImageCacheTempFolder
{
  // 获取document文件夹位置
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentDirectory = [paths objectAtIndex:0];
  
  // 存储目录
  NSString *folderPath = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@", [kImageCacheModuleTempKey hexStringFromString:kImageCacheModuleTempKey]]];
  
  //如果文件夹存在
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if([fileManager fileExistsAtPath:folderPath] == YES)
  {
    NSError *error;
    [fileManager removeItemAtPath:folderPath error:&error];
  }
}

- (void)checkImageCacheSize
{
  // 获取document文件夹位置
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentDirectory = [paths objectAtIndex:0];
  
  // 存储目录
  NSString *folderPath = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@", [kImageCacheModuleKey hexStringFromString:kImageCacheModuleKey]]];
  
  //如果文件夹不存在
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if([fileManager fileExistsAtPath:folderPath] == NO)
  {
    _isExchangeFolder = [NSNumber numberWithBool:NO];
    return;
  }
  
  NSEnumerator *childFilesEnumerator = [[fileManager subpathsAtPath:folderPath] objectEnumerator];
  NSString* fileName = nil;
  long long folderSize = 0;
  while ((fileName = [childFilesEnumerator nextObject]) != nil)
  {
    NSString* fileAbsolutePath = [folderPath stringByAppendingPathComponent:fileName];
    
    struct stat st;
    if(lstat([fileAbsolutePath cStringUsingEncoding:NSUTF8StringEncoding], &st) == 0)
    {
      folderSize += st.st_size;
    }
  }
  
  if (folderSize > kImageCacheModuleSizeMax)
  {
    [QRCTStorageManager saveDataWithObject:[NSNumber numberWithLongLong:folderSize]
                                withModule:kRCTImageModuleName
                                   withKey:kImageCacheTotalSizeKey];
  }
}

- (void)exchangeImageCacheFolder
{
  // 获取document文件夹位置
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentDirectory = [paths objectAtIndex:0];
  
  // 存储目录
  NSString *folderPath = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@", [kImageCacheModuleKey hexStringFromString:kImageCacheModuleKey]]];
  
  //如果文件夹不存在
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if([fileManager fileExistsAtPath:folderPath] == NO)
  {
    _isExchangeFolder = [NSNumber numberWithBool:NO];
    return;
  }
  
  NSString *folderPathTemp = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@", [kImageCacheModuleTempKey hexStringFromString:kImageCacheModuleTempKey]]];
  
  NSError *error;
  if ([fileManager moveItemAtPath:folderPath toPath:folderPathTemp error:&error] == YES)
  {
    [fileManager createDirectoryAtPath:folderPath withIntermediateDirectories:YES attributes:nil error:nil];
    _isExchangeFolder = [NSNumber numberWithBool:YES];
  }
}

- (BOOL)exchangeImageCacheForKey:(NSString *)key
{
  if (key == nil || [key length] <= 0)
  {
    return NO;
  }
  
  // 获取document文件夹位置
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentDirectory = [paths objectAtIndex:0];
  
  // 存储目录
  NSString *filePathTemp = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@/%@", [kImageCacheModuleTempKey hexStringFromString:kImageCacheModuleTempKey], [key hexStringFromString:key]]];
  
  //如果文件不存在
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if([fileManager fileExistsAtPath:filePathTemp] == NO)
  {
    return NO;
  }
  
  //如果文件不存在
  NSString *filePath = [documentDirectory stringByAppendingPathComponent:[[NSString alloc] initWithFormat:@"/%@/%@", [kImageCacheModuleKey hexStringFromString:kImageCacheModuleKey], [key hexStringFromString:key]]];
  if([fileManager fileExistsAtPath:filePath] == YES)
  {
    return YES;
  }
  
  NSError *error;
  if ([fileManager copyItemAtPath:filePathTemp toPath:filePath error:&error] == YES)
  {
    return YES;
  }
  
  return NO;
}

- (QRCTImageCache *)imageCacheForKey:(NSString *)key
{
  NSString *imageCacheModule = kImageCacheModuleKey;
  
  if (_isExchangeFolder != nil && [_isExchangeFolder boolValue] == YES)
  {
    [self performSelectorInBackground:@selector(exchangeImageCacheForKey:) withObject:key];
    
    imageCacheModule = kImageCacheModuleTempKey;
  }
  
  id object = [QRCTStorageManager objectWithModule:imageCacheModule
                                           withKey:key
                                         withMerge:[[QRCTImageCache alloc] init]];
  
  if (object != nil && [object isKindOfClass:[QRCTImageCache class]] == YES)
  {
    return (QRCTImageCache *)object;
  }
  
  return nil;
}

- (BOOL)saveImageCache:(QRCTImageCache *)imageCache forKey:(NSString *)key
{
  NSString *imageCacheModule = kImageCacheModuleKey;
  
  if (_isExchangeFolder != nil && [_isExchangeFolder boolValue] == YES)
  {
    imageCacheModule = kImageCacheModuleTempKey;
  }
  
  if (imageCache != nil)
  {
    if ([QRCTStorageManager saveDataWithObject:imageCache withModule:imageCacheModule withKey:key] == YES)
    {
      if (_isExchangeFolder != nil && [_isExchangeFolder boolValue] == YES)
      {
        [self performSelectorInBackground:@selector(exchangeImageCacheForKey:) withObject:key];
      }
      return YES;
    }
  }
  
  return NO;
}

- (void)removeCacheForKey:(NSString *)key
{
  NSString *imageCacheModule = kImageCacheModuleKey;
  
  if (_isExchangeFolder != nil && [_isExchangeFolder boolValue] == YES)
  {
    [QRCTStorageManager deleteDataWithModule:imageCacheModule withKey:key];
    
    imageCacheModule = kImageCacheModuleTempKey;
  }
  
  [QRCTStorageManager deleteDataWithModule:imageCacheModule withKey:key];
}

@end
