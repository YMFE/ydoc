/**
 * Created by ywz on 16/1/8.
 * @providesModule QCameraView
 * @flow
 */

'use strict';


var React = require('react-native');
var requireNativeComponent = React.requireNativeComponent;
var RCTUIManager = React.NativeModules.UIManager;//require('NativeModules').UIManager;
var QCameraManager = React.NativeModules.QRCTCameraViewManager;//require('NativeModules').QRCTCameraViewManager;
var View = React.View;

var PropTypes = React.PropTypes;

var Q_CAMERAVIEW_REF = 'QCameraView';

var CameraView = React.createClass({
    propTypes: {
        cameraStart: PropTypes.bool.isRequired,
        cameraFlash: PropTypes.oneOf(['on', 'off', 'auto']).isRequired,
        cameraPosition: PropTypes.oneOf(['rear', 'front']).isRequired,
        onError: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            cameraStart: true,
            cameraFlash: 'off',
            cameraPosition: 'front'
        }
    },
    getInitialState(){
        return {}
    },
    render(){
        return (
            <QRCTCameraView
                ref={Q_CAMERAVIEW_REF}
                {...this.props}
            />
        )
    },
    focus(x, y){
        QCameraManager.focusCamera(this.getQCameraViewHandle(), x, y);
    },
    takePhoto(callBackSuccess, callBackFail){
        QCameraManager.takePhoto(this.getQCameraViewHandle(), callBackSuccess, callBackFail);
    },
    getQCameraViewHandle(){
        return React.findNodeHandle(this.refs[Q_CAMERAVIEW_REF])
    }
})

var QRCTCameraView = requireNativeComponent('QRCTCameraView', CameraView)
// requireNativeComponent automatically resolves this to "RCTMapManager"
module.exports = CameraView;