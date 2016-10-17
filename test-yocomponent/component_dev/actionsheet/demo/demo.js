import React from 'react';
import ReactDOM from 'react-dom';
import ActionSheet from '../src';

class ActionSheetDemo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false};
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="test-wrap">
                <ActionSheet height={200} show={this.state.show} onMaskClick={()=>{this.setState({show:false})}}>
                    hahahaha
                </ActionSheet>
                <button onClick={()=>{this.setState({show:true})}}>Open ActionSheet</button>
            </div>
        );
    };
}

ReactDOM.render(
    <ActionSheetDemo/>,
    document.getElementById('content')
);