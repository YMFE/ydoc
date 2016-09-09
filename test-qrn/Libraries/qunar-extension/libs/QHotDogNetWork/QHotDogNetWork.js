/**
 *
 * @providesModule RCTHotDogNetworkTask
 */

'use strict';

var QHotDogNetWorkModule = require('NativeModules').QWSearchNetworkTask;
if (!QHotDogNetWorkModule) {
	if (__DEV__) {
		throw '此模块需要Qunar大客户端的网络请求模块';
	}
}

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var uniqueId = 1;

const HOTDOG_CALLBACK_NAME = 'RNHotDogCallBack';

const SUCCESS_KEY = 'success';
const FAILED__KEY = 'fail';
const CACHE__KEY = 'cache';
const TYPE_KEY = 'type';
const CANCEL_KEY = 'cancel';
const PARAM_ERROR_CODE = 10004;

const CALLBACKID_KEY = 'callBackID';
const RESPONSRE_KEY = 'response';




const SERVICETYPE_PARAMETER = 'serviceType';
const URL_PARAMETER = 'url';
const PARAM_PARAMETER = 'param';
const USERCACHE_PARAMETER = 'useCache';
const CACHEKEY_PARAMETER = 'cacheKey';
const SUCCESSCALLBACK_PARAMETER = 'successCallback';
const FAILCALLBACK_PARAMETER = 'failCallback';
const CACHECALLBACK_PARAMETER = 'cacheCallback';

var requestMap = {};

var QHotDogNetWork = {
	postRequest:function(parameter):string {

	if (!parameter) {
		if (__DEV__) {
			throw("请求参数不能为空")
		}
		return;
	}

	var serviceType,url,param,useCache,cacheKey,successCallback,failCallback,cacheCallback;

	serviceType = parameter[SERVICETYPE_PARAMETER];
	url = parameter[URL_PARAMETER];
	var tmpParam = parameter[PARAM_PARAMETER];
	if (Object.prototype.toString.call(tmpParam).toLowerCase() === '[object object]') {
			param = JSON.stringify(tmpParam);
	}

	useCache = !!parameter[USERCACHE_PARAMETER];
	cacheKey = parameter[CACHEKEY_PARAMETER];
	successCallback = parameter[SUCCESSCALLBACK_PARAMETER];
	failCallback = parameter[FAILCALLBACK_PARAMETER];
	cacheCallback = parameter[CACHECALLBACK_PARAMETER];

		if (!url && !serviceType) {
			if (__DEV__) {
				throw("serviceType和url不能同时为空")
			}
			var errorMap = {};
		 errorMap["errorCode"] = PARAM_ERROR_CODE
		 errorMap["reason"] = "serviceType和url不能同时为空"
				failCallback(errorMap);
			 return;
		}

		if (useCache == true) {
			 if (!cacheKey) {
 				if (__DEV__) {
 					throw("如果useCache为YES，则cacheKey不能为空")
 				}
				var errorMap = {};
			 errorMap["errorCode"] = PARAM_ERROR_CODE
			 errorMap["reason"] = "如果useCache为YES，则cacheKey不能为空"
			 		failCallback(errorMap);
					return;
			 }
		}

		var callbackId = this.addHotDogObserver(successCallback,failCallback,cacheCallback);
		this.addListenerCallBack(callbackId);

		QHotDogNetWorkModule.postRequest(serviceType,url,param,useCache,cacheKey,callbackId);
		return callbackId;
	},
	cancelNetWorkTask:function (requestID) {
		QHotDogNetWorkModule.cancelNetworkTask(requestID);
	},
	addHotDogObserver:function(success: Function, fail:Function,cache:Function):string {
		var callbackId = 'cb_' + (uniqueId++) + '_' + (Math.random() + '').replace( /\D/g, "");
		var functionMap = {};
		functionMap[SUCCESS_KEY] = success;
		functionMap[FAILED__KEY] = fail;
		functionMap[CACHE__KEY] = cache;

	  requestMap[callbackId] = functionMap;

		return callbackId;
	},
	removeHotDogObserver:function(callbackId){
		console.log(RCTDeviceEventEmitter.listeners(HOTDOG_CALLBACK_NAME));
		delete requestMap[callbackId]
	},
	addListenerCallBack:function(callbackId){
		///处理回调
		RCTDeviceEventEmitter.addListener(HOTDOG_CALLBACK_NAME,(dict)=>{
			var callbackIdString = dict[CALLBACKID_KEY]
			var type = dict[TYPE_KEY]
			if (callbackIdString == callbackId) {
				// console.log("移除监听者");
				var response = dict[RESPONSRE_KEY]
				var callbackFuncs = requestMap[callbackIdString];
				if (!callbackFuncs) {
					return;
				}
				switch (type) {
					case SUCCESS_KEY:
					{
							var rnHotdogSuccessCallback = callbackFuncs[SUCCESS_KEY];
							if (rnHotdogSuccessCallback) {
								rnHotdogSuccessCallback(response);
							}
							RCTDeviceEventEmitter.removeCurrentListener();
							this.removeHotDogObserver(callbackId);
					}
					break;
					case FAILED__KEY:
					{
							var rnHotdogFailCallback = callbackFuncs[FAILED__KEY];
							if (rnHotdogFailCallback) {
								rnHotdogFailCallback(response);
							}
							RCTDeviceEventEmitter.removeCurrentListener();
							this.removeHotDogObserver(callbackId);

					}
					break;
					case CANCEL_KEY:
					{
							RCTDeviceEventEmitter.removeCurrentListener();
							this.removeHotDogObserver(callbackId);
					}
						break;
					case CACHE__KEY:
						{
							var rnHotdogCacheCallback = callbackFuncs[CACHE__KEY];
							if (rnHotdogCacheCallback) {
								rnHotdogCacheCallback(response);
							}
						}
							break;
					default:

				}
			}
		})
	}
};

module.exports = QHotDogNetWork;
