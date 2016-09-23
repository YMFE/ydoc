//
//  RCTScrollableShadowView.m
//  QRCTCustomScrollView
//
//  Created by jingxuan.dou on 16/3/24.
//  Copyright © 2016年 jingxuan.dou. All rights reserved.
//

#import "RCTScrollableShadowView.h"
#import "RCTScrollableView.h"

@implementation RCTScrollableShadowView

- (NSDictionary<NSString *, id> *)processUpdatedProperties:(NSMutableSet<RCTApplierBlock> *)applierBlocks
                                          parentProperties:(NSDictionary<NSString *, id> *)parentProperties
{
    parentProperties = [super processUpdatedProperties:applierBlocks
                                      parentProperties:parentProperties];
    
     [applierBlocks addObject:^(NSDictionary<NSNumber *, RCTScrollableView *> *viewRegistry) {
        RCTScrollableView *view = viewRegistry[self.reactTag];
         [view scrollToX:self.scrollPosition.x y:self.scrollPosition.y];
    }];
    
    return parentProperties;
}
-(void)setScrollPosition:(CGPoint)scrollPosition
{
    _scrollPosition = scrollPosition;
    [self dirtyPropagation];
}
@end
