import React, {Component, PropTypes} from 'react';
import Tab, {TabLink} from '../../../component_dev/tab/src';

export default class TabDemo extends Component {
    static defaultProps = {
        coreAttrs : [],
        coreChild: [{ attrs: [], index: 0 }],
        tabLinks: [
            {
                icon: "\uf04a",
                text: "定位",
            }, {
                icon: "\uf067",
                text: "搜索",
            }, {
                icon: "\uf2f7",
                text: "订单",
            }
        ],
    };

    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?(e-?\+?\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => regxNum.test(str) ? this.noZero(str)
                : (str === 'false' || str === 'true') ? str
                : `'${str}'`)
            .join(', ');
    }

    noZero(num) {
        return parseFloat(parseFloat(num).toFixed(2));
    }

    prefixInputValue(str) {
        return !Array.isArray(str) ? String(str) : `[ ${this.strFormated(String(str))} ]`;
    }

    toStr(unicode) {
        return unicode.charCodeAt(0).toString(16);
    }

    render() {
        const single = this.props.singleSlider;
        return (
          <div className="demo">
            <h3>样例{this.props.index}</h3>
            <Tab
                theme={this.props.theme}
                part={this.props.part}
                extraIconClass={this.props.extraIconClass}
                >
                {this.props.tabLinks.map(attrs => <TabLink {...attrs} />)}
            </Tab>
            {this.props.coreAttrs.map(attr =>
              <li className="item">
                <div className="mark flex h4">{`关键属性：${attr} `}</div>
                <div className="flex">
                  {this.prefixInputValue(this.props[attr])}
                </div>
              </li>
            )}
            {this.props.coreChild.map(child =>
                child.attrs.map(attr =>
                  <li className="item">
                    <div className="mark flex h4">{`tab:${child.index + 1}--关键属性：${attr} `}</div>
                    <div className="flex">
                      {(() => {
                        const value = this.props.tabLinks[child.index][attr];
                        if (attr === 'icon') {
                            let regx = /^[0-9a-f]{4}$/i,
                                iconCodeStr = value.charCodeAt(0).toString(16),
                                iconTag = regx.test(iconCodeStr);
                            if (iconTag) {
                                return `'\\u${value.charCodeAt(0).toString(16)}'`;
                            }
                        };
                        return this.prefixInputValue(value);
                      })()}
                    </div>
                  </li>
                )
            )}

          </div>
        )
    }
}
