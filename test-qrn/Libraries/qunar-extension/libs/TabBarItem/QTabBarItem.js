/**
 * @providesModule QTabBarItem
 * @flow
 */

'use strict'

import React, {Component, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native'

const DEFAULT_ICON_TINT_COLOR = '#929292'
const DEFAULT_BADGE_SIZE = 16

/**
 * 单个标签项
 *
 * @component TabBarItem
 * @example ./Playground/js/Examples/TabBarExample.js[1-100]
 * @version >=v1.0.0
 */
class TabBarItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            badgeVisible: false,
            tabItemWidth: 0,
        }
    }

    render() {
        const {icon, iconStyle, titleStyle, badgeStyle, style, title, tintColor, selected, onPress, badge, renderIcon} = this.props
        const {tabItemWidth, badgeVisible} = this.state

        const
            selectedIconStyle = {
                tintColor: selected ? tintColor : (iconStyle.color ? iconStyle.color : DEFAULT_ICON_TINT_COLOR)
            },
            selectedTextStyle = {
                color: selected ? tintColor : (titleStyle.color ? titleStyle.color : DEFAULT_ICON_TINT_COLOR)
            },
            badgePosition = {
                left: tabItemWidth / 2 + 1,
            },
            customIcon = renderIcon ? renderIcon() : null

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.item, style]}
                onPress={() => onPress ? onPress() : null}
                onLayout={(event) => this.initLayout(event)}
            >
                {
                    customIcon
                    ? React.cloneElement(customIcon, {
                        style: {
                            ...customIcon.props.style,
                            ...iconStyle,
                            color: selected ? tintColor : (iconStyle.color ? iconStyle.color : DEFAULT_ICON_TINT_COLOR),
                        }
                    })
                    : <Image style={[styles.itemIcon, iconStyle, selectedIconStyle]} source={icon} />
                }
                <Text style={[styles.itemText, titleStyle, selectedTextStyle]}>{title}</Text>
                { badge && badgeVisible ?
                    <View style={[styles.itemBadge, badgePosition, badgeStyle]}>
                        <Text style={styles.itemBadgeText}>{badge}</Text>
                    </View>
                : null }
            </TouchableOpacity>
        )
    }

    initLayout(e) {
        if(!this.state.badgeVisible){
            this.setState({
                badgeVisible: true,
                tabItemWidth: e.nativeEvent.layout.width
            })
        }
    }
}

TabBarItem.defaultProps = {
}

TabBarItem.propTypes = {
    /**
     * @property badge
	 * @type String|Number
	 * @description 在图标右上角显示一个红色的气泡。
     */
    badge: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),

    /**
     * @property badgeStyle
     * @type View.propTypes.style
     * @description 在图标右上角气泡样式。
     */
    badgeStyle: View.propTypes.style,

    /**
     * @property icon
     * @type Image.propTypes.source
     * @description 给当前标签指定一个自定义的图标。
     */
    icon: Image.propTypes.source,

    /**
     * @property renderIcon
     * @type function
     * @description () => renderable
     *
     * 自己渲染一个icon，而不用默认图片icon，配置此函数时props.icon不生效。
     */
    renderIcon:  React.PropTypes.func,

    /**
     * @property onPress
     * @type function
     * @description 当此标签被选中时调用。你应该修改组件的状态来使得selected={true}。
     */
    onPress:  React.PropTypes.func,

    /**
     * @property selected
     * @type bool
     * @description 这个属性决定了子视图是否可见，如果你看到一个空白的页面，很可能是没有选中任何一个标签。
     */
    selected:  React.PropTypes.bool,

    /**
     * @property style
     * @type View.propTypes.style
     * @description 此标签元素样式。
     */
    style: View.propTypes.style,

    /**
     * @property iconStyle
     * @type Text.propTypes.style
     * @description 标签icon样式。
     */
    iconStyle: Text.propTypes.style,

    /**
     * @property titleStyle
     * @type Text.propTypes.style
     * @description 标签标题样式。
     */
    titleStyle: Text.propTypes.style,

    /**
     * @property title
     * @type string
     * @description 在图标下面显示的标题文字。
     */
    title:  React.PropTypes.string,
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        tintColor: DEFAULT_ICON_TINT_COLOR,
    },
    itemText: {
        fontSize: 10,
        textAlign: 'center',
        color: DEFAULT_ICON_TINT_COLOR,
    },
    itemBadge: {
        position:'absolute',
        top: 1,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        paddingRight: 4,
        // minWidth: DEFAULT_BADGE_SIZE,
        height: DEFAULT_BADGE_SIZE,
        backgroundColor: '#f00',
        borderRadius: DEFAULT_BADGE_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    itemBadgeText: {
        fontSize: 12,
        color: '#fff',
    }
})

module.exports = TabBarItem
