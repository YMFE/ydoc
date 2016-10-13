import React from 'react';
import ReactDOM from 'react-dom';
import Rating from "../src"

class RatingDemo extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			defaultCur: 3,
			total: 5,
			readonly: false,
			extraClass:"yo-rating-mice",
			value: 3,
		};
	}
	render() {
		return (
			<div>
				<div>
					<div>基础用法</div>
					<Rating
						value={this.state.value}
						total={this.state.total}
						readonly={this.state.readonly}
						extraClass={this.state.extraClass}
						onValueChange={(value)=>this.setState({value: value})}
					/>
				</div>
				<div>
					<div>默认值</div>
					<Rating/>
				</div>
				<div>初始为小数(cur=3.222)<Rating value={3.222} total = {this.state.total} readonly={this.state.readonly} extraClass={this.state.extraClass} onItemTap={(item,evt,i) => {console.log('onItemTap');}}/></div>
				<div>初始为小数(cur=2.5)<Rating defaultCur={2.5} total = {6} readonly={this.state.readonly} extraClass={this.state.extraClass}/></div>
				<div>只读，无法进行鼠标交互。(cur=1)<Rating defaultCur={1} total = {5} readonly={true} onItemTap={(item,evt,i) => {console.log('onItemTap');}}/></div>
				<div>通过样式改变评分图标。尺寸大小自适应 (cur=1)<Rating defaultCur={1} total = {5} readonly={false} extraClass={"yo-rating-test"}/></div>
			</div>

		);
	}
}

ReactDOM.render(
	<div>
	demo
	<RatingDemo />
	</div>,
	document.getElementById('content')
);
