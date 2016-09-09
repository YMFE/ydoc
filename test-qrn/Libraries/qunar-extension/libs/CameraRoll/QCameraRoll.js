/**
 * @providesModule QCameraRoll
 */

'use strict';

var QRCTPhotoManager = require('NativeModules').QRCTPhotoManager;

class QCameraRoll {
    /*
       enumerate photo groups

       @param callback: (groups: Array<QPhotoGroup>) => void
       @param errorCallback: (nativeError) =>  void

       type QPhotoGroup {
         id: string,
         name: string,
         count: number,
         coverImage: string
       }
     */
    static getPhotoGroups(callback,
                          errorCallback)
    {
        QRCTPhotoManager.getPhotoGroups(callback, errorCallback);
    }

    /*
       enumerate photos from group [groupId]

       @param groupId: string
         QPhotoGroup.id from `getPhotoGroups` callback
       @param options: object
         same as options from react native module `CameraRoll`
       @param callback: (photoData: QPhotoData) => void
       @param errorCallback: (nativeError) => void

       type QPhotoData {
         edges: [
           {
             node: {
               type: string,
               group_name: string,
               image: {
                 uri: string,
                 height: number,
                 width: number,
                 isStored: bool
               },
               timestamp: number,
               location: {
                 latitude: number,
                 longitude: number,
                 altitude: number,
                 heading: number,
                 speed: number
               }
             }
           },
           ...
         ]
         page_info: {
           has_next_page: bool,
           start_cursor: string,
           end_cursor: string
         }
       }
     */
    static getPhotosFromGroup(groupId,
                              options,
                              callback,
                              errorCallback)
    {
        QRCTPhotoManager.getPhotosFromGroup(groupId, options, callback, errorCallback);
    }

    /*
       open camera and save the photo taken to camera roll, callback with image uri

       @param callback: (QTakePhotoData) => void
       @param errorCallback: (nativeError) => void
       
       type QTakePhotoData {
         uri: string,
         height: number,
         width:number
       }
     */
    static takePhotoAndSave(callback, errorCallback)
    {
        QRCTPhotoManager.takePhotoAndSave(callback, errorCallback);
    }


    /*
     save the photo taken by QCameraView to camera roll
     @param photoUri: string
        the photoUri get from QCameraView, it's stored in Memory. It has prefix 'rct-image-store://'
     @param callback: (photoSavedUri) => void
     @param errorCallback: (nativeError) => void

     */
    static savePhoto(photoUri,callback,errorCallback)
    {
        QRCTPhotoManager.savePhotoToLibrary(photoUri,callback,errorCallback);
    }

    /*
     delete the photo taken by QCameraView
     @param photoUri: string
     the photoUri get from QCameraView, it's stored in Memory. It has prefix 'rct-image-store://'
     @param callback: () => void
     @param errorCallback: (nativeError) => void

     */
    static deletePhotoInMemory(photoUri,callback,errorCallback)
    {
        QRCTPhotoManager.deletePhotoInMemory(photoUri,callback,errorCallback);
    }

}

module.exports = QCameraRoll;
