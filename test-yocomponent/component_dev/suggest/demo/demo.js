/**
 * Created by Ellery1 on 16/7/4.
 */
import Suggest from '../src';
import Modal from '../../modal/src';
import ActionSheet from '../../actionsheet/src';
import React from 'react';
import ReactDom from 'react-dom';

function randomizeArray() {
    var ret = [];
    for (let i = 0; i < 20; i++) {
        ret[i] = Math.random() * 100;
    }
    return ret;
}

class SuggestDemo extends React.Component {

    constructor() {
        super();
        this.state = {show: false, results: []};
    }

    filter(value, oldValue) {
        if (value) {
            this.setState({results: randomizeArray().map(num=>({text: num}))});
        }
        else {
            this.setState({results: []});
        }
    }

    render() {
        return (
            <div className="suggest-demo">
                <ActionSheet
                    maskExtraClass="test-mask"
                    show={this.state.show}
                    height={window.screen.height}
                    onShow={()=> {
                        this.suggest.input.focus();
                    }}
                >
                    <Suggest
                        onItemTap={(result, i, evt)=>console.log(result)}
                        ref={suggest=>this.suggest = suggest}
                        inputIcon={'refresh'}
                        showCancelButton={true}
                        onIconTap={(name, value)=> {
                            console.log(name, value)
                        }}
                        onCancelButtonTap={()=> {
                            this.setState({show: false})
                        }}
                        onFocus={(value)=>console.log(value)}
                        noDataTmpl={<div style={{padding: "0.11rem 0.1rem 0.12rem"}}>None!</div>}
                        onConditionChange={(value, oldValue)=>this.filter(value, oldValue)}
                        results={this.state.results}
                        extraClass="test"
                        itemActiveClass="item-light"
                        placeholder="搜索"
                        defaultCondition="hahah"
                    />
                </ActionSheet>
                <button onClick={()=> {
                    this.setState({show: true})
                }}>
                    打开
                </button>
            </div>
        );
    }
}

ReactDom.render(
    <SuggestDemo/>,
    document.getElementById('content')
);

