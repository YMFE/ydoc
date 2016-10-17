//
//  RCTCookieManager.m
//  RCTNetwork
//
//  Created by yingdong.guo on 2016/04/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTCookieManager.h"
#import "RCTConvert.h"
#import "QRCTError.h"

static NSString *QRCTCookieNameKey = @"key";
static NSString *QRCTCookieDomainKey = @"domain";
static NSString *QRCTCookieValueKey = @"value";
static NSString *QRCTCookiePathKey = @"path";
static NSString *QRCTCookieExpiresKey = @"expires";
static NSString *QRCTCookieSecureKey = @"secure";
static NSString *QRCTCookieHTTPOnlyKey = @"httpOnly";

static NSDictionary *QRCTCookieDictionary(NSHTTPCookie *cookie) {
  NSMutableDictionary *dic = [NSMutableDictionary dictionary];
  if (cookie.name) {
    [dic setObject:cookie.name forKey:QRCTCookieNameKey];
  }
  if (cookie.domain) {
    [dic setObject:cookie.domain forKey:QRCTCookieDomainKey];
  }
  if (cookie.value) {
    [dic setObject:cookie.value forKey:QRCTCookieValueKey];
  }
  /* android尚未实现，不贴
  if (cookie.path) {
    [dic setObject:cookie.path forKey:QRCTCookiePathKey];
  }
  if (cookie.expiresDate) {
    [dic setObject:cookie.expiresDate forKey:QRCTCookieExpiresKey];
  }
  [dic setObject:@(cookie.isSecure) forKey:QRCTCookieSecureKey];
  [dic setObject:@(cookie.HTTPOnly) forKey:QRCTCookieHTTPOnlyKey];
   */
  return dic;
}

@interface RCTConvert (NSHTTPCookie)

+ (NSHTTPCookie *)NSHTTPCookie:(NSDictionary *)json;

@end

@implementation RCTConvert (NSHTTPCookie)

+ (NSHTTPCookie *)NSHTTPCookie:(NSDictionary *)json {
  if (!json) {
    return nil;
  }
  
  if (!json[QRCTCookieDomainKey]) {
    RCTLogError(@"Cookie must has 'domain' field");
    return nil;
  }
  if (!json[QRCTCookieNameKey]) {
    RCTLogError(@"Cookie must has 'key' field");
    return nil;
  }
  if (!json[QRCTCookieValueKey]) {
    RCTLogError(@"Cookie must has 'value' field");
    return nil;
  }
  
  NSMutableString *cookieHeaderString = [NSMutableString stringWithFormat:@"%@=%@; Domain=%@", json[QRCTCookieNameKey], json[QRCTCookieValueKey], json[QRCTCookieDomainKey]];
  
  if (json[QRCTCookiePathKey]) {
    [cookieHeaderString appendString:[NSString stringWithFormat:@"; Path=%@", json[QRCTCookiePathKey]]];
  }
  if (json[QRCTCookieExpiresKey]) {
    [cookieHeaderString appendString:[NSString stringWithFormat:@"; Expires=%@", json[QRCTCookieExpiresKey]]];
  }
  if (json[QRCTCookieSecureKey] && [json[QRCTCookieSecureKey] boolValue]) {
    [cookieHeaderString appendString:@"; Secure"];
  }
  if (json[QRCTCookieHTTPOnlyKey] && [json[QRCTCookieHTTPOnlyKey] boolValue]) {
    [cookieHeaderString appendString:@"; HttpOnly"];
  }
  
  NSArray *arrayCookie = [NSHTTPCookie cookiesWithResponseHeaderFields:@{@"Set-Cookie": cookieHeaderString} forURL:[NSURL URLWithString:@"http://rn.qunar.com/"]];
  return arrayCookie.count ? [arrayCookie firstObject] : nil;
}

@end

@implementation RCTCookieManager

RCT_EXPORT_MODULE()

#pragma mark - export methods

RCT_EXPORT_METHOD(getCookiesForURL:(NSURL *)URL successCallback:(RCTResponseSenderBlock)successCallback)
{
  NSArray<NSHTTPCookie *> *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:URL];
  NSMutableArray<NSDictionary *> *jsCookies = [NSMutableArray arrayWithCapacity:cookies.count];
  [cookies enumerateObjectsUsingBlock:^(NSHTTPCookie *obj, __unused NSUInteger idx, __unused BOOL *stop) {
    [jsCookies addObject:QRCTCookieDictionary(obj)];
  }];
  
  successCallback(@[jsCookies]);
}

RCT_EXPORT_METHOD(getCookieForKey:(NSString *)key URL:(NSURL *)URL successCallback:(RCTResponseSenderBlock)successCallback errorCallback:(RCTResponseErrorBlock)errorCallback)
{
  NSHTTPCookie *cookie = [self p_getCookieForKey:key URL:URL];
  if (cookie) {
    successCallback(@[QRCTCookieDictionary(cookie)]);
  } else {
    errorCallback(QJSResponseError(QRCTErrorCodeException, @"cookie not exist"));
  }
}

RCT_EXPORT_METHOD(setCookie:(nonnull NSHTTPCookie *)cookie successCallback:(RCTResponseSenderBlock)successCallback) {
  [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
  successCallback(@[]);
}

RCT_EXPORT_METHOD(removeCookieForKey:(NSString *)key URL:(NSString *)urlString callback:(RCTResponseSenderBlock)callback)
{
  NSHTTPCookie *cookie = [self p_getCookieForKey:key URL:[NSURL URLWithString:urlString]];
  if (cookie) {
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
  }
  callback(@[]);
}

RCT_EXPORT_METHOD(removeCookie:(nonnull NSHTTPCookie *)aCookie callback:(RCTResponseSenderBlock)callback)
{
  NSArray<NSHTTPCookie *> *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
  __block NSHTTPCookie *cookie;
  [cookies enumerateObjectsUsingBlock:^(NSHTTPCookie *obj, __unused NSUInteger idx, BOOL *stop) {
    if ([obj.name isEqualToString:aCookie.name] &&
        [obj.domain isEqualToString:aCookie.domain] &&
        [obj.path isEqualToString:aCookie.path]) {
      cookie = obj;
      *stop = YES;
    }
  }];
  
  if (cookie) {
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
  }
  callback(@[]);
}

#pragma mark - private methods

- (NSHTTPCookie *)p_getCookieForKey:(NSString *)key URL:(NSURL *)URL {
  NSArray<NSHTTPCookie *> *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:URL];
  __block NSHTTPCookie *cookie;
  [cookies enumerateObjectsUsingBlock:^(NSHTTPCookie *obj, __unused NSUInteger idx, BOOL *stop) {
    if ([obj.name isEqualToString:key]) {
      cookie = obj;
      *stop = YES;
    }
  }];
  
  return cookie;
}

@end
