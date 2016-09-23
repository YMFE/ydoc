## MapUtils  地图坐标转换和路径规划的API

> API兼容性：   
> QRN:v1.0.0   
> iOS:80011117   
> Android:60001134    

`MapUtils`可以进行地图坐标的转换，路径规划等，使用方法如下:

```js
import {MapUtils} from 'qunar-react-native';

//坐标
var coord = {
	latitude:39.983667;    //纬度
	longitude:116.312638;  //经度
}

/* 
 * 转换坐标
 *
 * srcType是转换前坐标类型, desType是需要转换的坐标类型,
 * 支持的有：
 * 'WGS84'  //GPS定位坐标
 * 'GCJ02'  //火星坐标
 * 'BD09'   //百度坐标
 */
var srcType = 'WGS84';
var desType = 'BD09';
var newCoord = MapUtils.translate(coord, srcType, desType);//转换GPS坐标到百度坐标


/*
 * 返回该坐标(GPS坐标系)的地理信息
 */
MapUtils.getLocation(coord,(placeName)=>{
	//获取成功，placeName为地理信息
},err=>{
	//获取失败
})


/**
 * 跳转到系统地图进行导航
 *
 * 目前只处理两个position的情况,第一个是出发地，第二个为目的地
 * 字典结构为(其中坐标为GPS坐标)
 * {
 *  title:'***',
 *  latitude:'*****',
 *  longitude:'*****',
 *  isCurrentLocation:true,
 *  }
 * routeType只能为 'walking'、'automobile'或者'any'
 */
MapUtils.goNavigation([startPosition,endPosition],routeType);


/* 路径规划，计算出路径
 * 根据路径设置MapView的overlays属性即可在MapView上显示导航路径，具体可以参看MapView的overlays属性说明
 * routeType只能为 'walking'、'automobile'或者'any'
 */
MapUtils.calculateRoute(startCoord, endCoord, routeType, coordinates=>{
	//路径规划成功,coordinates为路径的点集,可直接作为MapVie的overlays属性中的coordinates
},err=>{
	//路径规划失败
})
```

