//
//  NSString+QRCTImage.m
//  RCTImage
//
//  Created by yangxue on 16/4/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "NSString+QRCTImage.h"

@implementation NSString (QRCTImage)

// 十六进制转换为普通字符串的
- (NSString *)stringFromHexString:(NSString *)hexString
{
  char *myBuffer = (char *)malloc((int)[hexString length] / 2 + 1);
  bzero(myBuffer, [hexString length] / 2 + 1);
  
  for (int i = 0; i < [hexString length] - 1; i += 2)
  {
    unsigned int anInt;
    NSString * hexCharStr = [hexString substringWithRange:NSMakeRange(i, 2)];
    NSScanner * scanner = [[NSScanner alloc] initWithString:hexCharStr];
    [scanner scanHexInt:&anInt];
    myBuffer[i / 2] = (char)anInt;
  }
  
  NSString *utf8String = [[NSString alloc] initWithCString:myBuffer encoding:NSUTF8StringEncoding];
  free(myBuffer);
  
  return utf8String;
}

//普通字符串转换为十六进制的
- (NSString *)hexStringFromString:(NSString *)string
{
  NSData *myD = [string dataUsingEncoding:NSUTF8StringEncoding];
  Byte *bytes = (Byte *)[myD bytes];
  
  //下面是Byte 转换为16进制。
  NSMutableString *hexStr = [[NSMutableString alloc] initWithString:@""];
  for(int i=0;i<[myD length];i++)
  {
    ///16进制数
    NSString *newHexStr = [NSString stringWithFormat:@"%X",bytes[i]&0xff];
    
    if([newHexStr length]==1)
    {
      
      [hexStr appendFormat:@"0%@", newHexStr];
    }
    else
    {
      [hexStr appendFormat:@"%@", newHexStr];
    }
  }
  
  return hexStr;
}

@end
