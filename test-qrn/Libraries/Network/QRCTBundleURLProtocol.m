//
//  QRCTBundleURLProtocol.m
//  RCTNetwork
//
//  Created by yingdong.guo on 2016/04/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "QRCTBundleURLProtocol.h"
#import "RCTLog.h"
#import <MobileCoreServices/MobileCoreServices.h>

static NSBundle *QRCTPlatformBundle() {
  NSString *qrctBundlePath = [[NSBundle mainBundle] pathForResource:@"ReactNativeBundle" ofType:@"bundle"];
#if defined(BETA_BUILD) || (defined(DEBUG) && DEBUG)
  if (!qrctBundlePath) {
    RCTLogError(@"当前客户端内无RN资源包`ReactNativeBundle.bundle`，请检查工程配置");
    return nil;
  }
#endif
  return [NSBundle bundleWithPath:qrctBundlePath];
}

@implementation QRCTBundleURLProtocol

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
  NSURL *requestURL = request.URL;
  if (([requestURL.scheme isEqualToString:@"http"] || [requestURL.scheme isEqualToString:@"https"])
      && [requestURL.host isEqualToString:@"s.qunarzz.com"]
      && [requestURL.path hasPrefix:@"/qunar_react_native/"]
      ) {
    NSString *resourceName = requestURL.path.lastPathComponent;
    NSString *resourcePath = [QRCTPlatformBundle() pathForResource:resourceName ofType:nil];
    if (resourcePath) {
      return YES;
    }
  }
  return NO;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
  return request;
}

- (void)startLoading {
  NSURL *requestURL = self.request.URL;
  NSString *resourceName = requestURL.path.lastPathComponent;
  NSString *resourcePath = [QRCTPlatformBundle() pathForResource:resourceName ofType:nil];
  
  NSString *mimeType;
  NSString *pathExt = [resourcePath pathExtension];
  if (pathExt.length > 0) {
    CFStringRef pathExtension = (__bridge_retained CFStringRef)pathExt;
    CFStringRef type = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension, NULL);
    CFRelease(pathExtension);
    mimeType = (__bridge_transfer NSString *)UTTypeCopyPreferredTagWithClass(type, kUTTagClassMIMEType);
    if (type != NULL)
      CFRelease(type);
  }
  
  if (!mimeType){
    mimeType = @"application/octet-stream";
  }
  
  NSData *fileData = [NSData dataWithContentsOfFile:resourcePath];
  NSHTTPURLResponse *response = [[NSHTTPURLResponse alloc] initWithURL:self.request.URL
                                                            statusCode:200 HTTPVersion:@"HTTP/1.1"
                                                          headerFields:@{@"Content-Length": [NSString stringWithFormat:@"%ld", (unsigned long)fileData.length],
                                                                         @"Content-Type": mimeType}];
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
  [self.client URLProtocol:self didLoadData:fileData];
  [self.client URLProtocolDidFinishLoading:self];
}

- (void)stopLoading {
  
}

@end
