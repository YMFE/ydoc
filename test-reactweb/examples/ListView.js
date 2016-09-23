'use strict';
var React = require('qunar-react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    Alert,
    ListView
} = React;

var APP = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2', 'row 3']),
        }
    },
    render: function(){
      return (
        <ListView
          dataSource={this.state.dataSource}
          initialListSize={3}
          renderRow={(rowData) => {
              return (
                  <Text style={styles.listItem}>{rowData}</Text>
              )
          }}
        />
      );
    }

});

var styles = StyleSheet.create({
    listItem:{
        padding:10,
        borderBottom:'1px solid #ccc',
        borderColor:'#333'
    }
});

AppRegistry.registerComponent('ListView', () => APP)
