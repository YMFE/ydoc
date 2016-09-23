<!-- TODO: 原生定位API -->

## Geolocation

> API兼容性：  
> RN 原生 0.20  
> QRN v1.0.0-RC  
> iOS: 80011115  
> android: 60001130

`Geolocation`模块提供了定位功能，包括单次定位和持续定位。

## 引入

``` js
import Geolocation from 'Geolocation';
```

## 数据结构

``` js
RCTLocationOptions = {
  timeout: number,     // 定位超时时间(ms)
  maximumAge: number,  // 定位数据有效时间(ms)
  enableHighAccuracy: bool // 是否允许高精度定位
}
```

## API

<blockquote class="api">
<strong>Geolocation.getCurrentPosition</strong>
<span>( onSuccess: function, onError: function, options: RCTLocationOptions )</span>
</blockquote>

进行单次定位，结果由回调提供。

<blockquote class="api">
<strong>Geolocation.watchPosition</strong>
<span>( onSuccess: function, onError: function, options: RCTLocationOptions )</span>
</blockquote>

开启持续定位，结果会多次通过`onSuccess`回调。

返回watchID用于关闭持续定位。

<blockquote class="api">
<strong>Geolocation.clearWatch</strong>
<span>( watchID: number)</span>
</blockquote>

停止持续定位。

## 示例

``` js
'use strict';

import React, {
    Component,
    StyleSheet,
    Text,
    View,
} from 'qunar-react-native';

import Geolocation from 'Geolocation';

class GeolocationExample extends Component {
    constructor(props) {
        super(props);
        this.watchID = null;
        this.state = {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
        };
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            (error) => console.log(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        this.watchID = Geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({lastPosition});
        });
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }

    render() {
        return (
            <View>
                <Text>
                    <Text style={styles.title}>Initial position: </Text>
                    {this.state.initialPosition}
                </Text>
                <Text>
                    <Text style={styles.title}>Current position: </Text>
                    {this.state.lastPosition}
                </Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    title: {
        fontWeight: '500',
    },
});
```
