//
//  RCTIconFontManager.h
//  RCTOnlineFont
//
//  Created by yangxue on 16/3/2.
//  Copyright © 2016年 Qunar. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTBridge.h"

@interface RCTIconFontManager : NSObject <RCTBridgeModule>

- (BOOL)fontHasLoadedForFamily:(NSString *)fontFamily;
- (void)requestFontFamilyToLoad:(NSString *)fontFamily forTag:(NSNumber *)reactTag;

@end

@interface RCTBridge (RCTIconFontManager)

@property (nonatomic, readonly) RCTIconFontManager *iconFontManager;

@end
