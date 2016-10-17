//
//  RCTIconFontManager.m
//  RCTOnlineFont
//
//  Created by yangxue on 16/3/2.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import "RCTIconFontManager.h"
#import "RCTUIManager.h"
#import "RCTShadowText.h"
#import "RCTNetworking.h"

#import <CoreText/CTFontManager.h>

@interface RCTUIManager (RCTIconFontManager)

- (NSMutableDictionary<NSNumber *, RCTShadowView *> *)shadowViewRegistry;

@end

@implementation RCTIconFontManager
{
  BOOL _loaded;
  NSMutableSet *_familyLoaded;
  NSMutableDictionary<NSString *, NSMutableSet<NSNumber *> *> *_familyRequests;
}

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _methodQueue = dispatch_queue_create(NULL, DISPATCH_QUEUE_SERIAL);
    _familyLoaded = [NSMutableSet set];
    _familyRequests = [NSMutableDictionary dictionary];
  });
  
  return _methodQueue;
}

- (void)requestFontFamilyToLoad:(NSString *)fontFamily forTag:(NSNumber *)reactTag {
  NSMutableSet *tagSetForFamily = [_familyRequests objectForKey:fontFamily];
  if (!tagSetForFamily) {
    tagSetForFamily = [NSMutableSet set];
    [_familyRequests setObject:tagSetForFamily forKey:fontFamily];
  }
  [tagSetForFamily addObject:reactTag];
}

- (void)updateComponentsWithFontFamily:(NSString *)fontFamily {
  NSSet *componentsToUpdate = [_familyRequests objectForKey:fontFamily];
  if (!componentsToUpdate) {
    return;
  }
  
  dispatch_async(_bridge.uiManager.methodQueue, ^{
    for (NSNumber *reactTag in componentsToUpdate) {
      RCTShadowView *shadowTextView = _bridge.uiManager.shadowViewRegistry[reactTag];
      [shadowTextView dirtyText];
    }
    
    [_familyRequests removeObjectForKey:fontFamily];
    [_familyLoaded addObject:fontFamily];
    RCTLogInfo(@"字体 %@ 加载成功", fontFamily);
    [_bridge.uiManager setNeedsLayout];
  });
}

- (BOOL)fontHasLoadedForFamily:(NSString *)fontFamily {
  return [_familyLoaded containsObject:fontFamily];
}

/**
 *注册在线字体
 */
RCT_EXPORT_METHOD(performLoadFonts:(NSDictionary *)iconFontDic)
{
  for (NSString *familyName in [iconFontDic allKeys])
  {
    // 允许重复进入重新加载新字体
    if ([[UIFont familyNames] containsObject:familyName]) {
      RCTLogWarn(@"字体 %@ 已经加载过，请检查名称冲突", familyName);
      continue;
    }
    
    NSURL *fontUrl = [NSURL URLWithString:iconFontDic[familyName]];
    NSURLRequest *fontResourceRequest = [NSURLRequest requestWithURL:fontUrl];
    __weak typeof(self) weakSelf = self;
    // 通过RCTNetworking请求，确保字体加载请求可以被RN的所有拦截器拦到
    RCTNetworkTask *networkTask = [_bridge.networking networkTaskWithRequest:fontResourceRequest
                                                             completionBlock:^(NSURLResponse *_response, NSData *data, NSError *error) {
                                                               NSHTTPURLResponse *response = (NSHTTPURLResponse *)_response;
                                                               if (![response isKindOfClass:[NSHTTPURLResponse class]] || response.statusCode != 200) {
                                                                 RCTLogWarn(@"字体 %@ 加载失败：网络请求出错", familyName);
                                                                 return;
                                                               }
                                                               
                                                               CGDataProviderRef fontDataProvider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
                                                               CGFontRef fontRef = CGFontCreateWithDataProvider(fontDataProvider);
                                                               CGDataProviderRelease(fontDataProvider);
                                                               if (!fontRef) {
                                                                 RCTLogWarn(@"字体 %@ 加载失败：字体文件损坏", familyName);
                                                                 return;
                                                               }
                                                               
                                                               NSString *loadedFamilyName = (__bridge_transfer NSString *)CGFontCopyPostScriptName(fontRef);
                                                               if (![loadedFamilyName isEqualToString:familyName]) {
                                                                 RCTLogWarn(@"字体文件内容中的familyName [%@] 与QFontSet中声明的 familyName [%@] 不一致，将不会加载此字体", loadedFamilyName, familyName);
                                                                 CGFontRelease(fontRef);
                                                                 return;
                                                               }
                                                               CTFontManagerRegisterGraphicsFont(fontRef, NULL);
                                                               CGFontRelease(fontRef);
                                                               
                                                               [weakSelf updateComponentsWithFontFamily:loadedFamilyName];
                                                             }];
    [networkTask start];
  }
}

@end


@implementation RCTBridge (RCTIconFontManager)

- (RCTIconFontManager *)iconFontManager
{
  return [self moduleForClass:[RCTIconFontManager class]];
}

@end
