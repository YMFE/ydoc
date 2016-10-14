import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Suggest from '../../../../component_dev/suggest/src';
import Grouplist from '../../../../component_dev/grouplist/src';
import ToolTip from '../../../../component_dev/tooltip/src';
import Page from '../../common/page';
import '../../../../component_dev/common/touchEventSimulator';

const cityData = [
    {text: '北京', groupKey: '热门', py: 'beijing'},
    {text: '上海', groupKey: '热门', py: 'shanghai'},
    {text: '广州', groupKey: '热门', py: 'guangzhou'},
    {value: '1', text: '阿里', py: 'ali'},
    {value: '1', text: '鞍山', py: 'anshan'},
    {value: '1', text: '北京', py: 'beijing'},
    {value: '1', text: '包头', py: 'baotou'},
    {value: '1', text: '北海', py: 'beihai'},
    {value: '1', text: '成都', py: 'chengdu'},
    {value: '1', text: '大同', py: 'datong'},
    {value: '1', text: '福州', py: 'fuzhou'},
    {value: '1', text: '广州', py: 'guangzhou'},
    {value: '1', text: '杭州', py: 'hangzhou'},
    {value: '1', text: '海口', py: 'haikou'},
    {value: '1', text: '兰州', py: 'lanzhou'},
    {value: '1', text: '泉州', py: 'quanzhou'},
    {value: '1', text: '上海', py: 'shanghai'},
    {value: '1', text: '深圳', py: 'shenzhen'},
    {value: '1', text: '武汉', py: 'wuhan'},
    {value: '1', text: '厦门', py: 'xiamen'},
    {value: '1', text: '漳州', py: 'zhangzhou'},
    {text: '保定', py: 'baoding'},
    {text: '石家庄', py: 'shijiazhuang'},
    {text: '燕郊', py: 'yanjiao'},
    {text: '天津', py: 'tianjin'},
    {text: '三亚', py: 'sanya'}
];

let guid = -1;
const groupListDataSource = cityData.map(city=> {
    if (!city.groupKey) {
        return {
            text: city.text,
            py: city.py,
            groupKey: city.py.charAt(0).toUpperCase(),
            key: ++guid
        };
    }
    return {...city, key: ++guid};
});

class CitySelectDemo extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            showLoadingIcon: false
        };
    }

    filterCity(condition) {
        return condition ? groupListDataSource
            .filter(city=>city.groupKey !== '热门')
            .filter(city=>city.py.search(condition) !== -1 || city.text.search(condition) !== -1) : [];
    }

    render() {
        //实现一个如此复杂的组件只用了不到30行代码
        //使用React,可以很容易地像搭积木一样用小组件搭建出大组件,而不是不停地重复造轮子
        //善用组件化,开发效率可以成倍的提升
        return (
            <Page title="城市选择示例" onLeftPress={()=>location.href = "../index.html"}>
                <Suggest
                    noDataTmpl={(
                        <div style={{padding: '1em'}}>
                            {!this.state.loading ? 'No Result' : 'Loading...'}
                        </div>
                    )}
                    recommendTmpl={(
                        <Grouplist
                            infinite={true}
                            itemHeight={44}
                            infiniteSize={25}
                            dataSource={groupListDataSource}
                            sort={(a, b)=> {
                                if (a === '热门') {
                                    return -1;
                                }
                                return a.charCodeAt(0) - b.charCodeAt(0);
                            }}
                            showIndexNavBar={true}
                            onIndexNavBarItemHover={(groupKey)=>ToolTip.show(groupKey, 1000)}
                            onItemTap={item=>ToolTip.show('选择:' + item.text, 1000)}
                        />
                    )}
                    inputIcon={this.state.loading ? 'loading' : 'delete'}
                    results={this.state.results}
                    onConditionChange={value=> {
                        this.setState({loading: true});
                        setTimeout(()=> {
                            this.setState({loading: false, results: this.filterCity(value)});
                        }, 300);
                    }}
                    onItemTap={item=>ToolTip.show('选择:' + item.text, 1000)}
                    placeholder="输入城市名称或拼音"
                    throttleGap={500}
                />
            </Page>
        );
    }
}

ReactDOM.render(<CitySelectDemo/>, document.getElementById('content'));