/*
 *  @providesModule MultiPicker
 */

var React = require('react');
var View = require('View');
var PropTypes = React.PropTypes;
var NativeMethodsMixin = require('NativeMethodsMixin');
var Picker = require('../Picker');
var StyleSheet = require('StyleSheet');


/**
 * MultiPicker 组件
 *
 * @component MultiPicker
 * @description 滚动选择器(多选, 内部用多个Picker组合在一起)
 * @example ./MultiPicker.js
 */


var MultiPicker = React.createClass({
    mixins: [NativeMethodsMixin],
    propTypes: {
        /**
         * @property selectedValues
         * @type array
         * @description 一个数组,其中存放了所有 Picker 被选中的值
         */
        selectedValues: PropTypes.array,
        /**
         * @property onValueChange
         * @type function
         * @description 当任何一个 Picker 的值因用户操作而改变, 这个函数会被调用。调用的时候回传入更新后的 selectedValues
         */
        onValueChange: PropTypes.func,
        /**
         * @property componentData
         * @type array
         * @description 一个二维数组, 像下面这样:
         *
         * [[{value, label},{value, label},{value, label} ],
         * [{value, label},{value, label},{value, label} ],
         * [{value, label},{value, label},{value, label} ]]
         */
        componentData: PropTypes.array,

        /**
         * @property pickerStyle
         * @description 用来设置每个 Picker 的样式
         */
        pickerStyle: View.propTypes.style,

        /**
         * @property itemStyle
         * @description 用来设置每个 Picker 的每一项的样式
         */
        itemStyle: View.propTypes.style,
    },
    getDefaultProps: function(){
        return {
            selectedValues: [],
            componentData: [],
        };
    },
    getInitialState: function(){
        return {};
    },
    onChange: function(itemValue, pickerIndex){
        let onChange = this.props.onChange;

        let selectedValues = this.props.selectedValues.slice(0);
        selectedValues[pickerIndex] = itemValue;
        onChange && onChange(selectedValues, pickerIndex);
    },
    render: function(){
        let props = this.props,
            componentData = props.componentData;
        return (
            <View style={[styles.container, props.style]} className="rn-multipicker">
                {
                    componentData.map((items, index) => {
                        return (
                            <View style={{flexDirection:'row', flex:1, alignItems:'center'}}>
                                <Picker
                                    {...props}
                                    style={props.pickerStyle}
                                    itemStyle={props.itemStyle}
                                    selectedValue={props.selectedValues[index]}
                                    onValueChange={(itemValue)=>{this.onChange(itemValue, index);}}
                                >
                                    {
                                        items.map(item => {
                                            return <Picker.Item value={item.value} label={item.label} />;
                                        })
                                    }
                                </Picker>
                            </View>
                          );
                    })
               }
           </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '200px',
        flexDirection: 'row',
        backgroundColor: '#F5FCFF'
    },
});

module.exports = MultiPicker;


