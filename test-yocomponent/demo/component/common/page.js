/**
 * Created by Ellery1 on 16/9/6.
 */
import React, {Component} from 'react';
import '../../../component_dev/common/tapEventPluginInit';
import './common.scss';

export default class Page extends Component {

    constructor() {
        super();
    }

    render() {

        const {right, onLeftPress}=this.props;
        const hideHeader = location.href.search('hideHeader') !== -1;

        return (
            <div className="yo-flex">
                {!hideHeader ?
                    <header className="yo-header-common yo-header m-header">
                        <h2 className="title">{this.props.title || "标题"}</h2>
                        <a href="javascript:void 0;" onTouchTap={()=> {
                            !onLeftPress ? history.go(-1) : onLeftPress();
                        }} className="regret yo-ico"></a>
                        {right ?
                            <a href="javascript:void 0;" onTouchTap={()=> {
                                right.onPress && right.onPress();
                            }} className={"affirm " + (right.className || '')}>{right.text}</a> : null}
                    </header> : null}
                <div className={this.props.extraClass ? "flex " + this.props.extraClass : "flex"}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
