//
//  QRCTDataUploader.m
//  QRCTImageUpload
//
//  Created by yingdong.guo on 2015/12/23.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "QRCTDataUploader.h"

#define kQRCTDataUploadErrorDomain @"QRCTDataUpload"

NSString *const QRCTImageUploadOptionsFileKey = @"QRCTImageUploadOptionsFileKey";
NSString *const QRCTImageUploadOptionsFileNameKey = @"QRCTImageUploadOptionsFileNameKey";
NSString *const QRCTImageUploadOptionsURLKey = @"QRCTImageUploadOptionsURLKey";
NSString *const QRCTImageUploadOptionsServerParamKey = @"QRCTImageUploadOptionsServerParamKey";

@implementation QRCTDataUploader

+ (void)uploadFileData:(NSData *)data
           withFileKey:(NSString *)fileKey
              fileName:(NSString *)fileName
           contentType:(NSString *)contentType
                 toUrl:(NSURL *)url
     withAdditionParam:(NSDictionary *)param
     completionHandler:(QRCTUploadCompletionHandler)completion {
    NSMutableData *dataToPost = [NSMutableData data];
    
    BOOL hasServerParam = param && [param count];
    NSString *boundaryMarker = [NSString stringWithFormat:@"0xHyTiVeBoUnDaRy-%@", [NSUUID UUID].UUIDString];
    
    if (hasServerParam) {
        // 添加附加参数
        [param enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
            [dataToPost appendData:[[NSString stringWithFormat:@"\r\n--%@\r\n", boundaryMarker] dataUsingEncoding:NSUTF8StringEncoding]];
            [dataToPost appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\";\r\n\r\n", key] dataUsingEncoding:NSUTF8StringEncoding]];
            [dataToPost appendData:[obj dataUsingEncoding:NSUTF8StringEncoding]];
        }];
        
    }
    // 添加上传文件参数
    [dataToPost appendData:[[NSString stringWithFormat:@"\r\n--%@\r\n", boundaryMarker] dataUsingEncoding:NSUTF8StringEncoding]];
    [dataToPost appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\r\n", fileKey, fileName] dataUsingEncoding:NSUTF8StringEncoding]];
    [dataToPost appendData:[[NSString stringWithFormat:@"Content-Type: %@\r\n\r\n", contentType] dataUsingEncoding:NSUTF8StringEncoding]];
    
    // 填充上传文件数据
    [dataToPost appendData:data];
    
    // 添加body尾部
    [dataToPost appendData:[[NSString stringWithFormat:@"\r\n--%@--\r\n",boundaryMarker] dataUsingEncoding:NSUTF8StringEncoding]];
    
    // 生成HTTP请求
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                       timeoutInterval:60];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"Close" forHTTPHeaderField:@"Connection"];
    [request setValue:[NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundaryMarker] forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:dataToPost];
    [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[dataToPost length]] forHTTPHeaderField:@"Content-Length"];
    
    NSURLSessionUploadTask *uploadTask =
    [[NSURLSession sharedSession] uploadTaskWithRequest:request
                                               fromData:dataToPost
                                      completionHandler:^(NSData *data, NSURLResponse *response, NSError *connectionError) {
                                          if (connectionError) {
                                              completion(nil, connectionError);
                                              return;
                                          }
                                          
                                          if (((NSHTTPURLResponse *)response).statusCode != 200) {
                                              NSError *error = [NSError errorWithDomain:kQRCTDataUploadErrorDomain code:-1 userInfo:@{NSLocalizedDescriptionKey: @"请求接口出错"}];
                                              completion(nil, error);
                                              return;
                                          }
                                          
                                          if (!data) {
                                              NSError *error = [NSError errorWithDomain:kQRCTDataUploadErrorDomain code:-1 userInfo:@{NSLocalizedDescriptionKey: @"服务器未返回数据"}];
                                              completion(nil, error);
                                              return;
                                          }
                                          
                                          completion(data, nil);
                                      }];
    
    [uploadTask resume];
}

@end
