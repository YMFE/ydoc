/**
 * Created by Ellery1 on 16/9/7.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InfiniteDemo from '../common/infiniteDemo';
import '../../../../component_dev/common/touchEventSimulator';

ReactDOM.render(<InfiniteDemo isHeightFixed={false}/>, document.getElementById('content'));