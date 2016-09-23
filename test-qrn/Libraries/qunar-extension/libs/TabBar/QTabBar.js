/**
 * @providesModule QTabBar
 * @flow
 */

'use strict'

import React, {Component, StyleSheet, View} from 'react-native'
import TabBarItem from 'QTabBarItem'

/**
 * 标签栏
 *
 * @component TabBar
 * @example ./Playground/js/Examples/TabBarExample.js[1-100]
 * @version >=v1.0.0
 * @description 渲染一个底部的标签栏
 *
 * ![TabBar](./images/component-TabBar.png)
 */
class TabBar extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        const {barTintColor, tintColor, translucent, style, children} = this.props
        const barStyle = {
                backgroundColor: barTintColor,
                opacity: translucent ? 0.7 : 1,
            }

        return (
            <View style={[styles.container]}>
                {children.map((item, i) =>
                    item.props.selected ? item.props.children : null
                )}
                <View style={[styles.tabBar, style, barStyle]}>
                    {children.map((item, i) =>
                        React.cloneElement(item, {
                            tintColor: tintColor,
                		})
                    )}
                </View>
            </View>
        )
    }
}

TabBar.defaultProps = {
    barTintColor: '#fff',
    tintColor: '#00afc7',
    translucent: false,
}

TabBar.propTypes = {
    /**
     * @property barTintColor
	 * @type string
	 * @description 标签栏的背景颜色。
     */
    barTintColor: React.PropTypes.string,

    /**
     * @property tintColor
	 * @type string
	 * @description 当前被选中的标签图标的颜色。
     */
    tintColor: React.PropTypes.string,

    /**
     * @property translucent
	 * @type bool
	 * @description 标签栏是否需要半透明化。
     */
    translucent:  React.PropTypes.bool,

    /**
     * @property style
	 * @type View.propTypes.style
	 * @description 标签栏样式。
     */
    style: View.propTypes.style,
}

TabBar.item = TabBarItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        position:'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

module.exports = TabBar
