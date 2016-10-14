/**
 * @component Tab, TabLink
 */
import React, { Component, PropTypes } from 'react';
import '../../common/tapEventPluginInit';
import './style.scss';

const _themes = {
    iconCol: {
        iconOn: true,
        single: false,
        col: true
    },
    iconRow: {
        iconOn: true,
        single: false,
        col: false
    },
    iconSingle: {
        iconOn: true,
        single: true,
        col: false
    },
    iconNone: {
        iconOn: false,
        single: true,
        col: false
    },
};

const TabLinkDefaultProps = {
    index: '',
    theme: 'iconNone',
    part: false,
    icon: '',
    text: '',
    onTouchTap: null,
    iconExtraClass: '',
    extraClass: '',
    dataAttrs: {},
};

const TabDefaultProps = {
    theme: 'iconNone',
    part: false,
    _themes,
    extraClass: '',
};

const TabLinkPropTypes = {
    /**
     * 当前选中项
     *
     * @property index
     * @type PropTypes.oneOf(['now', ''])
     * @description TabLink属性：在需要选中的项中添加属性 index = 'now'
     * @default ''
     */
    index: PropTypes.oneOf(['now', '']),
    /**
     * 图标源
     *
     * @property icon
     * @type PropTypes.string
     * @description TabLink属性：图片地址src或iconFont编码，iconFont编码直接传unicode字符即可，如'\uF000'
     * @default ''
     */
    icon: PropTypes.string,
    /**
     * 文字
     *
     * @property text
     * @type PropTypes.string
     * @description TabLink属性：与图标搭配的文字
     * @default ''
     */
    text: PropTypes.string,
    /**
     * 禁用
     *
     * @property disabled
     * @type PropTypes.bool
     * @description TabLink属性：锁定，禁用点击切换及其事件响应
     * @default false
     */
    disabled: PropTypes.bool,
    /**
     * tap回调事件
     *
     * @property onTouchTap
     * @type function
     * @description TabLink属性：tap事件结束时时行回调的事件
     * @param {PropTypes.object} data 该Tab存储的数据
     * @param {PropTypes.object} event 点击该Tab的事件
     * @default null
     */
    onTouchTap: PropTypes.func,
    /**
     * 数据存储中心
     *
     * @property dataAttrs
     * @type PropTypes.object
     * @description TabLink属性：可以将数据存在该对象里面，然后在事件中通过第二个参数(dataAttrs)获取存储的数据
     * @default {}
     */
    dataAttrs: PropTypes.object,
    /**
     * 额外的图标类
     * @skip
     * @property iconExtraClass
     * @type PropTypes.string
     * @description Tab属性：可通过传入额外的类来支持iconfont等等
     * @default ''
     */
    iconExtraClass: PropTypes.string,
    /**
     * 额外的类
     * @skip
     * @property extraClass
     * @type PropTypes.string
     * @description Tab属性：可通过传入额外的类来调整样式
     * @default ''
     */
    extraClass: PropTypes.string,
    /**
     * 主题风格
     * @skip
     * @property theme
     * @type PropTypes.oneOf(['iconSingle', 'iconCol', 'iconRow', 'iconNone'])
     * @description Tab属性：从父组件中传入，不可覆盖。有四类风格，依次为“只有图标”、“图标文字纵向排列”、“图标文字横向排列”、“只有文字，无图标”
     * @default 'iconNone'
     */
    theme: PropTypes.oneOf(['iconSingle', 'iconCol', 'iconRow', 'iconNone']),
    /**
     * 局部展示
     * @skip
     * @property part
     * @type PropTypes.bool
     * @description Tab属性：从父组件中传入，不可覆盖，默认为全屏展示，设置为false为局部居中展示
     * @default false
     */
    part: PropTypes.bool,
    /**
     * 主题配置库
     * @skip
     * @property _themes
     * @type PropTypes.object
     * @description Tab属性：从父组件中传入，不可覆盖，主题默认样式的配置中心
     */
    _themes: PropTypes.object,
};

const TabPropTypes = {
    /**
     * 主题风格
     * @property theme
     * @type PropTypes.oneOf(['iconSingle', 'iconCol', 'iconRow', 'iconNone'])
     * @description Tab属性：有四类风格，依次为“只有图标”、“图标文字纵向排列”、“图标文字横向排列”、“只有文字，无图标”
     * @default 'iconNone'
     */
    theme: PropTypes.oneOf(['iconSingle', 'iconCol', 'iconRow', 'iconNone']),
    /**
     * 局部展示
     * @property part
     * @type PropTypes.bool
     * @description Tab属性：默认为全屏展示，设置为false为局部居中展示
     * @default false
     */
    part: PropTypes.bool,
    /**
     * 额外的图标类
     * @property iconExtraClass
     * @type PropTypes.string
     * @description Tab属性：可通过传入额外的类来支持iconfont等等
     * @default ''
     */
    iconExtraClass: PropTypes.string,
    /**
     * 额外的类
     * @property extraClass
     * @type PropTypes.string
     * @description Tab属性：可通过传入额外的类来调整样式
     * @default ''
     */
    extraClass: PropTypes.string,
    /**
     * 主题配置库
     * @skip
     * @property _themes
     * @type PropTypes.object
     * @description Tab属性：主题默认样式的配置中心，不可覆盖
     */
    _themes: PropTypes.object,
};

export class TabLink extends Component {

    _handleLiTap(evt) {
        if (this.props.disabled) {
            return;
        }
        const props = this.props,
            li = this.refs.tabLi,
            liClassList = li.classList,
            ul = li.parentNode.tagName.toLocaleUpperCase() === 'UL' ? li.parentNode : li.parentNode.parentNode;

        if (!liClassList.contains('item-on')) {
            ul.querySelector('.item-on').classList.remove('item-on');
            liClassList.add('item-on');
        }
        props.onTouchTap && props.onTouchTap(props.dataAttrs, evt);
    }

    render() {
        const props = this.props,
            iconOn = props._themes[props.theme].iconOn,
            single = props._themes[props.theme].single,
            col = props._themes[props.theme].col,
            newChild = props.children,
            liClass = !iconOn ? '' : single ? 'item-only-ico' : col ? 'item-y-ico' : 'item-x-ico';
        let defaultChild = '',
            iconTag = '';
        if (!newChild) {
            const textCol = !(iconOn && single) && !col ? props.text : '',
                textRow = !(iconOn && single) && col ? props.text : '';

            if (iconOn) {
                const regx = /^[0-9a-f]{4}$/i,
                    iconCodeStr = props.icon.charCodeAt(0).toString(16);

                iconTag = regx.test(iconCodeStr)
                    ? (<i className={`yo-ico ${props.iconExtraClass}`}>{props.icon}</i>)
                    : (<img
                        className={`yo-tab-img yo-ico ${props.iconExtraClass}`}
                        placeholder="img"
                        src={props.icon}
                        alt="icon"
                    />);
            }
            defaultChild = [textCol, iconTag, textRow];
        }

        return (
            <li
                ref="tabLi"
                onTouchTap={this._handleLiTap.bind(this)}
                className={`item ${liClass} ${props.index === 'now' ? 'item-on' : ''}`}
                data-attrs={props.dataAttrs}
            >
                {newChild || defaultChild}
            </li>
        );
    }
}

export default class Tab extends Component {
    componentDidMount() {
        const ul = this.refs.tabUl;

        if (ul.querySelector('.item-on') === null) {
            ul.querySelector('ul>*').classList.add('item-on');
        }
        if (ul.querySelector('img') !== null) {
            ul.classList.add('yo-icon-img');
        }
    }

    render() {
        const props = this.props,
            iconOn = props._themes[props.theme].iconOn,
            single = props._themes[props.theme].single,
            col = props._themes[props.theme].col,
            part = props.part,
            ulClass = part ? 'yo-tab-test' : !iconOn || single ? '' : col ? 'yo-tab-view' : 'yo-tab-filter';

        const childrenWithProps = React.Children.map(this.props.children,
            (child, index) => React.cloneElement(child, {
                theme: props.theme,
                part: props.part,
                iconExtraClass: props.iconExtraClass,
                _themes: props._themes,
                key: `link${index}`,
            })
        );

        return (
            <ul
                ref="tabUl"
                className={`yo-tab ${ulClass} ${props.extraClass}`}
            >
                {childrenWithProps}
            </ul>
        );
    }
}

Tab.defaultProps = TabDefaultProps;
TabLink.defaultProps = TabLinkDefaultProps;

Tab.propTypes = TabPropTypes;
TabLink.propTypes = TabLinkPropTypes;
