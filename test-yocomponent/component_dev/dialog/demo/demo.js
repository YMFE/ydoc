'use strict';

import Dialog from '../src';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class DialogDemo extends Component {
    constructor(props) {
        super(props);
        this.state= {
            topNormalToggle: false,
            centerTplToggle: false,
            centerExtraToggle: false,
            bottomAniToggle: false,
        };
    }

    topNormalOk() {
        console.log('topNormal ok');
        this.setState({topNormalToggle: false});
    }
    topNormalCancel() {
        console.log('topNormal cancel');
        this.setState({topNormalToggle: false});
    }

    topNormalShow() {
        this.setState({topNormalToggle: true});
    }

    centerTplOk() {
        console.log('centerTpl ok');
        this.setState({centerTplToggle: false});
    }
    centerTplCancel() {
        console.log('dialogdemo cancel');
        this.setState({centerTplToggle: false});
    }

    centerTplShow() {
        this.setState({centerTplToggle: true});
    }

    centerExtraOk() {
        console.log('centerTpl ok');
        this.setState({centerExtraToggle: false});
    }
    centerExtraCancel() {
        console.log('dialogdemo cancel');
        this.setState({centerExtraToggle: false});
    }

    centerExtraShow() {
        this.setState({centerExtraToggle: true});
    }

    bottomAniOk() {
        console.log('centerTpl ok');
        this.setState({bottomAniToggle: false});
    }
    bottomAniCancel() {
        console.log('dialogdemo cancel');
        this.setState({bottomAniToggle: false});
    }

    bottomAniShow() {
        this.setState({bottomAniToggle: true});
    }

    render() {
        return (
            <div>
                <Dialog
                    show={this.state.topNormalToggle}
                    effect={false}
                    title='top title'
                    content='top content'
                    align='top'
                    ok={this.topNormalOk.bind(this)}
                    cancel={this.topNormalCancel.bind(this)}
                />
                <Dialog
                    show={this.state.centerTplToggle}
                    effect={false}
                    title={<div style={{color:'red'}}>title</div>}
                    content={<div style={{color:'red'}}>content</div>}
                    align='center'
                    maskOffset={[44, 44]}
                    ok={this.centerTplOk.bind(this)}
                    cancel={this.centerTplCancel.bind(this)}
                />
                <Dialog
                    show={this.state.centerExtraToggle}
                    effect={false}
                    content='content'
                    align='center'
                    extraClass='yo-dialog-demo'
                    ok={this.centerExtraOk.bind(this)}
                    cancel={this.centerExtraCancel.bind(this)}
                />
                <Dialog
                    show={this.state.bottomAniToggle}
                    effect={{animation:['zoom-in', 'zoom-out'], duration: 500}}
                    title='title'
                    content='content'
                    width={300}
                    height={150}
                    align='bottom'
                    ok={this.bottomAniOk.bind(this)}
                    cancel={this.bottomAniCancel.bind(this)}
                />
                <button className="yo-btn yo-btn-m yo-btn-stacked demo" onTouchTap={()=>this.topNormalShow()}>top normal</button>
                <button className="yo-btn yo-btn-m yo-btn-stacked demo" onTouchTap={()=>this.centerTplShow()}>center Template maskOffset</button>
                <button className="yo-btn yo-btn-m yo-btn-stacked demo" onTouchTap={()=>this.centerExtraShow()}>center extraClass noTitle</button>
                <button className="yo-btn yo-btn-m yo-btn-stacked demo" onTouchTap={()=>this.bottomAniShow()}>bottom width height animation</button>
            </div>
        );
    }

}

ReactDOM.render(
    <DialogDemo/>,
    document.getElementById('content')
);
