//
//  QRCTStorageManager.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "QRCTMergeDataStoragePrt.h"

@interface QRCTStorageManager : NSObject

////////////////////////////////////////////////////////////
// 注意:目前支持存储的类型如下：
// 基础类型:NSString、NSMutableString、NSNumber、NSData、NSMutableData、NSDate、NSNull
//         所有基础类型的子类会当作基础类型处理，且只存储基础类型的数据
// 容器类型:NSArray、NSMutableArray、NSDictionary、NSMutableDictionary
//         数组里面的类型应该为支持的类型、字典key的类型只能为NSString,且key对应的object类型应该为支持的类型
// 自定义类型:所有的自定义类型都需要继承于NSObject,且对应的属性应该为所支持的类型
// 对于不支持的数据类型，将会自动忽略,不会对其进行存储
// 不支持父类的属性的存储
////////////////////////////////////////////////////////////

// 通过module和key来存储对象,数据结构的版本号和数据内容的版本号则会为nil
+ (BOOL)saveDataWithObject:(id<NSObject>)object withModule:(NSString *)module withKey:(NSString *)key;


// 通过module和key来删除存储数据
+ (void)deleteDataWithModule:(NSString *)module withKey:(NSString *)key;

// 通过module和key来取对应的数据
// 如果merge对象实现了DataStoragePrt协议方法，则会在存储的数据结构和对象的数据结构或数据结构版本或数据版本有差异的时候回调DataStoragePrt协议方法
// 差异的情况是指：1、对象的属性名的类型发生变化(包括属性名的类型发生变化或属性名的对应的类不存在)；2、数据对应的数据类不存在
// 注意：NSString和NSMutableString、NSData和NSMutableData、NSArray和NSMutableArray、NSDictionary和NSMutableDictionary的变化也会忽略
+ (id)objectWithModule:(NSString *)module withKey:(NSString *)key withMerge:(id<QRCTMergeDataStoragePrt>)merge;

@end
