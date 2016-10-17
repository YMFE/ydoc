//
//  QRCTImageStoreManager.m
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "QRCTImageStoreManager.h"

#import "QRCTImageCache.h"

#define ReturnValueIfNil(A,B) if(!A){return B;}

static const NSUInteger MemoryCacheLimit =  100*1024*1024;
typedef void(^CompleteBlock)();
const char * QRCTIOQUEUENAME = "com.qunar.react.imageCache.ioQueue";

@interface QRCTImageStoreManager ()

@property (nonatomic, strong) NSCache *memoryCache;         // image内存存储
@property (nonatomic,strong) dispatch_queue_t ioQueue;

@end

static QRCTImageStoreManager *globalImageStoreManager = nil;
@implementation QRCTImageStoreManager

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype )sharedInstance
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    globalImageStoreManager = [[QRCTImageStoreManager alloc] init];
  });
  
  return globalImageStoreManager;
}

- (instancetype)init
{
  return [self initWithName:@"com.qunar.react.imageCache"];
}

- (instancetype)initWithName:(NSString *)name
{
  self = [super init];
  if(self) {
    _memoryCache = [[NSCache alloc] init];
    _memoryCache.totalCostLimit = MemoryCacheLimit;
    _ioQueue = dispatch_queue_create(QRCTIOQUEUENAME, DISPATCH_QUEUE_SERIAL);
    
    [self addNotificationObserver];
  }
  
  return self;
}

- (void)addNotificationObserver
{
  // 内存警告
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(clearMemoryCache)
                                               name:UIApplicationDidReceiveMemoryWarningNotification
                                             object:nil];
}

- (id)copyWithZone:(NSZone *)zone
{
  return [QRCTImageStoreManager sharedInstance];
}

+ (void)cacheImageData:(NSData *)imageData
                forKey:(NSString *)imageKey
{
  [[QRCTImageStoreManager sharedInstance] cacheImageData:imageData
                                                  forKey:imageKey];
}

+ (NSOperation *)retrieveImageDataForKey:(NSString *)imageKey
                                complete:(RetriveImageCompleteBlock)complete
{
  return [[QRCTImageStoreManager sharedInstance] retrieveImageDataForKey:imageKey
                                                                complete:complete];
}

+ (void)removeCacheForKey:(NSString *)key
{
  [[QRCTImageStoreManager sharedInstance] removeCacheForKey:key];
}

+ (NSData *)imageDataForKey:(NSString *)key
{
  return [[QRCTImageStoreManager sharedInstance] imageDataForKey:key];
}

- (void)cacheImageData:(NSData *)imageData forKey:(NSString *)imageKey
{
  if (imageData && imageKey)
  {
    [self memoryCacheImageData:imageData forKey:imageKey];
    [self diskCacheImageData:imageData forKey:imageKey];
  }
}

- (NSOperation *)retrieveImageDataForKey:(NSString *)imageKey complete:(RetriveImageCompleteBlock)completeBlock{
  
  if(!completeBlock)
  {
    return nil;
  }
  
  if(!imageKey)
  {
    completeBlock(nil,QRImageCacheTypeNone);
    return  nil;
  }
  
  NSData * imageData = [self imageDataInMemoryForKey:imageKey];
  if(imageData)
  {
    completeBlock(imageData,QRImageCacheTypeMemory);
    return nil;
  }
  
  NSOperation * operation = [NSOperation new];
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSData *diskImageData = [self imageDataInDiskForKey:imageKey];
    if(diskImageData)
    {
      [self memoryCacheImageData:diskImageData forKey:imageKey];
      dispatch_async(dispatch_get_main_queue(), ^{
        if(![operation isCancelled])
        {
          completeBlock(diskImageData,QRImageCacheTypeDisk);
        }
      });
    }
    else
    {
      dispatch_async(dispatch_get_main_queue(), ^{
        if(![operation isCancelled])
        {
          completeBlock(nil,QRImageCacheTypeNone);
        }
      });
    }
  });
  
  return operation;
}

- (void)removeCacheForKey:(NSString *)key
{
  [self.memoryCache removeObjectForKey:key];
  dispatch_async(self.ioQueue, ^{
    [QRCTImageCache deleteCacheWithKey:key];
  });
}

- (NSData *)imageDataForKey:(NSString *)key
{
  ReturnValueIfNil(key, nil);
  NSData * imageData = [self imageDataInMemoryForKey:key];
  if(!imageData)
  {
    imageData = [self imageDataInDiskForKey:key];
    if(imageData)
    {
      [self memoryCacheImageData:imageData forKey:key];
    }
  }
  return imageData;
}

- (NSData *)imageDataInMemoryForKey:(NSString *)imageKey
{
  if(imageKey)
  {
    return [self.memoryCache objectForKey:imageKey];
  }
  return nil;
}

- (void)memoryCacheImageData:(NSData *)imageData
                      forKey:(NSString *)imageKey
{
  if(imageData && imageKey)
  {
    [self.memoryCache setObject:imageData forKey:imageKey];
  }
}

- (void)setMaxMemoryCost:(NSUInteger)maxMemoryCost
{
  self.memoryCache.totalCostLimit = maxMemoryCost;
}

- (void)clearMemoryCache
{
  [self.memoryCache removeAllObjects];
}

- (NSData *)imageDataInDiskForKey:(NSString *)imageKey
{
  ReturnValueIfNil(imageKey,nil)
  QRCTImageCache *imageCache = [QRCTImageCache imageCacheWithKey:imageKey];
  if([imageCache isAvailability])
  {
    return imageCache.data;
  }
  return nil;
}

- (void)diskCacheImageData:(NSData *)imageData
                    forKey:(NSString *)imageKey
{
  if(imageKey&&imageData)
  {
    dispatch_async(self.ioQueue, ^{
      [QRCTImageCache saveCacheWithKey:imageKey
                         withImageData:imageData
                          withValidity:0];
    });
  }
}

@end
