/**
 * Created by zongze.li on 16/8/8.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import Loading, {loading} from '../src';

class LoadingDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {text, extraClass} = this.props;

        return (
            <Loading
                text={text}
                extraClass={extraClass}
            />
        )
    }
}

let text = "加载中...",
    extraClass = "yo-loading-b";

loading.show(text, extraClass);
// loading.show(text);
loading.hide();
// loading.show(undefined, '');
// loading.hide();
loading.show('123');
// loading.show('123');

// loading.show('123');
// loading.show('123');
// loading.show('123');

setTimeout(()=>{
    loading.show(undefined, extraClass);
}, 1000);
setTimeout(()=>{
    loading.hide();
}, 2000);

setTimeout(()=>{
    loading.show('123', extraClass);
}, 3000);

// loading.hide();
/*setTimeout(()=>{
    console.log('123');
}), 3000);
*/
