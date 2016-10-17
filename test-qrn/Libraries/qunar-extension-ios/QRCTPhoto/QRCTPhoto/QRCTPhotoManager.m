//
//  QRCTPhoto.m
//  QRCTPhoto
//
//  Created by yingdong.guo on 2015/12/03.
//  Copyright © 2015年 qunar.com. All rights reserved.
//

#import <AssetsLibrary/AssetsLibrary.h>
#import <Photos/Photos.h>
#import <CoreLocation/CoreLocation.h>

#import "RCTBridge.h"
#import "RCTImageStoreManager.h"
#import "RCTUtils.h"

#import "QRCTPhotoManager.h"

extern NSMutableDictionary *g_QRCTPhotoCache;

@interface QRCTPhotoManager () <UINavigationControllerDelegate, UIImagePickerControllerDelegate>

@property (nonatomic, strong) ALAssetsLibrary *assetLibrary;
// 目前没有实现js和native对象的对应关系，RCTImageStore又不支持删除，通过这个索引使得相册封面图可以在ImageStore中仅保存一份。
// TODO 用对象对应来实现，让封面图可以在每次调用时更新
@property (nonatomic, strong) NSMutableDictionary <NSString *, NSString *> *imageStoreIds; // <assetURL, imageTag>

@property (nonatomic, strong) UIImagePickerController *imagePicker;
@property (nonatomic, assign) BOOL imagePickerAlreadyShown;
@property (nonatomic, copy) RCTResponseSenderBlock imagePickerCallback;
@property (nonatomic, copy) RCTResponseErrorBlock imagePickerErrorCallback;

@end

@implementation QRCTPhotoManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _assetLibrary = [ALAssetsLibrary new];
        _imageStoreIds = [NSMutableDictionary new];
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            g_QRCTPhotoCache = [NSMutableDictionary dictionary];
        });
    }
    return self;
}

#pragma mark - React Export Method

RCT_EXPORT_METHOD(getPhotoGroups:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseErrorBlock)errorCallback)
{
    NSString *permissionErrorMessage = [NSString stringWithFormat:@"请在iPhone的“设置-隐私-照片”选项中，允许%@访问你的相册。",
                                        [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"] ?:
                                        [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"]];
    
    __weak typeof(self) weakSelf = self;
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        [self requestAlbumPermissionWithPH:^{
            [weakSelf getPhotoGroupsWithPH:callback errorCallback:errorCallback];
        } error:^{
            errorCallback(QJSResponseError(QRCTErrorCodeLibraryPermission, permissionErrorMessage));
        }];
    }
    else {
        [self requestAlbumPermissionWithAL:^{
            [weakSelf getPhotoGroupsWithAL:callback errorCallback:errorCallback];
        } error:^{
            errorCallback(QJSResponseError(QRCTErrorCodeLibraryPermission, permissionErrorMessage));
        }];
    }
}


RCT_EXPORT_METHOD(getPhotosFromGroup:(NSString *)groupId
                  options:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback
                  errorCallback:(RCTResponseErrorBlock)errorCallback)
{
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        [self getPhotosFromGroupWithPH:groupId options:options callback:callback errorCallback:errorCallback];
        return;
    }
    
    // do as what original CameraRoll API does
    NSUInteger first = [options[@"first"] integerValue];
    NSString *afterCursor = options[@"after"];
//    NSString *assetType = options[@"assetType"];
    NSString *assetType  = @"Photos";
    NSString *groupQuery = [NSURL URLWithString:groupId].query;
    NSString *groupHash = [groupQuery componentsSeparatedByString:@"&"].firstObject;
    
    __block ALAssetsGroup *selectedGroup = nil;
    BOOL __block calledCallback = NO;
    
    // 找到groupID对应的组
    [_assetLibrary enumerateGroupsWithTypes:ALAssetsGroupAll usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
        if (!group) {
            if (!selectedGroup) {
                errorCallback(QJSResponseError(QRCTErrorCodeLibraryOperate, @"Group ID 参数错误"));
                return;
            }
            
            if (assetType == nil || [assetType isEqualToString:@"Photos"]) {
                [selectedGroup setAssetsFilter:ALAssetsFilter.allPhotos];
            } else if ([assetType isEqualToString:@"Videos"]) {
                [selectedGroup setAssetsFilter:ALAssetsFilter.allVideos];
            } else if ([assetType isEqualToString:@"All"]) {
                [selectedGroup setAssetsFilter:ALAssetsFilter.allAssets];
            }
            
            BOOL __block foundAfter = NO;
            BOOL __block hasNextPage = NO;
            NSMutableArray *assets = [NSMutableArray new];
            // 从group中枚举图片
            [selectedGroup enumerateAssetsWithOptions:NSEnumerationReverse usingBlock:^(ALAsset *result, NSUInteger index, BOOL *stop) {
                if (!result) {
                    if (!calledCallback) {
                        [self callCallback:callback withAssets:assets hasNextPage:NO];
                    }
                    return;
                }
                NSString *uri = ((NSURL *)[result valueForProperty:ALAssetPropertyAssetURL]).absoluteString;
                if (afterCursor && !foundAfter) {
                    if ([afterCursor isEqualToString:uri]) {
                        foundAfter = YES;
                    }
                    return; // Skip until we get to the first one
                }
                if (first == assets.count) {
                    *stop = YES;
                    hasNextPage = YES;
                    RCTAssert(calledCallback == NO, @"Called the callback before we finished processing the results.");
                    [self callCallback:callback withAssets:assets hasNextPage:hasNextPage];
                    calledCallback = YES;
                    return;
                }
                CGSize dimensions = [result defaultRepresentation].dimensions;
                CLLocation *loc = [result valueForProperty:ALAssetPropertyLocation];
                NSDate *date = [result valueForProperty:ALAssetPropertyDate];
                [assets addObject:@{
                                    @"node": @{
                                            @"type": [result valueForProperty:ALAssetPropertyType],
                                            @"group_name": [selectedGroup valueForProperty:ALAssetsGroupPropertyName],
                                            @"image": @{
                                                    @"uri": uri,
                                                    @"height": @(dimensions.height),
                                                    @"width": @(dimensions.width),
                                                    @"isStored": @YES,
                                                    },
                                            @"timestamp": @(date.timeIntervalSince1970),
                                            @"location": loc ?
                                            @{
                                                @"latitude": @(loc.coordinate.latitude),
                                                @"longitude": @(loc.coordinate.longitude),
                                                @"altitude": @(loc.altitude),
                                                @"heading": @(loc.course),
                                                @"speed": @(loc.speed),
                                                } : @{},
                                            }
                                    }];
            }];
            return;
        }
        NSString *currentGroupQuery = ((NSURL *)[group valueForProperty:ALAssetsGroupPropertyURL]).query;
        NSString *currentGroupHash = [currentGroupQuery componentsSeparatedByString:@"&"].firstObject;
        if ([currentGroupHash isEqualToString:groupHash]) {
            selectedGroup = group;
            *stop = YES;
        }
    } failureBlock:^(NSError *error) {
        errorCallback(QJSResponseError(QRCTErrorCodeLibraryOperate, @"读取相册失败"));
        calledCallback = YES;
    }];
}


RCT_EXPORT_METHOD(takePhotoAndSave:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseErrorBlock)errorCallback)
{
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        if (!granted) {
            errorCallback(QJSResponseError(QRCTErrorCodeCameraPermission, [NSString stringWithFormat:@"请在iPhone的“设置-隐私-相机”选项中，允许%@访问你的相机。",
                                               [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"] ?:
                                               [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"]]));
            return;
        }
        if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
            errorCallback(QJSResponseError(QRCTErrorCodePhotoDevice, @"当前设备不支持拍照"));
            return;
        }
        
        [self requestAlbumPermission:^{
            [self p_takePhotoAndSave:callback errorCallback:errorCallback];
        } error:^{
            errorCallback(QJSResponseError(QRCTErrorCodeLibraryPermission, [NSString stringWithFormat:@"请在iPhone的“设置-隐私-照片”选项中，允许%@访问你的相册。",
                                               [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"] ?:
                                               [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"]]));
        }];
    }];
}

RCT_EXPORT_METHOD(savePhotoToLibrary:(NSString *)imageURI successCallBack:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback)
{

    if(![imageURI hasPrefix:@"rct-image-store://"]){
        errorCallback(QJSResponseFail(QRCTErrorCodePhotoURI,@"该URI不是位于内存中"));
        return;
    }
        
    [self requestAlbumPermission:^{
        
        if (!_bridge.imageStoreManager) {
            errorCallback(QJSResponseFail(QRCTErrorCodeStoreManager, @"存储失败"));
            return;
        }
        [_bridge.imageStoreManager getImageDataForTag:imageURI withBlock:^(NSData *imageData) {
            if (imageData) {
                UIImage *image = [UIImage imageWithData:imageData];
                [self saveImage:image metadata:nil completion:^(NSString *savedImageURI, NSError *error) {
                    if (savedImageURI) {
                        callback(@[savedImageURI]);
                    }else{
                        errorCallback(QJSResponseFail(QRCTErrorCodePhotoSave, @"图片存储失败"));
                    }
                }];
            }else{
                errorCallback(QJSResponseFail(QRCTErrorCodePhotoURI,@"图片不存在,可能已经被删除"));
            }
            
        }];
        
    } error:^{
        errorCallback(QJSResponseFail(QRCTErrorCodeLibraryPermission,@"无相册权限"));
    }];
}

RCT_EXPORT_METHOD(deletePhotoInMemory:(NSString *)imageURI successCallBack:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    if(![imageURI hasPrefix:@"rct-image-store://"]){
        errorCallback(QJSResponseFail(QRCTErrorCodePhotoURI,@"该URI不是位于内存中"));
        return;
    }
    
    if (!_bridge.imageStoreManager) {
        errorCallback(QJSResponseFail(QRCTErrorCodeStoreManager, @"删除失败"));
        return;
    }
    
    
    [_bridge.imageStoreManager getImageDataForTag:imageURI withBlock:^(NSData *imageData) {
        
        if (!imageData) {
            
            errorCallback(QJSResponseFail(QRCTErrorCodePhotoURI,@"该URI不存在"));
        
        }else{
            
            [_bridge.imageStoreManager removeImageForTag:imageURI withBlock:^{
                callback(@[]);
            }];
        }
        
    }];

}

#pragma mark - classFun
- (void)requestAlbumPermissionWithPH:(void (^)())onSuccess error:(void(^)())onError {
    PHAuthorizationStatus authorizationStatus = [PHPhotoLibrary authorizationStatus];
    if (authorizationStatus == PHAuthorizationStatusAuthorized) {
        onSuccess();
    }
    else if (authorizationStatus == PHAuthorizationStatusDenied || authorizationStatus == PHAuthorizationStatusRestricted) {
        onError();
    }
    else { // not determined
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            switch (status) {
                case PHAuthorizationStatusAuthorized:
                    onSuccess();
                    break;
                case PHAuthorizationStatusDenied:
                case PHAuthorizationStatusRestricted:
                default:
                    onError();
                    break;
            }
        }];
    }
}

- (void)requestAlbumPermissionWithAL:(void (^)())onSuccess error:(void (^)())onError {
    ALAuthorizationStatus authorizationStatus = [ALAssetsLibrary authorizationStatus];
    if (authorizationStatus == ALAuthorizationStatusAuthorized) {
        onSuccess();
    }
    else if (authorizationStatus == ALAuthorizationStatusDenied || authorizationStatus == ALAuthorizationStatusRestricted) {
        onError();
    }
    else { // not determined
        [_assetLibrary enumerateGroupsWithTypes:ALAssetsGroupAlbum usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
            onSuccess();
            *stop = YES;
        } failureBlock:^(NSError *error) {
            onError();
        }];
    }
}

- (void)requestAlbumPermission:(void (^)())onSuccess error:(void (^)())onError {
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        [self requestAlbumPermissionWithPH:onSuccess error:onError];
    }
    else {
        [self requestAlbumPermissionWithAL:onSuccess error:onError];
    }
}

- (void)getPhotoGroupsWithPH:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseErrorBlock)errorCallback {
    PHFetchResult<PHAssetCollection *> *assetCollection = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAny options:nil];

    if (!assetCollection) {
        errorCallback(QJSResponseError(QRCTErrorCodeLibraryOperate,@"读取相册失败"));
        return;
    }

    NSMutableArray *groupInfos = [NSMutableArray new];
    [assetCollection enumerateObjectsUsingBlock:^(PHAssetCollection * _Nonnull group, NSUInteger idx, BOOL * _Nonnull stop) {
        NSString *groupName = [group localizedTitle];
        NSString *groupId = [group localIdentifier];

        PHFetchOptions *fetchOptions = [PHFetchOptions new];
        fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
        fetchOptions.predicate = [NSPredicate predicateWithFormat:@"(mediaType == %d)", PHAssetMediaTypeImage];
        PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:group options:fetchOptions];
        
        PHAsset *firstAsset = assets.firstObject;
        NSUInteger groupPhotoCount = assets.count;
        
        NSMutableDictionary *groupInfo = [NSMutableDictionary dictionaryWithDictionary:@{@"id": groupId, @"name": groupName, @"count": @(groupPhotoCount)}];
        if (firstAsset) {
            NSString *coverImageUri = [NSString stringWithFormat:@"ph://%@", firstAsset.localIdentifier];
            [g_QRCTPhotoCache setObject:firstAsset forKey:coverImageUri];
            [groupInfo setObject:coverImageUri forKey:@"coverImage"];
        }

        [groupInfos addObject:groupInfo];
    }];
    
    assetCollection = nil;
    assetCollection = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
    
    if (assetCollection) {
        [assetCollection enumerateObjectsUsingBlock:^(PHAssetCollection * _Nonnull group, NSUInteger idx, BOOL * _Nonnull stop) {
            NSString *groupName = [group localizedTitle];
            NSString *groupId = [group localIdentifier];

            PHFetchOptions *fetchOptions = [PHFetchOptions new];
            fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
            fetchOptions.predicate = [NSPredicate predicateWithFormat:@"(mediaType == %d)", PHAssetMediaTypeImage];
            PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:group options:fetchOptions];
            
            PHAsset *firstAsset = assets.firstObject;
            NSUInteger groupPhotoCount = assets.count;
            
            NSMutableDictionary *groupInfo = [NSMutableDictionary dictionaryWithDictionary:@{@"id": groupId, @"name": groupName, @"count": @(groupPhotoCount)}];
            if (firstAsset) {
                NSString *coverImageUri = [NSString stringWithFormat:@"ph://%@", firstAsset.localIdentifier];
                [g_QRCTPhotoCache setObject:firstAsset forKey:coverImageUri];
                [groupInfo setObject:coverImageUri forKey:@"coverImage"];
            }
            
            [groupInfos addObject:groupInfo];
        }];
    }

    callback(@[groupInfos]);
}



- (void)getPhotoGroupsWithAL:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseErrorBlock)errorCallback {
    __block BOOL failureFlag = NO;

    NSMutableArray *groupInfos = [NSMutableArray new];
    __weak typeof(self) weakSelf = self;

    [_assetLibrary enumerateGroupsWithTypes:ALAssetsGroupAll usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
        if (!group) {
            callback(@[groupInfos]);
            return;
        }
        [group setAssetsFilter:ALAssetsFilter.allPhotos];
        NSString *groupName = [group valueForProperty:ALAssetsGroupPropertyName];
        NSString *groupURL = ((NSURL *)[group valueForProperty:ALAssetsGroupPropertyURL]).absoluteString;
        NSInteger groupPhotoCount = [group numberOfAssets];

        __block NSString *imageStoreURL = [_imageStoreIds objectForKey:groupURL];
        if (!imageStoreURL) {
            // 保存封面图到image store

            UIImage *posterImage = [UIImage imageWithCGImage:[group posterImage]];
            // TODO use newest image store api
            dispatch_sync(dispatch_get_main_queue(), ^(){
                imageStoreURL = [_bridge.imageStoreManager storeImage:posterImage];
                [weakSelf.imageStoreIds setObject:imageStoreURL forKey:groupURL];
            });
        }

        [groupInfos addObject:@{@"id": groupURL, @"name": groupName, @"count": @(groupPhotoCount), @"coverImage": imageStoreURL}];
    } failureBlock:^(NSError *error) {
        errorCallback(QJSResponseError(QRCTErrorCodeLibraryOperate, @"读取相册失败"));
        failureFlag = YES;
    }];
}

- (void)getPhotosFromGroupWithPH:(NSString *)groupId
                         options:(NSDictionary *)options
                        callback:(RCTResponseSenderBlock)callback
                   errorCallback:(RCTResponseErrorBlock)errorCallback {
    // do as what original CameraRoll API does
    NSUInteger first = [options[@"first"] integerValue];
    NSString *afterCursor = options[@"after"];
    //NSString *assetType = options[@"assetType"];
    if ([afterCursor hasPrefix:@"ph://"]) {
      afterCursor = [afterCursor substringFromIndex:5];
    }

    PHFetchResult<PHAssetCollection *> *assetCollections = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[groupId] options:nil];
    if (!assetCollections || assetCollections.count <= 0) {
        errorCallback(QJSResponseError(QRCTErrorCodeLibraryOperate, @"读取相册失败"));
        return;
    }

    PHAssetCollection *assetCollection = [assetCollections firstObject];

    PHFetchOptions *fetchOptions = [PHFetchOptions new];
    fetchOptions.predicate = [NSPredicate predicateWithFormat:@"(mediaType == %d)", PHAssetMediaTypeImage];
    fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:YES]];
    PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:assetCollection options:fetchOptions];

    __block BOOL foundAfter = NO;
    __block BOOL hasNextPage = NO;
    __block BOOL calledCallback = NO;
    NSMutableArray *resultAssets = [NSMutableArray array];//WithCapacity:first];
    [assets enumerateObjectsUsingBlock:^(PHAsset * _Nonnull asset, NSUInteger idx, BOOL * _Nonnull stop) {
        if (afterCursor && !foundAfter) {
            if ([asset.localIdentifier isEqualToString:afterCursor]) {
                foundAfter = YES;
            }
            return;
        }

        if (first == resultAssets.count) {
            *stop = YES;
            hasNextPage = YES;
            [self callCallback:callback withAssets:resultAssets hasNextPage:hasNextPage];
            calledCallback = YES;
            return;
        }

        //CGSize dimensions = [result defaultRepresentation].dimensions;
        CLLocation *loc = asset.location;
        NSDate *date = asset.modificationDate;
        NSString *assetURI = [NSString stringWithFormat:@"ph://%@", asset.localIdentifier];
        [resultAssets addObject:@{
                                  @"node": @{
                                          //@"type": [result valueForProperty:ALAssetPropertyType],
                                          @"group_name": assetCollection.localizedTitle,
                                          @"image": @{
                                                  @"uri": assetURI,
                                                  @"height": @(asset.pixelHeight),
                                                  @"width": @(asset.pixelWidth),
                                                  @"isStored": @YES,
                                                  },
                                          @"timestamp": @(date.timeIntervalSince1970),
                                          @"location": loc ?
                                          @{
                                              @"latitude": @(loc.coordinate.latitude),
                                              @"longitude": @(loc.coordinate.longitude),
                                              @"altitude": @(loc.altitude),
                                              @"heading": @(loc.course),
                                              @"speed": @(loc.speed),
                                              } : @{},
                                          }
                                  }];

        [g_QRCTPhotoCache setObject:asset forKey:assetURI];
    }];

    if (!calledCallback) {
        [self callCallback:callback withAssets:resultAssets hasNextPage:NO];
    }
}


- (void)callCallback:(RCTResponseSenderBlock)callback withAssets:(NSArray *)assets hasNextPage:(BOOL)hasNextPage
{
    if (!assets.count) {
        callback(@[@{
                       @"edges": assets,
                       @"page_info": @{
                               @"has_next_page": @NO}
                       }]);
        return;
    }
    callback(@[@{
                   @"edges": assets,
                   @"page_info": @{
                           @"start_cursor": assets[0][@"node"][@"image"][@"uri"],
                           @"end_cursor": assets[assets.count - 1][@"node"][@"image"][@"uri"],
                           @"has_next_page": @(hasNextPage)}
                   }]);
}

- (void)saveImage:(UIImage *)image metadata:(NSDictionary *)imageMetadata completion:(void (^)(NSString *, NSError *))completion {
    if ([[[UIDevice currentDevice] systemVersion] floatValue] < 8.0) {
        // use AssetsLibrary
        [_assetLibrary writeImageToSavedPhotosAlbum:image.CGImage
                                           metadata:imageMetadata
                                    completionBlock:^(NSURL *assetURL, NSError *error) {
                                        completion(assetURL.absoluteString, error);
                                    }];
    }
    else {
        // use Photos
        __block NSString *localId;
        [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
            PHAssetChangeRequest *creationRequest = [PHAssetChangeRequest creationRequestForAssetFromImage:image];
            PHObjectPlaceholder *placeHolder = [creationRequest placeholderForCreatedAsset];
            localId = placeHolder.localIdentifier;
            
        } completionHandler:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                completion([NSString stringWithFormat:@"ph://%@", localId], nil);
            }
            else {
                completion(nil, error);
            }
        }];
        
    }
}

#pragma mark -

- (void)p_takePhotoAndSave:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseErrorBlock)errorCallback {
    _imagePicker = [UIImagePickerController new];
    _imagePicker.delegate = self;
    _imagePicker.sourceType = UIImagePickerControllerSourceTypeCamera;
    _imagePickerCallback = callback;
    _imagePickerErrorCallback = errorCallback;

    UIWindow *keyWindow = RCTSharedApplication().keyWindow;
    UIViewController *rootViewController = keyWindow.rootViewController;

    _imagePickerAlreadyShown = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        [rootViewController presentViewController:_imagePicker animated:YES completion:nil];
    });
}

#pragma mark - UIImagePickerController callback

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
    UIWindow *keyWindow = RCTSharedApplication().keyWindow;
    UIViewController *rootViewController = keyWindow.rootViewController;
    [rootViewController dismissViewControllerAnimated:YES completion:^(){
        _imagePickerAlreadyShown = NO;
    }];
    
    UIImage *image = info[UIImagePickerControllerOriginalImage];
    NSDictionary *imageMetadata = info[UIImagePickerControllerMediaMetadata];
    [self saveImage:image metadata:imageMetadata completion:^(NSString *imageUri, NSError *error) {
        if (error) {
            _imagePickerErrorCallback(QJSResponseError(QRCTErrorCodePhotoSave, @"保存图片到相册失败"));
            _imagePickerErrorCallback = nil;
            return;
        }
        
        _imagePickerCallback(@[@{@"uri":imageUri, @"width":@(image.size.width), @"height":@(image.size.height)}]);
        _imagePickerCallback = nil;
        _imagePickerErrorCallback = nil;
        _imagePicker = nil;
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [_imagePicker dismissViewControllerAnimated:YES completion:^{
        if (_imagePickerCallback) {
            _imagePickerCallback(@[]);
        }
        _imagePickerCallback = nil;
        _imagePickerErrorCallback = nil;
        _imagePicker = nil;
    }];
}

@end
