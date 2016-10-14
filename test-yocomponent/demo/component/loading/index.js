/**
 * Created by zongze.li on 16/9/29.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import Page from '../common/page';
import './main.scss';
import Loading, {loading} from '../../../component_dev/loading/src';

class LoadingApi extends Component {

    constructor(props) {
        super(props);
        const {text, extraClass, show} = props;
        this.state = {
            text,
            extraClass,
            show,
        };
        that = this;
    }

    render() {
        return (
            <Modal
                align="center"
                show={this.state.show}
            >
                <Loading
                    text={this.state.text}
                    extraClass={`${this.state.extraClass}`}
                />
            </Modal>
        )
    }
}

function delay(secs, params = {}) {
    const {text, extraClass} = params;
    setTimeout(()=>{
        loading.show(text, extraClass);
    }, 0);
    setTimeout(()=>{
        loading.hide();
    }, secs * 1000);
}

ReactDom.render(
    <Page title="Loading Demo" onLeftPress={()=>location.href='../index/index.html'}>
        <div className={"loading-demo"} >
            <ul className="yo-list">
                <li className="item">
                    <div className="h4">
                        基本样式，无参，不覆盖之前样式
                    </div>
                    <div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onTouchTap={() => {
                                delay(1);
                            }}
                        >
                            loading.show()
                        </button>
                    </div>
                </li>
                <li className="item">
                    <div className="h4">
                        可添加文字，传参数 'loading'
                    </div>
                    <div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onTouchTap={() => {
                                delay(1, { text: 'loading' });
                            }}
                        >
                            loading.show('loading')
                        </button>
                    </div>
                </li>
                <li className="item">
                    <div className="h4">
                        清除文字，传参数 ''
                    </div>
                    <div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onTouchTap={() => {
                                delay(1, { text: '' });
                            }}
                        >
                            loading.show('')
                        </button>
                    </div>
                </li>
                <li className="item">
                    <div className="h4">
                        显示10秒，供查看元素用
                    </div>
                    <div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onTouchTap={() => {
                                delay(10);
                            }}
                        >
                            loading.show()
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </Page>,
    document.getElementById('content')
);

