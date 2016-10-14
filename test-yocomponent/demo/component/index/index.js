import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import GroupList from '../../../component_dev/grouplist/src';
import '../../../component_dev/common/touchEventSimulator';

let guid = -1;
const componentList = [
    {
        text: 'ActionSheet',
        groupKey: 'Component',
        link: '../actionsheet/index.html'
    },
    {
        text: 'List',
        groupKey: 'Component',
        link: '../list/index.html'
    },
    {
        text: 'GroupList',
        groupKey: 'Component',
        link: '../grouplist/index.html'
    },
    {
        text: 'MultiList',
        groupKey: 'Component',
        link: '../multiList/index.html'
    },
    {
        text: 'Scroller',
        groupKey: 'Component',
        link: '../scroller/index.html'
    },
    {
        text: 'Calendar',
        groupKey: 'Component',
        link: '../calendar/index.html'
    },
    {
        text: 'Range',
        groupKey: 'Component',
        link: '../range/index.html'
    },
    {
        text: 'Picker',
        groupKey: 'Component',
        link: '../picker/index.html'
    },
    {
        text: 'Popup',
        groupKey: 'Component',
        link: '../popup/index.html'
    },
    {
        text: 'DateTimePicker',
        groupKey: 'Component',
        link: '../datetimepicker/index.html'
    },
    {
        text: 'Modal',
        groupKey: 'Component',
        link: '../modal/index.html'
    },
    {
        text: 'Dialog',
        groupKey: 'Component',
        link: '../dialog/index.html'
    },
    {
        text: 'SwipeMenu',
        groupKey: 'Component',
        link: '../swipeMenu/index.html'
    },
    {
        text: 'SwipeMenuList',
        groupKey: 'Component',
        link: '../swipeMenuList/index.html'
    },
    {
        text: 'Switch',
        groupKey: 'Component',
        link: '../switch/index.html'
    },
    {
        text: 'Suggest',
        groupKey: 'Component',
        link: '../suggest/index.html'
    },
    {
        text: 'Carousel',
        groupKey: 'Component',
        link: '../carousel/index.html'
    },
    {
        text: 'Tab',
        groupKey: 'Component',
        link: '../tab/index.html'
    },
    {
        text: 'Number',
        groupKey: 'Component',
        link: '../number/index.html'
    },
    {
        text: 'Rating',
        groupKey: 'Component',
        link: '../rating/index.html'
    },
    {
        text: 'Confirm',
        groupKey: 'API',
        link: '../confirm/index.html'
    },
    {
        text: 'Alert',
        groupKey: 'API',
        link: '../alert/index.html'
    },
    {
        text: 'ToolTip',
        groupKey: 'API',
        link: '../tooltip/index.html'
    },
    {
        text: 'Loading',
        groupKey: 'API',
        link: '../loading/index.html'
    }
];

class DemoIndex extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Page title="Yo-Component Demo">
                <GroupList
                    dataSource={componentList.sort((a, b)=>a.text.charCodeAt(0) - b.text.charCodeAt(0))}
                    //infinite={true}
                    onItemTap={(item)=> {
                        location.href = item.link;
                    }}
                    sort={(a, b)=> {
                        if (a === 'Component') {
                            return -1;
                        }
                        return 1;
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<DemoIndex/>, document.getElementById('content'));
