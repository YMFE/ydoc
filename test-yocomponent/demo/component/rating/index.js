/**
 * Created by Ellery1 on 16/9/6.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Rating from '../../../component_dev/rating/src';
import Number from '../../../component_dev/number/src';
import Switch from '../../../component_dev/switch/src';
import './index.scss';
import '../../../component_dev/common/touchEventSimulator';

class RatingDemo extends Component {

    constructor() {
        super();

        this.state = {
            value: 1,
            total: 5,
            readonly: false,
            extraClass: '',
        }
    }

    render() {
        return (
            <Page title="Rating Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <ul className="yo-list">
                    <li className="item">
                        <label className="prop-name">
                            readonly:
                        </label>
                        <Switch checked={this.state.readonly} onChange={(val)=> {
                            this.setState({readonly: val});
                        }}/>
                    </li>
                    <li className="item">
                        <label className="prop-name">
                            value:
                        </label>
                        <Number
                            step={0.5}
                            dotNum={1}
                            inputDisable={true}
                            min={0}
                            max={this.state.total}
                            value={this.state.value}
                            onChange={(value)=> {
                                this.setState({value: value});
                            }}
                        />
                    </li>
                    <li className="item">
                        <label className="prop-name">
                            total
                        </label>
                        <Number
                            step={1}
                            inputDisable={true}
                            min={5}
                            max={10}
                            value={this.state.total}
                            onChange={(value)=> {
                                this.setState({
                                    total: value,
                                    value: this.state.value > value ? value : this.state.value
                                });
                            }}
                        />
                    </li>
                    <li className="item">
                        <label className="prop-name">
                            extraClass:
                        </label>
                        <Switch checked={!!this.state.extraClass} onChange={(val)=> {
                            this.setState({extraClass: val ? 'yo-rating-test' : ''});
                        }}/>
                    </li>
                </ul>
                <div className="m-rating">
                    <Rating
                        extraClass={this.state.extraClass}
                        value={this.state.value}
                        total={this.state.total}
                        onValueChange={value => this.setState({value: value})}
                        readonly={this.state.readonly}
                    />
                </div>
            </Page>
        );
    }
}

ReactDOM.render(<RatingDemo/>, document.getElementById('content'));
