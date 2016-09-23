//
//  QRCTDataUploader.h
//  QRCTImageUpload
//
//  Created by yingdong.guo on 2015/12/23.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^QRCTUploadCompletionHandler)(NSData *, NSError *);

extern NSString *const QRCTImageUploadOptionsFileKey;
extern NSString *const QRCTImageUploadOptionsFileNameKey;
extern NSString *const QRCTImageUploadOptionsURLKey;
extern NSString *const QRCTImageUploadOptionsServerParamKey;

@interface QRCTDataUploader : NSObject

+ (void)uploadFileData:(NSData *)data
           withFileKey:(NSString *)fileKey
              fileName:(NSString *)fileName
           contentType:(NSString *)contentType
                 toUrl:(NSURL *)url
     withAdditionParam:(NSDictionary *)param
     completionHandler:(QRCTUploadCompletionHandler)completion;

@end
