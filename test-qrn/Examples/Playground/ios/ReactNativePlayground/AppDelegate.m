//
//  AppDelegate.m
//  ReactNativePlayground
//
//  Created by yingdong.guo on 2016/01/13.
//  Copyright © 2016年 qunar.com. All rights reserved.
//

#import "AppDelegate.h"
#import "RCTRootView.h"
#import "QRCTViewCreater.h"
#import "QRCTAppInfo.h"
#import "QRCTConfigManager.h"

@interface AppDelegate () <QRCTConfigManagerDelegate>

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    //设置vid和pid
    [QRCTAppInfo setVid:@"80011119" pid:@"10010"];
    [QRCTConfigManager setDelegate:self];
  
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [[UIViewController alloc] init];
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    
    [self createRCTView];
    
    return YES;
}

- (void)createRCTView
{
    __weak typeof (self) weakSelf = self;
    
    [QRCTViewCreater createViewWithHybridId:@"xiaoxiao"
                                 moduleName:@"naive"
                          initialProperties:@{
                                              @"isQRCTDefCreate":@YES
                                              }
                          completionHandler:^(RCTRootView *rootView, NSError *error) {
                              if (!rootView) {
                                  [weakSelf reloadRCTView];
                                  return ;
                              }

                              weakSelf.window.rootViewController.view = rootView;
                              rootView.frame = [UIScreen mainScreen].bounds;
                          }];
};


- (void)reloadRCTView
{
    UIView *view = [[UIView alloc] init];
    view.backgroundColor = [UIColor whiteColor];
    view.frame = [UIScreen mainScreen].bounds;
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:@"点击重新加载RCTView" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(createRCTView) forControlEvents:UIControlEventTouchUpInside];
    [button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    button.frame = [UIScreen mainScreen].bounds;
    [view addSubview:button];
    self.window.rootViewController.view = view;
}

#pragma mark - QRCTConfigManagerDelegate

- (NSURL *)bundleURL:(NSString *)hybridId{
  return [NSURL URLWithString:[NSString stringWithFormat:@"http://rn.qunar.com/packages/%1$@_ios/index.bundle?vid=%2$@&pid=%3$@&hybridid=%1$@_ios", hybridId, [QRCTAppInfo vid], [QRCTAppInfo pid]]];
}

- (NSURL *)betaBundleURL:(NSString *)hybridId branch:(NSString *)branch{

  branch = [branch stringByReplacingOccurrencesOfString:@"_" withString:@"%5F"];
  
  return [NSURL URLWithString:[NSString stringWithFormat:@"http://rn.beta.qunar.com/packages/%@_ios_beta_%@/index.bundle?vid=%@&pid=%@", hybridId, branch, [QRCTAppInfo vid], [QRCTAppInfo pid]]];
}

@end
