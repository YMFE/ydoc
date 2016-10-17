import React, {Component, PropTypes}from 'react';
import "./style.scss";
import "../../common/tapEventPluginInit";

let defaultProps = {
   /**
     * extraClass 组件扩展样式名称 string
     * total 评分star 总数 Number
     * defaultcur 默认值 Number
     * readonly 只读，无法进行交互 Boolean
     */
    extraClass: '',
    total: 5,
    defaultCur: 0,
    readonly: false
}

let propTypes = {
    extraClass: PropTypes.string,
    total: PropTypes.number,
    defaultCur: PropTypes.number,
    readonly: PropTypes.bool,
    onItemTap: PropTypes.func
}
/**
 * 评分组件
 *
 * @component Rating
 * @version  0.0.1
 * @description 对评价进行展示 对事物进行快速的评级操作。
 * @autor leila.wang
 */
export default class Rating extends Component {
	constructor(props) {
        super(props);
        this.state =  {
        	itemsArr: [],
        	cur: this.props.defaultCur
        };
    }
  	handleClick(item,evt,i) {
      if(this.props.readonly){
        evt.preventDefault();
        return;
      }else{
         /**
         * index 当前选中个数
         */
         var index = i+1;
         this.setValue(index);
      }
      if (this.props.onItemTap) this.props.onItemTap(item,evt,i);
  	}
    componentWillMount() {
       this.setValue(this.props.defaultCur);
    }
    setValue(value) {
      if (value < 0 || value > this.props.total) {
          return;
      }
      else {
        let itemsArrTmp = [], a = value, b= parseInt(value), c = a-b;
        for(let i = 0; i < a; i++){
          itemsArrTmp.push({width:'100%'});
        }
        if(c == 0){
            for(let i = a; i< this.props.total; i++){
              itemsArrTmp.push({width:'0'});
            }
        }else{
            let floatItem = { width: parseInt(c*1000)/10+'%'};
            itemsArrTmp[b] = floatItem;
            for(let i = (b+1); i< this.props.total; i++){
              itemsArrTmp.push({width:'0'});
            }
        }
        this.setState({itemsArr: itemsArrTmp, cur:value})
      }
    }
    render() {
    	const {extraClass} = this.props;
      const ratingClass = ["yo-rating", extraClass].join(' ');
     	const {cur,itemsArr,curIndexElStyle}=this.state;
    	return (
    		<ul className={ratingClass}>
			 	 {itemsArr.map((item, i) =>
          <li className="item" key={i} onTouchTap={evt=>{this.handleClick(item,evt,i)}}><span style={item}></span>
		      </li>
		       	)}
			  </ul>
    	)
    }
}

Rating.defaultProps = defaultProps;
Rating.propTypes = propTypes;
