import React from 'react';
import ReactDOM from 'react-dom';
import ListView from '../src';
import testData from './testdata';
import '../../common/tapEventPluginInit'

var guid = -1;
function getImage(url) {

    return "http://himg1.qunarzz.com/imgs/" + url + "a818.jpg";
}

let dataSource = [];

for (let i = 0; i < 100; i++) {

    let item = testData.data.commentList[parseInt(Math.random() * 50)];
    dataSource.push({
        nickname: item.nickName,
        avatar: getImage(item.imgUrl),
        imageHeight: Math.floor(300 * Math.random())
    });
}

class DemoItem extends React.Component {

    mutateDataSource() {
        const {item, parent}=this.props;
        dataSource = dataSource.filter((it, index)=>it.guid !== item.guid);
        parent.setState({dataSource});
    }

    render() {
        return (
            <a style={{display: 'block', overflow: 'hidden'}} href="javascript:void 0;">
                <img
                    style={{display: 'block'}}
                    width={"100%"}
                    height={this.props.item.imageHeight}
                    src={this.props.item.avatar}
                />
                <span>{this.props.item.guid}</span>
                <div className="comment-wrap">
                    <h2 className="comment-title ellipsis">如此美景，难怪志明要带春娇来这里</h2>
                    <p className="comment-detail ellipsis">北京长城脚下的公社</p>

                    <div className="tags ellipsis">
                        度假&nbsp;/&nbsp;亲子&nbsp;/&nbsp;浪漫&nbsp;/&nbsp;美景&nbsp;/&nbsp;格调
                    </div>
                </div>
            </a>
        );
    }
}

class ListViewDemo extends React.Component {
    mutateDataSource(item, ds) {
        ds = ds.map((it, i)=> {
            if (it._guid === item._guid) {

                return {
                    ...it,
                    imageHeight: it.imageHeight + 20,
                    height: it.height + 20,
                    _guid: null
                };
            }

            return it;
        });

        this.setState({
            dataSource: ds,
            infinite: !this.state.infinite,
            infiniteSize: ++this.state.infiniteSize
        });
    }

    constructor(props) {

        super(props);
        this.state = {
            dataSource: dataSource,
            infiniteSize: 10,
            infinite: true
        };
    }

    render() {

        return (
            <div style={{height: "100%"}}>
                <button style={{display: 'block'}} onClick={()=> {

                    if (this.refreshing) {

                        this.refs.list.stopRefreshing(true);
                        this.refreshing = false;
                    }
                    else {
                        this.refs.list.startRefreshing();
                        this.refreshing = true;
                    }
                }}>
                    模拟下拉刷新
                </button>
                <div style={{position: 'absolute', top: 20, bottom: 0, width: "100%"}}>
                    <ListView
                        ref="list"
                        usePullRefresh={true}
                        onRefresh={(ds)=>console.log(ds)}
                        dataSource={this.state.dataSource}
                        renderItem={(item, i)=><DemoItem item={item}/>}
                        infiniteSize={10}
                        infinite={true}
                        itemActiveClass={(item, index)=> {
                            if (item._index === 0) {
                                return 'item-light';
                            }
                            return '';
                        }}
                        onItemTap={(item, index, ds)=>this.mutateDataSource(item, ds)}
                        //给item添加额外样式
                        //可以是字符串,会被应用到所有item上
                        //也可以是函数
                        itemExtraClass={(item, index)=>['item', index].join(' ')}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ListViewDemo/>, document.getElementById('content'));
