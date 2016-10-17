//
//  QRCTPhoto.h
//  QRCTPhoto
//
//  Created by yingdong.guo on 2015/12/03.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import "RCTBridgeModule.h"
typedef NS_ENUM(NSInteger, QRCTErrorCodePhoto){
    
    //设备错误
    QRCTErrorCodePhotoDevice        = 20212,
    
    //storeManager错误
    QRCTErrorCodeStoreManager       = 20213,

    //URI错误
    QRCTErrorCodePhotoURI           = 20214,
    
    //保存错误
    QRCTErrorCodePhotoSave          = 20215,

    //相册错误
    QRCTErrorCodeLibraryOperate     = 20216,
};
@interface QRCTPhotoManager : NSObject <RCTBridgeModule>

@end
