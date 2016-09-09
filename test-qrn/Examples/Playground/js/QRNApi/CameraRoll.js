'use strict';

import React, {Component, View, Text, Button, CameraRoll, StyleSheet, Image, Toast, ImageUploader, Slider, Radio} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    button: {
        flex: 1,
        margin: 10,
    },
    textContainer: {
        margin: 10,
    },
    textRow: {
        flexDirection: 'row',
        padding: 5,
    },
    textLeft: {
        width: 100,
    },
    textMiddle: {
        width: 50,
    },
    textRight: {
        flex: 1
    },
})

class CameraRollDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            savedPhoto: null,
            uploadedPhoto: null,
            maxWidth: 200,
            noMaxWidth: false,
            maxHeight: 200,
            noMaxHeight: false,
            quality: 100,
        }

        this.photoNum = 5;
        this.photoGroups = {};
    }

    getPhotoGroups() {
        CameraRoll.getPhotoGroups((data)=>{
            for(let i = 0, len = data.length; i < len; i++) {
                data[i].photo = [];
                data[i].hasMore = true;
                data[i].endCursor = null;
            }
            this.setState({
                groups: data,
            });
        }, (err)=>{
            this.setState({
                groups: [],
            })
        })
    }

    getPhotosFromGroup(index) {
        let item = this.state.groups[index],
            id = item.id;

        let _param = {
            first: this.photoNum,
        };

        if(item.hasMore && item.endCursor) {
            _param.after = item.endCursor;
        }

        CameraRoll.getPhotosFromGroup(id, _param, albumData => {
            item.photo = item.photo.concat(albumData.edges);
            item.hasMore = albumData.page_info.has_next_page;
            item.endCursor = albumData.page_info.end_cursor;

            Toast.show('获取相册 ' + id + ' 图片成功！');

            this.setState({
                groups: this.state.groups,
            });
        }, err => {
            Toast.show('获取相册详情失败！');
            this.setState({
                groups: this.state.groups,
            });
        });
    }

    clearPhotosFromGroup(index) {
        let item = this.state.groups[index];

        item.photo = [];
        item.endCursor = null;
        item.hasMore = true;

        this.setState({
            groups: this.state.groups,
        });
    }

    takePhotoAndSave() {
        CameraRoll.takePhotoAndSave(photo => {
            this.setState({
                savedPhoto: photo,
            });
        }, err => {
            Toast.show(err.message);
        })
    }

    uploadImage() {
        var option = {
            serverAddress: 'http://192.168.113.155:9999/upload',
            // fileKey: 'Filedata',
            quality: this.state.quality,
         };

         if(!this.state.noMaxWidth) {
             option.maxWidth = this.state.maxWidth;
         }
         if(!this.state.noMaxHeight) {
             option.maxHeight = this.state.maxHeight;
         }

        ImageUploader.uploadImage(this.state.savedPhoto.uri, option, (responseData)=>{
            let data;

            try{
                data = JSON.parse(responseData);
            } catch(e) {

            }
            if(data && data.ret)
            this.setState({
                uploadedPhoto: {
                    uri: data.data,
                }
            });
            Toast.show('上传成功!');
        },err=>{
            console.log('error', err);
            Toast.show('上传失败!');
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button text="获取用户相册信息" style={styles.button} onPress={()=>this.getPhotoGroups()}/>
                </View>
                {
                    this.state.groups.map((item, index) => {
                        return (
                            <View>
                                <View key={index} style={[styles.textRow, {backgroundColor: index % 2 == 1 ? '#ffffff' : '#eeeeee'}]}>
                                    <View style={styles.textLeft}><Text>{item.name}</Text></View>
                                    <View style={styles.textMiddle}><Text>{item.count}</Text></View>
                                    <View style={styles.textRight}><Text>{item.id}</Text></View>
                                </View>
                                {
                                    item.photo && item.photo.map((_item, _index) => {
                                        return <Image style={{height: 200, width: 200 * _item.node.image.width / _item.node.image.height }} source={{uri: _item.node.image.uri}} />
                                    })
                                }
                                {
                                    item.hasMore && item.count > 0 ? <Button text="获取5张图片" style={{margin: 5}} onPress={()=>this.getPhotosFromGroup(index)}/> : null
                                }
                                {
                                    !item.hasMore && item.count > 0 ? <Button text="关闭全部图片" style={{margin: 5}} onPress={()=>this.clearPhotosFromGroup(index)}/> : null
                                }
                            </View>
                        );
                    })
                }
                <View style={styles.buttonContainer}>
                    <Button text="拍照" style={styles.button} onPress={()=>this.takePhotoAndSave()}/>
                </View>
                {
                    this.state.savedPhoto ? (
                        <View style={{alignItems: 'center'}}>
                            <Text>拍摄的照片：</Text>
                            <Image style={{height: 300, width: 300 * this.state.savedPhoto.width / this.state.savedPhoto.height }} source={{uri: this.state.savedPhoto.uri}}/>
                        </View>
                    ) : null
                }
                {
                    this.state.savedPhoto ? (
                        <View>
                            <View style={styles.buttonContainer}>
                                <Button text="上传照片" style={styles.button} onPress={()=>this.uploadImage()}/>
                            </View>
                            <View style={styles.sliderContainer}>
                                <Text style={{width: 100}}>maxWidth: {this.state.noMaxWidth ? '' : this.state.maxWidth}</Text>
                                <Radio hasBorder checked={this.state.noMaxWidth}/>
                                <Text style={{width: 30}} onPress={()=>this.setState({noMaxWidth: !this.state.noMaxWidth})}>不限</Text>
                                {
                                    this.state.noMaxWidth ? null : <View style={{flex:1, marginTop: 5,}}>
                                        <Slider
                                            step={10}
                                            value={this.state.maxWidth}
                                            minimumValue={50}
                                            maximumValue={500}
                                            onValueChange={v=>this.setState({maxWidth: v})}
                                        />
                                    </View>
                                }
                            </View>
                            <View style={styles.sliderContainer}>
                                <Text style={{width: 100}}>maxWidth: {this.state.noMaxHeight ? '' : this.state.maxHeight}</Text>
                                <Radio hasBorder checked={this.state.noMaxHeight}/>
                                <Text style={{width: 30}} onPress={()=>this.setState({noMaxHeight: !this.state.noMaxHeight})}>不限</Text>
                                {
                                    this.state.noMaxHeight ? null : <View style={{flex:1, marginTop: 5,}}>
                                        <Slider
                                            step={10}
                                            value={this.state.maxHeight}
                                            minimumValue={50}
                                            maximumValue={500}
                                            onValueChange={v=>this.setState({maxHeight: v})}
                                        />
                                    </View>
                                }
                            </View>
                            <View style={styles.sliderContainer}>
                                <Text style={{width: 150}}>quality: {this.state.quality}</Text>
                                <View style={{flex:1, marginTop: 5,}}>
                                    <Slider
                                        step={10}
                                        value={this.state.quality}
                                        minimumValue={10}
                                        maximumValue={100}
                                        onValueChange={v=>this.setState({quality: v})}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : null
                }
                {
                    this.state.uploadedPhoto ? (
                        <View style={{alignItems: 'center'}}>
                            <Text>上传的照片：</Text>
                            <Image style={{height: 300, width: 300 * this.state.savedPhoto.width / this.state.savedPhoto.height }} source={{uri: this.state.uploadedPhoto.uri}}/>
                        </View>
                    ) : null
                }
            </View>
        );
    }
}

module.exports = {
    title: 'CameraRoll',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <CameraRollDemo />
            );
        },
    }]
};
