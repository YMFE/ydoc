//
//  NSString+QRCTImage.h
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (QRCTImage)

// 十六进制转换为普通字符串的。
- (NSString *)stringFromHexString:(NSString *)hexString;

//普通字符串转换为十六进制的
- (NSString *)hexStringFromString:(NSString *)string;

@end
