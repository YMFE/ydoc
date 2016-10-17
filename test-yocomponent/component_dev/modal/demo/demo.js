import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from '../src';

class ModalDemo extends Component {

    constructor(props) {

        super(props);
        this.state = {show: false};
    }

    componentDidMount() {

        // var show = this.state.show, self = this;
        // setInterval(()=> {
        //
        //     show = !show;
        //     self.setState({show})
        // }, 1000);
    }

    render() {

        return (
            <div className="test-wrap">
                <Modal
                    align="center"
                    show={this.state.show}
                    contentExtraClass="test"
                    animation="fade"
                    onMaskClick={()=>{this.setState({show:false})}}
                    width={200}
                    height={100}
                >
                    hahaha
                </Modal>
                <button type="button" onClick={()=>{this.setState({show:true})}}>Open Modal!</button>
            </div>
        );
    }
}

ReactDOM.render(
    <ModalDemo/>,
    document.getElementById('content')
);