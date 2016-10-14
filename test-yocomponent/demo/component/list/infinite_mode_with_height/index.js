/**
 * Created by Ellery1 on 16/9/6.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InfiniteDemo from '../common/infiniteDemo';
import '../../../../component_dev/common/touchEventSimulator';

ReactDOM.render(<InfiniteDemo itemHeight={350} isHeightFixed={true}/>, document.getElementById('content'));