//
//  QRCTDataStruct.m
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "QRCTDataStruct.h"

#import "QRCTAppInfo.h"
#import <objc/runtime.h>

#define kDataStructRootKey               @"____DataStruct__Root____"             // 数据结构和数据内容的根节点
#define kDataStructRealTypeKey           @"____DataStruct__RealType____"         // 数据结构的真实类型key
#define kDataStructStandardTypeKey       @"____DataStruct__StandardType____"     // 数据结构的标准类型key

#define kDataStructAppVIDKey             @"____DataStruct__AppVID____"           // AppVID
#define kDataStructStructVersionKey      @"____DataStruct__StructVersion____"    // 数据结构版本
#define kDataStructDataVersionKey        @"____DataStruct__DataVersion____"      // 数据版本
#define kDataStructStructKey             @"____DataStruct__Struct____"           // 数据结构key
#define kDataStructDataKey               @"____DataStruct__Data____"             // 数据key
#define kDataStructRootTypeKey           @"____DataStruct__RootType____"         // 对象的类型

@interface QRCTDataStruct ()

@property (nonatomic, strong) NSMutableDictionary   *structInfo;
@property (nonatomic, strong) NSMutableDictionary   *dataValue;
@property (nonatomic, strong) NSData                *data;

@property (nonatomic, strong) NSMutableArray        *arrayCycleCheck;            // 防止循环引用

@end

@implementation QRCTDataStruct

+ (instancetype)createDataStructWithObject:(id<NSObject>)object
{
  return [QRCTDataStruct createDataStructWithObject:object
                                  withStructVersion:nil
                                     andDataVersion:nil];
}

+ (instancetype)createDataStructWithObject:(id<NSObject>)object
                         withStructVersion:(NSString *)structVersion
                            andDataVersion:(NSString *)dataVersion;
{
  if (object == nil || [[object class] isSubclassOfClass:[NSObject class]] == NO)
  {
    return nil;
  }
  
  QRCTDataStruct *dataStruct = [[QRCTDataStruct alloc] init];
  [dataStruct setArrayCycleCheck:[[NSMutableArray alloc] init]];
  
  NSMutableDictionary *dictionaryStuctInfo = [[NSMutableDictionary alloc] init];
  NSMutableDictionary *dictionaryDataValue = [[NSMutableDictionary alloc] init];
  
  [QRCTDataStruct structIno:dictionaryStuctInfo
                  dataValue:dictionaryDataValue
               forClassType:[object class]
                     andKey:kDataStructRootKey
                   andVaule:object
             withDataStruct:dataStruct];
  
  NSMutableDictionary *dictionaryBinary = [[NSMutableDictionary alloc] init];
  [dictionaryBinary setObject:dictionaryStuctInfo forKey:kDataStructStructKey];
  [dictionaryBinary setObject:dictionaryDataValue forKey:kDataStructDataKey];
  
  if ([QRCTAppInfo vid] != nil)
  {
    [dictionaryBinary setObject:[QRCTAppInfo vid] forKey:kDataStructAppVIDKey];
  }
  
  if (structVersion != nil)
  {
    [dictionaryBinary setObject:structVersion forKey:kDataStructStructVersionKey];
  }
  
  if (dataVersion != nil)
  {
    [dictionaryBinary setObject:dataVersion forKey:kDataStructDataVersionKey];
  }
  
  if ([object class] != nil)
  {
    [dictionaryBinary setObject:NSStringFromClass([object class]) forKey:kDataStructRootTypeKey];
  }
  
  NSData *data = [NSPropertyListSerialization dataWithPropertyList:dictionaryBinary
                                                            format:NSPropertyListBinaryFormat_v1_0
                                                           options:0
                                                             error:NULL];
  
  [dataStruct setData:data];
  [dataStruct setClassType:NSStringFromClass([object class])];
  [dataStruct setStructInfo:dictionaryStuctInfo];
  [dataStruct setDataValue:dictionaryDataValue];
  [dataStruct setStructVersion:structVersion];
  [dataStruct setDataVersion:dataVersion];
  [dataStruct setAppVID:[QRCTAppInfo vid]];
  
#if BETA_BUILD
  //    NSLog(@"%@", dictionaryBinary);
#endif
  
  return dataStruct;
}

+ (instancetype)createDataStructWithData:(NSData *)data
{
  if (data == nil)
  {
    return nil;
  }
  
  NSPropertyListFormat propertyListFormat;
  NSDictionary *dictionaryData = [NSPropertyListSerialization propertyListWithData:data
                                                                           options:0
                                                                            format:&propertyListFormat
                                                                             error:nil];
  
  if (dictionaryData == nil)
  {
    return nil;
  }
  
  QRCTDataStruct *dataStruct = [[QRCTDataStruct alloc] init];
  
  [dataStruct setData:data];
  [dataStruct setClassType:[dictionaryData objectForKey:kDataStructRootTypeKey]];
  [dataStruct setStructInfo:[dictionaryData objectForKey:kDataStructStructKey]];
  [dataStruct setDataValue:[dictionaryData objectForKey:kDataStructDataKey]];
  [dataStruct setStructVersion:[dictionaryData objectForKey:kDataStructStructVersionKey]];
  [dataStruct setDataVersion:[dictionaryData objectForKey:kDataStructDataVersionKey]];
  [dataStruct setAppVID:[dictionaryData objectForKey:kDataStructAppVIDKey]];
  
  if ([dataStruct classType] == nil || [dataStruct structInfo] == nil || [dataStruct dataValue] == nil)
  {
    return nil;
  }
  
#if BETA_BUILD
  //    NSLog(@"%@", dictionaryData);
#endif
  
  return dataStruct;
}

+ (void)structIno:(NSMutableDictionary *)dictionaryStructInfo
        dataValue:(NSMutableDictionary *)dictionaryDataValue
     forClassType:(Class)classType
           andKey:(NSString *)key
         andVaule:(id)object
   withDataStruct:(QRCTDataStruct *)dataStuct
{
  // 基本类型－－元数据
  if ([QRCTDataStruct isBaseDataType:classType] == YES)
  {
    [QRCTDataStruct baseDataStructIno:dictionaryStructInfo
                    baseDataDataValue:dictionaryDataValue
                         forClassType:classType
                               andKey:key
                             andVaule:object];
  }
  
  // 容器类型－－数组、字典
  if ([QRCTDataStruct isContainerType:classType] == YES)
  {
    if ([[dataStuct arrayCycleCheck] containsObject:object] == YES)
    {
      return;
    }
    [[dataStuct arrayCycleCheck] addObject:object];
    [QRCTDataStruct containerStructIno:dictionaryStructInfo
                    containerDataValue:dictionaryDataValue
                          forClassType:classType
                                andKey:key
                              andVaule:object
                        withDataStruct:dataStuct];
    [[dataStuct arrayCycleCheck] removeLastObject];
  }
  // 自定义类型
  if ([QRCTDataStruct isCustomType:classType] == YES)
  {
    if ([[dataStuct arrayCycleCheck] containsObject:object] == YES)
    {
      return;
    }
    [[dataStuct arrayCycleCheck] addObject:object];
    [QRCTDataStruct customStructIno:dictionaryStructInfo
                    customDataValue:dictionaryDataValue
                       forClassType:classType
                             andKey:key
                           andVaule:object
                     withDataStruct:dataStuct];
    [[dataStuct arrayCycleCheck] removeLastObject];
  }
}

// 处理基本类型
+ (void)baseDataStructIno:(NSMutableDictionary *)dictionaryStructInfo
        baseDataDataValue:(NSMutableDictionary *)dictionaryDataValue
             forClassType:(Class)classType
                   andKey:(NSString *)key
                 andVaule:(id)object
{
  if (classType == nil || object == nil)
  {
    return;
  }
  
  if ([QRCTDataStruct isBaseDataType:classType] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    
    Class standardType = [QRCTDataStruct standardBaseDataType:classType];
    
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass(standardType) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    
    id standerdObject = [QRCTDataStruct standardBaseDataValueWithObject:object];
    if (standerdObject != nil)
    {
      [dictionaryDataValue setObject:standerdObject forKey:key];
    }
  }
}

// 处理容器类型
+ (void)containerStructIno:(NSMutableDictionary *)dictionaryStructInfo
        containerDataValue:(NSMutableDictionary *)dictionaryDataValue
              forClassType:(Class)classType
                    andKey:(NSString *)key
                  andVaule:(id)object
            withDataStruct:(QRCTDataStruct *)dataStuct
{
  if (classType == nil || object == nil)
  {
    return;
  }
  
  if ([classType isSubclassOfClass:[NSMutableArray class]] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *dataVaule = [[NSMutableDictionary alloc] init];
    
    NSMutableArray *arrayObject = (NSMutableArray *)object;
    
    if (arrayObject != nil && [arrayObject count] > 0)
    {
      for (NSInteger i = 0; i < [arrayObject count]; ++i)
      {
        id obj = [arrayObject objectAtIndex:i];
        if (obj != nil)
        {
          NSString *objectKey = [[NSString alloc] initWithFormat:@"%ld", (long)i];
          
          [QRCTDataStruct structIno:structInfo
                          dataValue:dataVaule
                       forClassType:[obj class]
                             andKey:objectKey
                           andVaule:obj
                     withDataStruct:dataStuct];
        }
      }
    }
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass([NSMutableArray class]) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    [dictionaryDataValue setObject:dataVaule forKey:key];
  }
  
  if ([classType isSubclassOfClass:[NSArray class]] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    
    NSMutableDictionary *dataVaule = [[NSMutableDictionary alloc] init];
    
    NSArray *arrayObject = (NSArray *)object;
    
    if (arrayObject != nil && [arrayObject count] > 0)
    {
      for (NSInteger i = 0; i < [arrayObject count]; ++i)
      {
        id obj = [arrayObject objectAtIndex:i];
        if (obj != nil)
        {
          NSString *objectKey = [[NSString alloc] initWithFormat:@"%ld", (long)i];
          
          [QRCTDataStruct structIno:structInfo
                          dataValue:dataVaule
                       forClassType:[obj class]
                             andKey:objectKey
                           andVaule:obj
                     withDataStruct:dataStuct];
        }
      }
    }
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass([NSMutableDictionary class]) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    [dictionaryDataValue setObject:dataVaule forKey:key];
  }
  
  if ([classType isSubclassOfClass:[NSMutableDictionary class]] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    
    NSMutableDictionary *dataVaule = [[NSMutableDictionary alloc] init];
    
    NSMutableDictionary *dictionaryObject = (NSMutableDictionary *)object;
    
    if (dictionaryObject != nil)
    {
      for (id dictionaryKey in dictionaryObject)
      {
        if (dictionaryKey != nil && [dictionaryKey isKindOfClass:[NSString class]] == YES)
        {
          id dictionaryValue = [dictionaryObject objectForKey:(NSString *)dictionaryKey];
          
          [QRCTDataStruct structIno:structInfo
                          dataValue:dataVaule
                       forClassType:[dictionaryValue class]
                             andKey:(NSString *)dictionaryKey
                           andVaule:dictionaryValue
                     withDataStruct:dataStuct];
        }
      }
    }
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass([NSMutableDictionary class]) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    [dictionaryDataValue setObject:dataVaule forKey:key];
  }
  
  if ([classType isSubclassOfClass:[NSDictionary class]] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *dataVaule = [[NSMutableDictionary alloc] init];
    
    NSDictionary *dictionaryObject = (NSDictionary *)object;
    
    if (dictionaryObject != nil)
    {
      for (id dictionaryKey in dictionaryObject)
      {
        if (dictionaryKey != nil && [dictionaryKey isKindOfClass:[NSString class]] == YES)
        {
          id dictionaryValue = [dictionaryObject objectForKey:(NSString *)dictionaryKey];
          
          [QRCTDataStruct structIno:structInfo
                          dataValue:dataVaule
                       forClassType:[dictionaryValue class]
                             andKey:(NSString *)dictionaryKey
                           andVaule:dictionaryValue
                     withDataStruct:dataStuct];
        }
      }
    }
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass([NSDictionary class]) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    [dictionaryDataValue setObject:dataVaule forKey:key];
  }
}

// 处理自定义类型
+ (void)customStructIno:(NSMutableDictionary *)dictionaryStructInfo
        customDataValue:(NSMutableDictionary *)dictionaryDataValue
           forClassType:(Class)classType
                 andKey:(NSString *)key
               andVaule:(id)object
         withDataStruct:(QRCTDataStruct *)dataStuct
{
  if (classType == nil || object == nil)
  {
    return;
  }
  
  if ([QRCTDataStruct isCustomType:classType] == YES)
  {
    NSMutableDictionary *structInfo = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *dataValue = [[NSMutableDictionary alloc] init];
    
    unsigned int propertyCount = 0;
    objc_property_t *propertyList = class_copyPropertyList(classType, &propertyCount);
    
    for (unsigned int i = 0; i < propertyCount; ++i)
    {
      objc_property_t property = propertyList[i];
      
      NSString *propertyName = [[NSString alloc] initWithCString:property_getName(property) encoding:NSUTF8StringEncoding];
      NSString *propertyAttributes = [[NSString alloc] initWithCString:property_getAttributes(property) encoding:NSUTF8StringEncoding];
      
      if ([propertyAttributes hasPrefix:@"T@"] == YES)
      {
        Ivar iVar = class_getInstanceVariable(classType, [propertyName UTF8String]);
        if(iVar == nil)
        {
          // 采用另外一种方法尝试获取
          iVar = class_getInstanceVariable(classType, [[NSString stringWithFormat:@"_%@", propertyName] UTF8String]);
        }
        
        if (iVar != nil)
        {
          id propertyIVar = object_getIvar(object, iVar);
          
          if (propertyIVar != nil && [propertyIVar class] != nil)
          {
            [QRCTDataStruct structIno:structInfo
                            dataValue:dataValue
                         forClassType:[propertyIVar class]
                               andKey:propertyName
                             andVaule:propertyIVar
                       withDataStruct:dataStuct];
            
          }
        }
      }
    }
    
    free(propertyList);
    
    [structInfo setObject:NSStringFromClass(classType) forKey:kDataStructRealTypeKey];
    [structInfo setObject:NSStringFromClass([NSObject class]) forKey:kDataStructStandardTypeKey];
    
    [dictionaryStructInfo setObject:structInfo forKey:key];
    [dictionaryDataValue setObject:dataValue forKey:key];
  }
}

+ (Class)standardBaseDataType:(Class)classType
{
  if (classType == nil)
  {
    return nil;
  }
  
  if ([classType isSubclassOfClass:[NSMutableString class]] == YES)
  {
    return [NSMutableString class];
  }
  
  if ([classType isSubclassOfClass:[NSString class]] == YES)
  {
    return [NSString class];
  }
  
  if ([classType isSubclassOfClass:[NSNumber class]] == YES)
  {
    return [NSNumber class];
  }
  
  if ([classType isSubclassOfClass:[NSMutableData class]] == YES)
  {
    return [NSMutableData class];
  }
  
  if ([classType isSubclassOfClass:[NSData class]] == YES)
  {
    return [NSData class];
  }
  
  if ([classType isSubclassOfClass:[NSDate class]] == YES)
  {
    return [NSDate class];
  }
  
  if ([classType isSubclassOfClass:[NSNull class]] == YES)
  {
    return [NSNull class];
  }
  
  return nil;
}


// 是否是基本类型－－元数据
+ (BOOL)isBaseDataType:(Class)classType
{
  if ([QRCTDataStruct standardBaseDataType:classType] != nil)
  {
    return YES;
  }
  
  return NO;
}

+ (id)standardBaseDataValueWithObject:(id)object
{
  Class classType = [object class];
  
  if (object == nil || [QRCTDataStruct isBaseDataType:classType] == NO)
  {
    return nil;
  }
  
  if ([classType isSubclassOfClass:[NSMutableString class]] == YES)
  {
    return [[NSMutableString alloc] initWithString:(NSString *)object];
  }
  
  if ([classType isSubclassOfClass:[NSString class]] == YES)
  {
    return [[NSString alloc] initWithString:(NSString *)object];
  }
  
  if ([classType isSubclassOfClass:[NSNumber class]] == YES)
  {
    return [[[NSNumberFormatter alloc] init] numberFromString:[object stringValue]];
  }
  
  if ([classType isSubclassOfClass:[NSMutableData class]] == YES)
  {
    return [[NSMutableData alloc] initWithData:(NSData *)object];
  }
  
  if ([classType isSubclassOfClass:[NSData class]] == YES)
  {
    return [[NSData alloc] initWithData:(NSData *)object];
  }
  
  if ([classType isSubclassOfClass:[NSDate class]] == YES)
  {
    return [[NSDate alloc] initWithTimeIntervalSince1970:[(NSDate *)object timeIntervalSince1970]];
  }
  
  if ([classType isSubclassOfClass:[NSNull class]] == YES)
  {
    return [[NSNull alloc] init];
  }
  
  return nil;
}

+ (Class)standardContainerType:(Class)classType
{
  if (classType == nil)
  {
    return nil;
  }
  
  if ([classType isSubclassOfClass:[NSMutableArray class]] == YES)
  {
    return [NSMutableArray class];
  }
  
  if ([classType isSubclassOfClass:[NSArray class]] == YES)
  {
    return [NSArray class];
  }
  
  if ([classType isSubclassOfClass:[NSMutableDictionary class]] == YES)
  {
    return [NSMutableDictionary class];
  }
  
  if ([classType isSubclassOfClass:[NSDictionary class]] == YES)
  {
    return [NSDictionary class];
  }
  
  return nil;
}


// 是否是容器类型－－数组、字典
+ (BOOL)isContainerType:(Class)classType
{
  if ([QRCTDataStruct standardContainerType:classType])
  {
    return YES;
  }
  
  return NO;
}

+ (Class)standardCustomType:(Class)classType
{
  if (classType  == nil)
  {
    return nil;
  }
  
  if ([QRCTDataStruct isBaseDataType:classType] == YES)
  {
    return nil;
  }
  
  if ([QRCTDataStruct isContainerType:classType] == YES)
  {
    return nil;
  }
  
  if ([classType isSubclassOfClass:[NSObject class]])
  {
    return [NSObject class];
  }
  
  return nil;
}

// 是否是容器类型－－数组、字典
+ (BOOL)isCustomType:(Class)classType
{
  if ([QRCTDataStruct standardCustomType:classType] != nil)
  {
    return YES;
  }
  
  return NO;
}

- (void)setAppVID:(NSString *)appVID
{
  _appVID = appVID;
}

- (void)setClassType:(NSString *)classType
{
  _classType = classType;
}

- (void)setStructVersion:(NSString *)structVersion
{
  _structVersion = structVersion;
}

- (void)setDataVersion:(NSString *)dataVersion
{
  _dataVersion = dataVersion;
}

// 获取数据结构和数据的二进制数据
- (NSData *)data
{
  return _data;
}

// 获取对象存储的值，返回的是一个字段，注意数组也会转成NSDictionary
- (NSDictionary *)dataVaule
{
  return _dataValue;
}

// 根据数据结构信息和数据创建对象
- (id)objectWithDataStruct
{
  if (_classType == nil || _structInfo == nil || _dataValue == nil)
  {
    return nil;
  }
  
  NSDictionary *rootStructInfo = [_structInfo objectForKey:kDataStructRootKey];
  id rootDataValue = [_dataValue objectForKey:kDataStructRootKey];
  
  return [self objectWithStructInfo:rootStructInfo DataValue:rootDataValue];
  
  
  return nil;
}

- (id)objectWithStructInfo:(NSDictionary *)dictionaryStructInfo
                 DataValue:(id)dataValue
{
  NSString *realClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructRealTypeKey];
  
  if (realClassTypeStr == nil)
  {
    return nil;
  }
  
  Class realClassType = NSClassFromString(realClassTypeStr);
  if (realClassType == nil)
  {
    return nil;
  }
  
  if ([QRCTDataStruct isBaseDataType:realClassType] == YES)
  {
    return [self baseObjectWithStructInfo:dictionaryStructInfo
                                DataValue:dataValue];
  }
  
  
  if ([QRCTDataStruct isContainerType:realClassType] == YES)
  {
    return [self containerObjectWithStructInfo:dictionaryStructInfo
                                     DataValue:dataValue];
  }
  
  if ([QRCTDataStruct isCustomType:realClassType] == YES)
  {
    return [self customObjectWithStructInfo:dictionaryStructInfo
                                  DataValue:dataValue];
  }
  
  return nil;
  
}

- (id)baseObjectWithStructInfo:(NSDictionary *)dictionaryStructInfo
                     DataValue:(id)dataValue
{
  if (dictionaryStructInfo == nil || dataValue  == nil)
  {
    return nil;
  }
  
  NSString *realClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructRealTypeKey];
  NSString *standardClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructStandardTypeKey];
  
  if (realClassTypeStr == nil)
  {
    return nil;
  }
  
  Class realClassType = NSClassFromString(realClassTypeStr);
  Class standardClassType = NSClassFromString(standardClassTypeStr);
  if (realClassType == nil || standardClassType == nil)
  {
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSMutableString class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSString class]] == YES
        && [[standardClassType class] isSubclassOfClass:[NSString class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSMutableString class])] == NO)
      {
        return [[NSMutableString alloc] initWithString:(NSString *)dataValue];
      }
      
      return [[realClassType alloc] initWithString:(NSString *)dataValue];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSString class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSString class]] == YES
        && [[standardClassType class] isSubclassOfClass:[NSString class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSString class])] == NO)
      {
        return [[NSString alloc] initWithString:(NSString *)dataValue];
      }
      
      return [(NSString *)[realClassType alloc] initWithString:(NSString *)dataValue];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSNumber class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSNumber class]] == YES
        && [[standardClassType class] isSubclassOfClass:[NSNumber class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSNumber class])] == NO)
      {
        return [[[NSNumberFormatter alloc] init] numberFromString:[dataValue stringValue]];
      }
      
      return [[[NSNumberFormatter alloc] init] numberFromString:[dataValue stringValue]];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSMutableData class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSData class]] == YES
        && [[standardClassType class] isSubclassOfClass:[NSData class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSMutableData class])] == NO)
      {
        return [[NSMutableData alloc] initWithData:(NSData *)dataValue];
      }
      
      return [(NSMutableData *)[realClassType alloc] initWithData:(NSData *)dataValue];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSData class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSData class]]
        && [[standardClassType class] isSubclassOfClass:[NSData class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSData class])] == NO)
      {
        return [[NSData alloc] initWithData:(NSData *)dataValue];
      }
      
      return [(NSData *)[NSData alloc] initWithData:(NSData *)dataValue];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSDate class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSDate class]]
        && [[standardClassType class] isSubclassOfClass:[NSDate class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSDate class])] == NO)
      {
        return [[NSDate alloc] initWithTimeIntervalSince1970:[(NSDate *)dataValue timeIntervalSince1970]];
      }
      
      return [(NSDate *)[realClassType alloc] initWithTimeIntervalSince1970:[(NSDate *)dataValue timeIntervalSince1970]];
    }
    
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSNull class]] == YES)
  {
    if ([[dataValue class] isSubclassOfClass:[NSNull class]]
        && [[standardClassType class] isSubclassOfClass:[NSNull class]] == YES)
    {
      if ([dataValue isKindOfClass:realClassType] == YES)
      {
        return dataValue;
      }
      
      if ([realClassTypeStr isEqualToString:NSStringFromClass([NSNull class])] == NO)
      {
        return [[NSNull alloc] init];
      }
      
      return [[realClassType alloc] init];
    }
    
    return nil;
  }
  
  return nil;
}

- (id)containerObjectWithStructInfo:(NSDictionary *)dictionaryStructInfo DataValue:(NSDictionary *)dataValue
{
  if (dictionaryStructInfo == nil || dataValue  == nil)
  {
    return nil;
  }
  
  NSString *realClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructRealTypeKey];
  NSString *standardClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructStandardTypeKey];
  
  if (realClassTypeStr == nil || standardClassTypeStr == nil)
  {
    return nil;
  }
  
  Class realClassType = NSClassFromString(realClassTypeStr);
  Class standardClassType = NSClassFromString(standardClassTypeStr);
  if (realClassType == nil || standardClassType == nil)
  {
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSMutableArray class]] == YES)
  {
    if ([[standardClassType class] isSubclassOfClass:[NSDictionary class]] == NO)
    {
      return nil;
    }
    
    NSMutableArray *arrayObject = [[NSMutableArray alloc] init];
    
    NSArray *arrayKey = [dataValue allKeys];
    
    for (NSInteger i = 0; i < [arrayKey count]; ++i)
    {
      NSString *key = [[NSString alloc] initWithFormat:@"%ld", (long)i];
      
      NSDictionary *structInfo = [dictionaryStructInfo objectForKey:key];
      id value = [dataValue objectForKey:key];
      
      if (structInfo != nil && value != nil)
      {
        id object = [self objectWithStructInfo:structInfo DataValue:value];
        
        if (object != nil)
        {
          [arrayObject addObject:object];
        }
        else
        {
          return nil;
        }
      }
      else
      {
        return nil;
      }
      
    }
    
    if ([arrayObject isKindOfClass:realClassType] == YES)
    {
      return arrayObject;
    }
    
    if ([realClassTypeStr isEqualToString:NSStringFromClass([NSMutableArray class])] == NO)
    {
      return arrayObject;
    }
    
    return [(NSMutableArray *)[realClassType alloc] initWithArray:arrayObject];
  }
  
  if ([realClassType isSubclassOfClass:[NSArray class]] == YES)
  {
    if ([[standardClassType class] isSubclassOfClass:[NSDictionary class]] == NO)
    {
      return nil;
    }
    
    NSMutableArray *arrayObject = [[NSMutableArray alloc] init];
    
    NSArray *arrayKey = [dataValue allKeys];
    
    for (NSInteger i = 0; i < [arrayKey count]; ++i)
    {
      NSString *key = [[NSString alloc] initWithFormat:@"%ld", (long)i];
      
      NSDictionary *structInfo = [dictionaryStructInfo objectForKey:key];
      id value = [dataValue objectForKey:key];
      
      if (structInfo != nil && value != nil)
      {
        id object = [self objectWithStructInfo:structInfo DataValue:value];
        
        if (object != nil)
        {
          [arrayObject addObject:object];
        }
        else
        {
          return nil;
        }
      }
      else
      {
        return nil;
      }
      
    }
    
    if ([arrayObject isKindOfClass:realClassType] == YES)
    {
      return arrayObject;
    }
    
    if ([realClassTypeStr isEqualToString:NSStringFromClass([NSArray class])] == NO)
    {
      return arrayObject;
    }
    
    return [(NSArray *)[realClassType alloc] initWithArray:arrayObject];
  }
  
  if ([realClassType isSubclassOfClass:[NSMutableDictionary class]] == YES)
  {
    if ([[standardClassType class] isSubclassOfClass:[NSDictionary class]] == NO)
    {
      return nil;
    }
    
    NSMutableDictionary *dictionaryObject = [[NSMutableDictionary alloc] init];
    
    NSArray *arrayKey = [dataValue allKeys];
    
    for (id key in arrayKey)
    {
      NSDictionary *structInfo = [dictionaryStructInfo objectForKey:key];
      id value = [dataValue objectForKey:key];
      
      if (structInfo != nil && value != nil)
      {
        id object = [self objectWithStructInfo:structInfo DataValue:value];
        
        if (object != nil)
        {
          [dictionaryObject setObject:object forKey:key];
        }
        else
        {
          return nil;
        }
      }
      else
      {
        return nil;
      }
      
    }
    
    if ([dictionaryObject isKindOfClass:realClassType] == YES)
    {
      return dictionaryObject;
    }
    
    if ([realClassTypeStr isEqualToString:NSStringFromClass([NSMutableDictionary class])] == NO)
    {
      return dictionaryObject;
    }
    
    return [(NSMutableDictionary *)[realClassType alloc] initWithDictionary:dictionaryObject];
  }
  
  if ([realClassType isSubclassOfClass:[NSDictionary class]] == YES)
  {
    if ([[standardClassType class] isSubclassOfClass:[NSDictionary class]] == NO)
    {
      return nil;
    }
    
    NSMutableDictionary *dictionaryObject = [[NSMutableDictionary alloc] init];
    
    NSArray *arrayKey = [dataValue allKeys];
    
    for (id key in arrayKey)
    {
      NSDictionary *structInfo = [dictionaryStructInfo objectForKey:key];
      id value = [dataValue objectForKey:key];
      
      if (structInfo != nil && value != nil)
      {
        id object = [self objectWithStructInfo:structInfo DataValue:value];
        
        if (object != nil)
        {
          [dictionaryObject setObject:object forKey:key];
        }
        else
        {
          return nil;
        }
      }
      else
      {
        return nil;
      }
      
    }
    
    if ([dictionaryObject isKindOfClass:realClassType] == YES)
    {
      return dictionaryObject;
    }
    
    if ([realClassTypeStr isEqualToString:NSStringFromClass([NSDictionary class])] == NO)
    {
      return dictionaryObject;
    }
    
    return [(NSDictionary *)[realClassType alloc] initWithDictionary:dictionaryObject];
  }
  
  return nil;
}

- (id)customObjectWithStructInfo:(NSDictionary *)dictionaryStructInfo DataValue:(NSDictionary *)dataValue
{
  if (dictionaryStructInfo == nil || dataValue  == nil)
  {
    return nil;
  }
  
  NSString *realClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructRealTypeKey];
  NSString *standardClassTypeStr = [dictionaryStructInfo objectForKey:kDataStructStandardTypeKey];
  
  if (realClassTypeStr == nil || standardClassTypeStr == nil)
  {
    return nil;
  }
  
  Class realClassType = NSClassFromString(realClassTypeStr);
  Class standardClassType = NSClassFromString(standardClassTypeStr);
  if (realClassType == nil || standardClassType == nil)
  {
    return nil;
  }
  
  if ([realClassType isSubclassOfClass:[NSObject class]] == YES)
  {
    if ([[standardClassType class] isSubclassOfClass:[NSObject class]] == NO)
    {
      return nil;
    }
    
    BOOL result = YES;
    
    id object = [[realClassType alloc] init];
    NSArray *arrayKey = [dataValue allKeys];
    
    for (id key in arrayKey)
    {
      if ([key isKindOfClass:[NSString class]] == NO)
      {
        result = NO;
        break;
      }
      
      BOOL parserResult = NO;
      
      NSString *propertyName = (NSString *)key;
      objc_property_t property = class_getProperty(realClassType, [propertyName UTF8String]);
      
      if (property != NULL)
      {
        NSString *propertyAttributes = [[NSString alloc] initWithCString:property_getAttributes(property) encoding:NSUTF8StringEncoding];
        
        if ([propertyAttributes hasPrefix:@"T@"] == YES)
        {
          Ivar iVar = class_getInstanceVariable(realClassType, [propertyName UTF8String]);
          
          if(iVar == nil)
          {
            // 采用另外一种方法尝试获取
            iVar = class_getInstanceVariable(realClassType, [[NSString stringWithFormat:@"_%@", propertyName] UTF8String]);
          }
          
          if (iVar != nil)
          {
            // 获取存储的属性名对应的对象
            NSDictionary *propertyStructInfo = [dictionaryStructInfo objectForKey:propertyName];
            id propertyDataValue = [dataValue objectForKey:propertyName];
            
            id strorageValue = [self objectWithStructInfo:propertyStructInfo DataValue:propertyDataValue];
            
            if (strorageValue != nil)
            {
              // 获取属性的对象
              char *pPropertyType = property_copyAttributeValue(property, "T");
              NSString *propertyTypeStr = [[NSString alloc] initWithUTF8String:pPropertyType];
              free(pPropertyType);
              propertyTypeStr = [propertyTypeStr stringByReplacingOccurrencesOfString:@"@" withString:@""];
              propertyTypeStr = [propertyTypeStr stringByReplacingOccurrencesOfString:@"\"" withString:@""];
              
              if ([NSStringFromClass([strorageValue class]) isEqualToString:propertyTypeStr] == YES)
              {
                object_setIvar(object, iVar, strorageValue);
                parserResult = YES;
              }
              else if ([propertyTypeStr isEqualToString:@""] == YES)
              {
                NSString *idRealClassTypeStr = [propertyStructInfo objectForKey:kDataStructRealTypeKey];
                
                id compatibleValue = [self compatiblePropertyForClassType:NSClassFromString(idRealClassTypeStr) WithStrorageObject:strorageValue];
                
                if (compatibleValue != nil)
                {
                  object_setIvar(object, iVar, compatibleValue);
                  parserResult = YES;
                }
              }
              else
              {
                Class propertyType = NSClassFromString(propertyTypeStr);
                
                if (propertyType != nil)
                {
                  id compatibleValue = [self compatiblePropertyForClassType:propertyType WithStrorageObject:strorageValue];
                  
                  if (compatibleValue != nil)
                  {
                    object_setIvar(object, iVar, compatibleValue);
                    parserResult = YES;
                  }
                }
              }
              
            }
            
          }
          
        }
        
        if (parserResult == NO)
        {
          result = NO;
          break;
        }
      }
    }
    
    if (result == YES)
    {
      return object;
    }
    
    return nil;
  }
  
  return nil;
}

- (id)compatiblePropertyForClassType:(Class)classType WithStrorageObject:(id)strorageObject
{
  if (classType == nil || strorageObject == nil)
  {
    return nil;
  }
  
  if ([QRCTDataStruct isBaseDataType:classType] == YES)
  {
    if ([QRCTDataStruct isBaseDataType:[strorageObject class]] == YES)
    {
      if ([classType isSubclassOfClass:[NSString class]] == YES && [[strorageObject class] isSubclassOfClass:[NSString class]] == YES)
      {
        if ([strorageObject isKindOfClass:classType])
        {
          return strorageObject;
        }
        
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSString class])] == NO)
        {
          return [(NSString *)[NSMutableString alloc] initWithString:(NSString *)strorageObject];
        }
        else
        {
          return [(NSString *)[classType alloc] initWithString:(NSString *)strorageObject];
        }
      }
      
      if ([classType isSubclassOfClass:[NSNumber class]] == YES && [[strorageObject class] isSubclassOfClass:[NSValue class]] == YES)
      {
        if ([strorageObject isKindOfClass:classType])
        {
          return strorageObject;
        }
        
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSNumber class])] == NO)
        {
          return [[[NSNumberFormatter alloc] init] numberFromString:[strorageObject stringValue]];
        }
        
        NSString *numType = [[NSString alloc] initWithUTF8String:[strorageObject objCType]];
        
        if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithChar:'a'] objCType]]] == YES)
        {
          return [((NSNumber *)[classType alloc]) initWithChar:[(NSNumber *)strorageObject charValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedChar:'a'] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedChar:[(NSNumber *)strorageObject unsignedCharValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithShort:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithShort:[(NSNumber *)strorageObject shortValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedShort:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedShort:[(NSNumber *)strorageObject unsignedShortValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithInt:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithInt:[(NSNumber *)strorageObject intValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedInt:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedInt:[(NSNumber *)strorageObject unsignedIntValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithLong:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithLong:[(NSNumber *)strorageObject longValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedLong:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedLong:[(NSNumber *)strorageObject unsignedLongValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithLongLong:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithLongLong:[(NSNumber *)strorageObject longLongValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedLongLong:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedLongLong:[(NSNumber *)strorageObject unsignedLongLongValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithFloat:1.5] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithFloat:[(NSNumber *)strorageObject floatValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithDouble:1.5] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithDouble:[(NSNumber *)strorageObject doubleValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithBool:true] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithBool:[(NSNumber *)strorageObject boolValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithInteger:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithInteger:[(NSNumber *)strorageObject integerValue]];
        }
        else if ([numType isEqualToString:[[NSString alloc] initWithUTF8String:[[NSNumber numberWithUnsignedInteger:1] objCType]]] == YES)
        {
          return [(NSNumber *)[classType alloc] initWithUnsignedInteger:[(NSNumber *)strorageObject unsignedIntegerValue]];
        }
      }
      
      if ([classType isSubclassOfClass:[NSData class]] == YES && [[strorageObject class] isSubclassOfClass:[NSData class]] == YES)
      {
        if ([strorageObject isKindOfClass:classType])
        {
          return strorageObject;
        }
        
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSData class])] == NO)
        {
          return [[NSMutableData alloc] initWithData:(NSData *)strorageObject];
        }
        
        return [(NSData *)[classType alloc] initWithData:(NSData *)strorageObject];
      }
      
      if ([classType isSubclassOfClass:[NSDate class]] == YES && [[strorageObject class] isSubclassOfClass:[NSDate class]] == YES)
      {
        if ([strorageObject isKindOfClass:classType])
        {
          return strorageObject;
        }
        
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSDate class])] == NO)
        {
          return [[NSDate alloc] initWithTimeIntervalSince1970:[(NSDate *)strorageObject timeIntervalSince1970]];
        }
        
        return [(NSDate *)[classType alloc] initWithTimeIntervalSince1970:[(NSDate *)strorageObject timeIntervalSince1970]];
      }
      
      if ([classType isSubclassOfClass:[NSNull class]] == YES && [[strorageObject class] isSubclassOfClass:[NSNull class]] == YES)
      {
        return [[classType alloc] init];
      }
    }
    
    return nil;
  }
  
  if ([QRCTDataStruct isContainerType:classType] == YES)
  {
    if ([QRCTDataStruct isContainerType:[strorageObject class]] == YES)
    {
      if ([strorageObject isKindOfClass:classType])
      {
        return strorageObject;
      }
      
      if ([classType isSubclassOfClass:[NSArray class]] == YES && [[strorageObject class] isSubclassOfClass:[NSArray class]] == YES)
      {
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSArray class])] == NO)
        {
          return [[NSMutableArray alloc] initWithArray:(NSArray *)strorageObject];
        }
        
        return [(NSArray *)[classType alloc] initWithArray:(NSArray *)strorageObject];
      }
      
      if ([classType isSubclassOfClass:[NSDictionary class]] == YES && [[strorageObject class] isSubclassOfClass:[NSDictionary class]] == YES)
      {
        if ([NSStringFromClass(classType) isEqualToString:NSStringFromClass([NSDictionary class])] == NO)
        {
          return [[NSMutableDictionary alloc] initWithDictionary:(NSDictionary *)strorageObject];
        }
        
        return [(NSDictionary *)[classType alloc] initWithDictionary:(NSDictionary *)strorageObject];
      }
    }
    
    return nil;
  }
  
  if ([QRCTDataStruct isCustomType:classType] == YES)
  {
    return nil;
  }
  
  return nil;
}

@end
