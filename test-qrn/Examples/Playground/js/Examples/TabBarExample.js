'use strict'

import React, {Component, StyleSheet, View, Text, Image, TabBar} from 'qunar-react-native'

class TabBarExample extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            selectedTab: 'wifi',
            badgeVisible: true,
        }
    }

    renderIcon(tab) {
        const iconfonts = {
            wifi: '\uf04b',
            find: '\uf067',
            money: '\uf238',
        }
        return <Text style={{fontFamily: 'qunar_react_native', fontSize: 22}}>{iconfonts[tab]}</Text>
    }

    render() {
        const tabs = ['wifi', 'find', 'money']

        return (
            <TabBar
                style={styles.tabBar}
                barTintColor="#fff"
            >
                {tabs.map((tab, i) =>
                    <TabBar.item
                        key={i}
                        title={tab}
                        badge={tab === 'find' && this.state.badgeVisible ? '1' : undefined}
                        selected={this.state.selectedTab === tab}
                        onPress = {() => this.onTabPress(tab)}
                        renderIcon={() => this.renderIcon(tab)}
                        titleStyle={{fontSize: 14}}
                        iconStyle={{fontSize: 22}}
                    >
                        {this.renderPageContent(tab)}
                    </TabBar.item>
                )}
            </TabBar>
        )
    }

    renderPageContent(pageText: string) {
        return (
            <View style={styles.pageContainer}>
                <View style={[styles.pageContent, {backgroundColor: getRandomColor()}]}>
                    <Text style={styles.pageContentText}>当前页面: {pageText}</Text>
                </View>
            </View>
        )

        function getRandomColor() {
            var letters = '3456789ABC'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 10)];
            }
            return color;
        }
    }

    onTabPress(tab){
        if(tab === 'find'){
            this.state.badgeVisible = false
        }

        this.setState({
            selectedTab: tab,
            badgeVisible: this.state.badgeVisible
        })
    }
}

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#ddd'
    },
    pageContainer: {
        flex: 1,
    },
    pageContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageContentText: {
        fontSize: 20,
        color: '#fff'
    },
})

module.exports = {
    title: 'TabBar',
    examples: [{
        render: () => {
            return <TabBarExample/>
        }
    }],
};
