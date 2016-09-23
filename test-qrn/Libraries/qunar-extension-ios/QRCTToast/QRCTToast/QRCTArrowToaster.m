//
//  ArrowToaster.m
//  QunariPhone
//
//  Created by HeYichen on 14-2-13.
//  Copyright (c) 2014年 Qunar.com. All rights reserved.
//

#import "QRCTArrowToaster.h"


// ==================================================================
// 布局参数
// ==================================================================
// 间距
#define kToasterParentHMargin						16
#define kToasterParentVMargin						20
#define kToasterSelfHMargin							20
#define kToasterSelfVMargin							6

#define kToasterArrowWidth                          12
#define kToasterArrowHeight                         6

// 字体
#define kToasterTextLabelFont						[UIFont systemFontOfSize:14]

#define kToasterBGCamelImageFile                @"ToasterBGCamel.png"
#define kToasterBGCamelWithArrowDownImageFile   @"ToasterBGCamelWithArrowDown.png"

@interface QRCTArrowToaster ()

@property (nonatomic, strong) UIImageView *imageViewBG;
@property (nonatomic, strong) UILabel *labelText;
@property (nonatomic, assign) NSInteger minWidth;
@property (nonatomic, assign) CGSize selfSize;
@property (nonatomic, assign) NSTimeInterval timeInterval;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) UIEdgeInsets edgeInsets;
@property (nonatomic, strong) UIImageView *imageViewArrow;
// 布局
- (void)reLayout;

// timer
- (void)timerBack:(id)sender;

@end

// ==================================================================
// 实现
// ==================================================================
@implementation QRCTArrowToaster

- (instancetype)initWithMinWidth:(NSInteger)minWidthInit andText:(NSString *)text dismissAfterTime:(NSTimeInterval)timeIntervalInit
{
	if(text != nil)
	{
		if((self = [super initWithFrame:CGRectZero]) != nil)
		{
			// BG
			_imageViewBG = [[UIImageView alloc] initWithFrame:CGRectZero];
			[_imageViewBG setImage:[[UIImage imageNamed:kToasterBGCamelImageFile] stretchableImageWithLeftCapWidth:7 topCapHeight:7]];
			[self addSubview:_imageViewBG];
			
            // arrow
            _imageViewArrow = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, kToasterArrowWidth, kToasterArrowHeight)];
			[_imageViewArrow setImage:[[UIImage imageNamed:kToasterBGCamelWithArrowDownImageFile] stretchableImageWithLeftCapWidth:7 topCapHeight:7]];
			[self addSubview:_imageViewArrow];
            
			// Label
			_labelText = [[UILabel alloc] init];
			[_labelText setTextColor:[UIColor whiteColor]];
			[_labelText setNumberOfLines:0];
			[_labelText setLineBreakMode:NSLineBreakByWordWrapping];
      [_labelText setFont:kToasterTextLabelFont];
      [_labelText setText:text];
			[self addSubview:_labelText];
			
			// 属性
			_minWidth = minWidthInit;
			_timeInterval = timeIntervalInit;
			_edgeInsets = UIEdgeInsetsMake(kToasterSelfVMargin, kToasterSelfHMargin, kToasterSelfVMargin, kToasterSelfHMargin);
			
      
			// 刷新
			[self reLayout];
      [self.layer setBorderColor:[UIColor clearColor].CGColor];
      [self.layer setCornerRadius:3.0f];
			return self;
		}
	}
	
	return nil;
}

+ (void)toasterShowWithMinWidth:(NSInteger)minWidthInit andText:(NSString *)text dismissAfterTime:(NSTimeInterval)timeIntervalInit
{
	QRCTArrowToaster *toaster = [[QRCTArrowToaster alloc] initWithMinWidth:minWidthInit andText:text dismissAfterTime:timeIntervalInit];
	CGSize toasterSize = [toaster getToasterSize];
	CGRect frame = [[[[UIApplication sharedApplication] delegate] window] frame];
	[toaster setFrame:CGRectMake((NSInteger)(frame.size.width - toasterSize.width) / 2,
								 (NSInteger)(frame.size.height - toasterSize.height)/2,
								 toasterSize.width,
								 toasterSize.height)];
	[toaster showInView:[UIApplication sharedApplication].keyWindow];
}

// 获取Size
- (CGSize)getToasterSize
{
	return _selfSize;
}

// 使用默认位置显示Toaster
- (void)showToasterWithPosition:(ArrowToasterPosition)position
{
	CGRect appFrame = [[[[UIApplication sharedApplication] delegate] window] frame];
	if (position == eArrowToasterPositionTop)
	{
		[self setViewY:100];
	}
	else if (position == eArrowToasterPositionBottom)
	{
		[self setViewY:appFrame.size.height - 64 - _selfSize.height];
	}
	
	[self setViewX:(appFrame.size.width - _selfSize.width)/2];
}

// 设置Frame
- (void)setFrame:(CGRect)frameNew
{
	[super setFrame:CGRectMake(frameNew.origin.x, frameNew.origin.y, _selfSize.width, _selfSize.height)];
}

// 设置文本
- (void)setText:(NSString *)textNew
{
	if(_labelText != nil)
	{
		[_labelText setText:textNew];
		
		// 刷新
		[self reLayout];
	}
}

- (void)setTextAlignment:(NSTextAlignment)textAlignment
{
	[_labelText setTextAlignment:textAlignment];
}

// 设置背景图片
- (void)setBackgroundImage:(UIImage *)imgNew
{
	if(imgNew != nil)
	{
		[_imageViewBG setImage:imgNew];
		
		// 刷新
		[self reLayout];
	}
}

// 设置edgeInsets
- (void)setEdgeInsets:(UIEdgeInsets)edgeInsets
{
	_edgeInsets = edgeInsets;
	
	// 刷新
	[self reLayout];
}

// 显示
- (void)showInView:(UIView *)viewParent
{
	[viewParent addSubview:self];
	
	// 创建定时器
	if(_timeInterval != 0)
	{
		_timer = [NSTimer scheduledTimerWithTimeInterval:_timeInterval
												  target:self
												selector:@selector(timerBack:)
												userInfo:nil
												 repeats:NO];
	}
}

// 布局
- (void)reLayout
{
	CGSize maxSize = [[UIScreen mainScreen] bounds].size;
	CGSize textSize = CGSizeZero;
	
	// Label
	if(_labelText != nil)
	{
		// 计算字符串的尺寸
		NSString *text = [_labelText text];
		if(text != nil)
		{
			NSInteger textMaxWidth = maxSize.width - 2 * kToasterParentHMargin - (_edgeInsets.left + _edgeInsets.right);
			NSInteger textMaxHeight = maxSize.height - 2 * kToasterParentVMargin - (_edgeInsets.top + _edgeInsets.bottom);
			UIFont *textFont = [_labelText font];
      NSDictionary *dictionaryAttributes = @{NSFontAttributeName:textFont};
      CGRect stringRect = [text boundingRectWithSize:CGSizeMake(textMaxWidth, textMaxHeight)
                                             options:NSStringDrawingUsesLineFragmentOrigin
                                          attributes:dictionaryAttributes
                                             context:nil];
      
      textSize = CGSizeMake(ceil(stringRect.size.width), ceil(stringRect.size.height));
		}
	}
	
	// self
	NSInteger selfWidth = textSize.width + (_edgeInsets.left + _edgeInsets.right);
	if(selfWidth < _minWidth)
	{
		selfWidth = _minWidth;
	}
	
	_selfSize = CGSizeMake(selfWidth, textSize.height + (_edgeInsets.top + _edgeInsets.bottom));
	[self setFrame:CGRectMake(0, 0, _selfSize.width, _selfSize.height)];
	
	// Label
	if(_labelText != nil)
	{
		[_labelText setFrame:CGRectMake((NSInteger)(_selfSize.width - textSize.width) / 2,
                                        _edgeInsets.top, textSize.width, textSize.height)];
	}
	
	// BG
	if(_imageViewBG != nil)
	{
		[_imageViewBG setFrame:CGRectMake(0, 0, _selfSize.width, _selfSize.height)];
	}
    
    // arrow
    if (_imageViewArrow != nil)
    {
        CGRect viewFrame = [_imageViewArrow frame];
        viewFrame.origin.y = _selfSize.height;
        [_imageViewArrow setFrame:viewFrame];
        [_imageViewArrow setCenter:CGPointMake(_imageViewBG.center.x, _imageViewArrow.center.y)];
    }
}

// timer
- (void)timerBack:(id)sender
{
	CGFloat alpha = self.alpha;
	
	[UIView animateWithDuration:0.33
					 animations:^{
						 [self setAlpha:0.0f];
					 } completion:^(BOOL finished) {
						 [self removeFromSuperview];
						 [self setAlpha:alpha];
					 }];
}

// 销毁的时候，需要干掉定时器
- (void)dealloc
{
	if(_timer != nil)
	{
		if([_timer isValid])
		{
			[_timer invalidate];
		}
	}
}


// 设置UIView的X
- (void)setViewX:(CGFloat)newX
{
  CGRect viewFrame = [self frame];
  viewFrame.origin.x = newX;
  [self setFrame:viewFrame];
}

// 设置UIView的Y
- (void)setViewY:(CGFloat)newY
{
  CGRect viewFrame = [self frame];
  viewFrame.origin.y = newY;
  [self setFrame:viewFrame];
}

@end
