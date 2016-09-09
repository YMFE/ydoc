'use strict';
import {Modal, View, Text, Component, TouchableOpacity, Dimensions} from 'qunar-react-native';

class ModalExampleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultConfig: false,
            fade: false,
            slide: false,
            offset: false,
            left: false,
            noNavBarMask: false,
            actionSheet: false
        }
    }

    closeModal(modalName) {

        this.setState({
            [modalName]: false
        });
    }

    openModal(modalName) {

        this.setState({[modalName]: true});
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <View style={styles.noteWrap}>
                    <Text style={styles.noteWrapTextIcon}>{'\uf07f'}</Text>
                    <Text style={styles.noteWrapText}>Modal Example</Text>
                </View>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('defaultConfig')}>
                    <Text style={styles.listRowText}>默认配置</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('fade')}>
                    <Text style={styles.listRowText}>Fade动画效果</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('slide')}>
                    <Text style={styles.listRowText}>SlideFromBottom动画效果</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('offset')}>
                    <Text style={styles.listRowText}>设置offset和slideFromTop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('left')}>
                    <Text style={styles.listRowText}>设置position:left和slideFromLeft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('noNavBarMask')}>
                    <Text style={styles.listRowText}>设置showNavBarMask=false</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listRow} onPress={()=>this.openModal('actionSheet')}>
                    <Text style={styles.listRowText}>使用Modal实现一个ActionSheet</Text>
                </TouchableOpacity>
                <Modal visible={this.state.defaultConfig}>
                    <View style={styles.content}>
                        <Text>
                            这是一个全部应用默认属性的Modal
                        </Text>
                        <Text>
                            并且没有配置onMaskPress
                        </Text>
                        <TouchableOpacity onPress={()=>this.closeModal('defaultConfig')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.fade}
                    animation="fade"
                    onMaskPress={()=>this.closeModal('fade')}
                >
                    <View style={styles.content}>
                        <Text>这是一个有fade效果的Modal</Text>
                        <TouchableOpacity onPress={()=>this.closeModal('fade')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.slide}
                    animation="slideFromBottom"
                    onMaskPress={()=>this.closeModal('slide')}
                >
                    <View style={styles.content}>
                        <Text>这是一个有slideFromBottom效果的Modal</Text>
                        <TouchableOpacity onPress={()=>this.closeModal('slide')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.offset}
                    animation="slideFromTop"
                    onMaskPress={()=>this.closeModal('offset')}
                    offset={-200}
                >
                    <View style={styles.content}>
                        <Text>这个Modal向上偏移了200个像素,</Text>
                        <Text>并且设置了slideFromTop效果</Text>
                        <TouchableOpacity onPress={()=>this.closeModal('offset')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.left}
                    animation="slideFromLeft"
                    onMaskPress={()=>this.closeModal('left')}
                    position="left"
                >
                    <View style={styles.content}>
                        <Text>这个Modal设置了position:left</Text>
                        <Text>并且设置了slideFromLeft效果</Text>
                        <TouchableOpacity onPress={()=>this.closeModal('left')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.noNavBarMask}
                    animation="slideFromRight"
                    onMaskPress={()=>this.closeModal('noNavBarMask')}
                    position="right"
                    showNavBarMask={false}
                >
                    <View style={styles.content}>
                        <Text>这个Modal设置了position:right</Text>
                        <Text>并且设置了slideFromRight效果</Text>
                        <Text>以及showNavBarMask=false</Text>
                        <TouchableOpacity onPress={()=>this.closeModal('noNavBarMask')}>
                            <Text style={styles.closeBtn}>点击关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.actionSheet}
                    animation="slideFromBottom"
                    position="bottom"
                    onMaskPress={()=>this.closeModal('actionSheet')}
                >
                    <View style={styles.actionSheetContent}>
                        <Text>通过配置Modal的位置和动画效果</Text>
                        <Text>可以很轻易地实现一个ActionSheet组件</Text>
                    </View>
                </Modal>
            </View>
        );
    }
}

import commonStyles from '../styles';

let styles = Object.assign({
    actionSheetContent: {
        width: Dimensions.get('window').width,
        height: 200,
        backgroundColor: 'white',
        padding: 20
    },
    content: {
        backgroundColor: 'white',
        padding: 20
    },
    closeBtn: {
        marginTop: 10
    }
}, commonStyles);

module.exports = {
    title: 'Modal',
    examples: [
        {
            render(){

                return <ModalExampleList/>;
            }
        }
    ]
};
