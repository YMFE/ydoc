//
//  QRCTMergeDataStoragePrt.h
//  RCTImage
//
//  Created by yangxue on 16/4/7.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol QRCTMergeDataStoragePrt <NSObject>

// 当存储的数据结构和对象的数据结构或数据结构版本或数据版本有差异的时候，才调用此函数
// 差异的情况是指：1、对象的属性名的类型发生变化(包括属性名的类型发生变化或属性名的对应的类不存在)；2、数据对应的数据类不存在
// 注意：NSString和NSMutableString、NSData和NSMutableData、NSArray和NSMutableArray、NSDictionary和NSMutableDictionary的变化也会忽略
+ (id)mergeDataWithOriginData:(id<NSObject>)originData
                   withAppVID:(NSString *)appVID
            withStructVersion:(NSString *)originStructVersion
              withDataVersion:(NSString *)originDataVersion
                   withModule:(NSString *)module
                      withKey:(NSString *)key;


@end
