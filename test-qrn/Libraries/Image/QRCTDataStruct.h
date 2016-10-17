//
//  QRCTDataStruct.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface QRCTDataStruct : NSObject

@property (nonatomic, readonly, strong) NSString    *appVID;
@property (nonatomic, readonly, strong) NSString    *classType;
@property (nonatomic, readonly, strong) NSString    *structVersion;
@property (nonatomic, readonly, strong) NSString    *dataVersion;

// 根据对象创建DataStruct对象
+ (instancetype)createDataStructWithObject:(id<NSObject>)object;

// 根据对象、数据结构版本和数据版本创建DataStruct对象
+ (instancetype)createDataStructWithObject:(id<NSObject>)object
                         withStructVersion:(NSString *)structVersion
                            andDataVersion:(NSString *)dataVersion;

// 根据二进制数据创建DataStruct对象
+ (instancetype)createDataStructWithData:(NSData *)data;

// 获取数据结构和数据的二进制数据
- (NSData *)data;

// 获取对象存储的值，返回的是一个字段，注意数组也会转成NSDictionary
- (NSDictionary *)dataVaule;

// 根据数据结构信息和数据创建对象
- (id)objectWithDataStruct;

@end
