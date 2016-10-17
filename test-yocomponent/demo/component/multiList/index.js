import './demo.scss';
import React, {Component, PropTypes} from 'react';
import Page from '../common/page';
import ReactDOM from 'react-dom';
import MultiList from '../../../component_dev/multiList/src/';
import {PlanItem} from '../../../component_dev/multiList/src/listItems.js';
import {CheckBoxItem, ParentValue} from './multiListItem.js';
import '../../../component_dev/common/touchEventSimulator';
import {
    trafficData,
    localData,
    distanceData,
    reginData,
    toturistAttractionData,
    subWayData
} from './testData.js';
import {Product} from './product.js';
let effectValue;

const defaultRenderItem = ({item, multiValue, listValue, defaultValue}) => (
    <PlanItem
        item={item}
        multiValue={multiValue}
        listValue={listValue}
        defaultValue={defaultValue}
        effectValue={effectValue}
    />
);

defaultRenderItem.propTypes = {
    item: PropTypes.Object,
    multiValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.array
    ]),
    listValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.array
    ]),
    defaultValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.array
    ])
};

const parentItem = (props) => <ParentValue {...props} effectValue={effectValue}/>;
let effect;
const touristAttraction = [{
    name: '观光景点',
    value: '1',
    renderItem: defaultRenderItem,
    defaultValue: 0,
    onItemTap: (listValue, itemValue) => {
        const newlistValue = itemValue;
        if (itemValue !== 0) {
            effect = 1;
        } else {
            effect = -1;
        }
        return newlistValue;
    },
    subList: toturistAttractionData.urban
}, {
    name: '郊游景点',
    value: '2',
    defaultValue: 0,
    renderItem: defaultRenderItem,
    onItemTap: (listValue, itemValue) => {
        const newlistValue = itemValue;
        if (itemValue !== 0) {
            effect = 1;
        } else {
            effect = -1;
        }
        return newlistValue;
    },
    subList: toturistAttractionData.suburbs
}];

const subWay = [{
    name: '1号线',
    value: 1,
    defaultValue: 0,
    renderItem: (p) => {
        if (p.item.value === 0) {
            return <PlanItem {...p} />;
        }
        return <CheckBoxItem {...p} />;
    },
    onItemTap: (listValue, itemValue) => {
        let newValue;
        if (itemValue === 0) {
            newValue = itemValue;
            effect = -1;
        } else {
            if (!(listValue instanceof Array)) {
                listValue = [];
            }
            if (!~listValue.indexOf(itemValue)) {
                newValue = listValue.slice(0);
                newValue.push(itemValue);
                effect = 1;
            } else {
                newValue = listValue.slice(0);
                newValue.splice(listValue.indexOf(itemValue), 1);
                effect = 1;
            }
            if (newValue.length === 0) {
                newValue = 0;
                effect = -1;
            }
        }
        return newValue;
    },
    subList: subWayData[1]
}, {
    name: '2号线',
    value: 2,
    defaultValue: 0,
    renderItem: (p) => {
        if (p.item.value === 0) {
            return <PlanItem {...p} />;
        }
        return <CheckBoxItem {...p} />;
    },
    onItemTap: (listValue, itemValue) => {
        let newValue;
        if (itemValue === 0) {
            newValue = itemValue;
            effect = -1;
        } else {
            if (!(listValue instanceof Array)) {
                listValue = [];
            }
            if (!~listValue.indexOf(itemValue)) {
                newValue = listValue.slice(0);
                newValue.push(itemValue);
                effect = 1;
            } else {
                newValue = listValue.slice(0);
                newValue.splice(listValue.indexOf(itemValue), 1);
                effect = 1;
            }
            if (newValue.length === 0) {
                newValue = 0;
                effect = -1;
            }
        }
        return newValue;
    },
    subList: () => (
        new Promise((resolve) => {
            window.setTimeout(() => {
                resolve(subWayData[2]);
            }, 500);
        })
    )
}, {
    name: '3号线',
    value: 3,
    subList: []
}];

class MultiListDemo extends Component {
    constructor(props) {
        super(props);

        const multiData = {
            defaultValue: 3,
            renderItem: parentItem,
            itemExtraClass: (item) => (
                this.state && this.state.value && this.state.value[0] === item.value ?
                    'spread item'
                    : 'item'
            ),
            subList: [{
                name: '距离我',
                value: 0,
                defaultValue: 0,
                subList: distanceData,
                onItemTap: (listValue, itemValue) => {
                    const newlistValue = itemValue;
                    if (itemValue !== 0) {
                        effect = 1;
                    } else {
                        effect = -1;
                    }
                    return newlistValue;
                }
            }, {
                name: '商圈',
                value: 1,
                subList: localData,
                defaultValue: 0,
                renderItem: (p) => {
                    if (p.item.value === 0) {
                        return <PlanItem {...p} effectValue={effectValue}/>;
                    }
                    return <CheckBoxItem {...p} />;
                },
                onItemTap: (listValue, itemValue) => {
                    let newValue;
                    if (itemValue === 0) {
                        newValue = itemValue;
                        effect = 1;
                    } else {
                        if (!(listValue instanceof Array)) {
                            listValue = [];
                        }
                        if (!~listValue.indexOf(itemValue)) {
                            newValue = listValue.slice(0);
                            newValue.push(itemValue);
                            effect = 1;
                        } else {
                            newValue = listValue.slice(0);
                            newValue.splice(listValue.indexOf(itemValue), 1);
                            effect = 1;
                        }
                        if (newValue.length === 0) {
                            effect = -1;
                            newValue = 0;
                        }
                    }
                    return newValue;
                }
            }, {
                name: '行政区',
                value: 2,
                defaultValue: 0,
                subList: reginData,
                renderItem: (props) => {
                    if (props.item.value === 0) {
                        return <PlanItem {...props} effectValue={effectValue}/>;
                    }
                    return <CheckBoxItem {...props} />;
                },
                onItemTap: (listValue, itemValue) => {
                    let newValue;
                    if (itemValue === 0) {
                        newValue = itemValue;
                    } else {
                        if (!(listValue instanceof Array)) {
                            listValue = [];
                        }
                        if (!~listValue.indexOf(itemValue)) {
                            newValue = listValue.slice(0);
                            newValue.push(itemValue);
                            effect = 1;
                        } else {
                            newValue = listValue.slice(0);
                            newValue.splice(listValue.indexOf(itemValue), 1);
                            effect = 1;
                        }
                        if (newValue.length === 0) {
                            newValue = 0;
                            effect = -1;
                        }
                    }
                    return newValue;
                }
            }, {
                name: '热门景点',
                value: 3,
                defaultValue: '1',
                renderItem: parentItem,
                subList: touristAttraction,
                extraClass: 'subList',
                itemExtraClass: (item) => (
                    this.state && this.state.value && this.state.value[1] === item.value ?
                        'spread-item item'
                        : 'item'
                )
            }, {
                name: '机场车站',
                value: 4,
                subList: trafficData,
                defaultValue: 0,
                renderItem: defaultRenderItem,
                onItemTap: (listValue, itemValue) => {
                    const newlistValue = itemValue;
                    if (itemValue !== 0) {
                        effect = 1;
                    } else {
                        effect = -1;
                    }
                    return newlistValue;
                }
            }, {
                name: '地铁线路',
                value: 5,
                subList: subWay,
                defaultValue: 1,
                renderItem: parentItem,
                onItemTap: (listValue, itemValue) => itemValue,
                extraClass: 'subList',
                itemExtraClass: (item) => (
                    this.state && this.state.value && this.state.value[1] === item.value ?
                        'spread-item item'
                        : 'item'
                )
            }, {
                name: '产品推荐',
                value: 9,
                renderContent: () => (<Product />)
            }]
        };
        this.state = {
            dataSource: multiData,
            value: [],
            effectValue: []
        };
    }

    handleUpdateData(data) {
        this.setState({
            dataSource: data
        });
    }

    handleUpdateValue({ newValue }) {
        // debugger
        const i = newValue.length;
        // 历史有效值的生效
        if (effectValue && effectValue.slice(0, i).join('&') === newValue.slice(0, i).join('&')) {
            this.setState({
                value: effectValue
            });
            return;
        }
        if (effect === 1) {
            effectValue = newValue.slice(0);
            effect = 0;
        } else if (effect === -1) {
            effectValue = null;
            effect = 0;
        }
        this.setState({
            value: newValue,
            effectValue
        });
    }

    render() {
        return (
            <Page title="multiList Demo" extraClass="demo-content"
                  onLeftPress={()=>location.href = '../index/index.html'}>
                <MultiList
                    dataSource={this.state.dataSource}
                    updateDataSource={(data) => {
                        this.handleUpdateData(data);
                    }}
                    value={this.state.value}
                    updateValue={(props) => {
                        this.handleUpdateValue(props);
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<MultiListDemo />, document.querySelector('#container'));
