//
//  Created by doujingxuan on 2/15/16.
//  Copyright (c) 2016 Qunar. All rights reserved.
//

#import <UIKit/UIKit.h>
@class RCTEventDispatcher;

@interface QRCTMultiPicker : UIPickerView

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

@property (nonatomic, copy) NSArray *selectedIndexes;
@property (nonatomic, copy) NSArray *componentData;

@end
