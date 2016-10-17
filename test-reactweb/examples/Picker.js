var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    Picker,
} = ReactNative;


var PickerExample = React.createClass({
    getInitialState: function(){
        return {
            selectedValue : 'Lisp'
        };
    },
    render: function() {
        return (
            <View
                style={{flex: 1,flexDirection: 'column'}}
            >
                <Picker
                    selectedValue={this.state.selectedValue}
                    itemStyle={{height:40,color:'#fff'}}
                    style={{backgroundColor:'#14A1B4'}}
                    itemSelectStyle={{color: '#000'}}
                    onValueChange={(value)=>{
                        this.setState({selectedValue: value})
                        console.log('已经选中:' + value);
                    }}
                >
                    <Picker.Item label="Java" value="Java" />
                    <Picker.Item label="JavaScript" value="JavaScript" />
                    <Picker.Item label="C++" value="C++" />
                    <Picker.Item label="Python" value="Python" />
                    <Picker.Item label="Ruby" value="Ruby" />
                    <Picker.Item label="Lisp" value="Lisp" />
                    <Picker.Item label="Swift" value="Swift" />
                </Picker>
            </View>
        );
    }
});


AppRegistry.registerComponent('AwesomeProject', () => PickerExample)
