'use strict'

import React, {
  DeviceInfo,
  AppRegistry,
  Component,
  Text,
  View,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Navigator,
  NativeModules
} from 'qunar-react-native';
import ExampleRender from './ExampleRender';
import styles from './styles';

let componentExamples = {
  Slider: require('./Examples/SliderExample'),
  ProgressView: require('./Examples/ProgressViewExample'),
  Tab: require('./Examples/TabExample'),
  Loading: require('./Examples/LoadingExample'),
  Button: require('./Examples/ButtonExample'),
  TabBar: require('./Examples/TabBarExample'),
  ScrollView: require('./Examples/ScrollViewExample'),
  RefreshControl: require('./Examples/RefreshControlExample'),
  LoadControl: require('./Examples/LoadControlExample'),
  ListView: require('./Examples/ListViewExample'),
  InfiniteListView: require('./Examples/InfiniteListViewExample'),
  QLoading: require('./Examples/QLoadingExample'),
  QLoadingError: require('./Examples/QLoadingErrorExample'),
  TimePicker: require('./Examples/TimePickerExample'),
  Checked: require('./Examples/CheckedExample'),
  Radio: require('./Examples/RadioExample'),
  Modal: require('./Examples/ModalExample')
};

let basicExamples = {

  View: require('./BaseViewExamples/ViewExample'),
  Image: require('./BaseViewExamples/ImageExample'),
  Text: require('./BaseViewExamples/TextExample'),
  TextInput: require('./BaseViewExamples/TextInputExample'),
  Switch: require('./Examples/SwitchExample'),
  // MapView: require('./BaseViewExamples/MapViewExample'),
  // PickerView: require('./Examples/QPickerExample'),
  // CameraView: require('./BaseViewExamples/CameraViewExample'),
  // WebView: require('./BaseViewExamples/WebViewExample'),
};

let apiExamples = {
  StatusBarExample: require('./ApiExamples/StatusBarExample'),
  StorageManagerExample: require('./ApiExamples/StorageManagerExample'),
  QunarApiModuleExapmle: require('./ApiExamples/QunarApiModuleExapmle'),
  ActionSheet: require('./ApiExamples/ActionSheetExample'),
  Alert: require('./ApiExamples/AlertExample'),
  Animated: require('./ApiExamples/AnimatedExample'),
  AnExApp: require('./ApiExamples/AnimatedGratuitousApp/AnExApp'),
  AppState: require('./ApiExamples/AppStateExample'),
  // AsyncStorageExample: require('./ApiExamples/AsyncStorageExample'),  // 会让安卓挂掉
  Border: require('./ApiExamples/BorderExample'),
  // CameraRoll: require('./ApiExamples/CameraRollExample'),
  Clipboard: require('./ApiExamples/ClipboardExample'),
  CookieManager: require('./ApiExamples/CookieManagerExample'),
  Geolocation: require('./ApiExamples/GeolocationExample'),
  Layout: require('./ApiExamples/LayoutExample'),
  NetInfo: require('./ApiExamples/NetInfoExample'),
  PanResponder: require('./ApiExamples/PanResponderExample'),
  PointerEvents: require('./ApiExamples/PointerEventsExample'),
  Timer: require('./ApiExamples/TimerExample'),
  Transform: require('./ApiExamples/TransformExample'),
  VibrationIOS: require('./ApiExamples/VibrationIOSExample'),
  XHR: require('./ApiExamples/XHRExample'),
};

let qrnApiExamples = {
  DeviceInfo: require('./QRNApi/DeviceInfo'),
  LoginManager: require('./QRNApi/LoginManager'),
  CookieManager: require('./QRNApi/CookieManager'),
  CameraRoll: require('./QRNApi/CameraRoll'),
  Toast: require('./QRNApi/Toast'),
  QStatusBar: require('./QRNApi/QStatusBar'),
  QShareExample: require('./ApiExamples/QShareExample'),
}

class BasicDemo extends QView {
  styles = styles;

  static routerPlugin = {
    title: 'Qunar-React-Native Demo',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.list}>
          <View style={styles.noteWrap}>
            <Text style={styles.noteWrapTextIcon}>{'\uf07f'}</Text><Text style={styles.noteWrapText}>BASIC
            COMPONENT</Text>
          </View>
          { this.renderList(basicExamples) }
          <View style={styles.noteWrap}>
            <Text style={styles.noteWrapTextIcon}>{'\uf07f'}</Text><Text style={styles.noteWrapText}>CORE
            COMPONENT</Text>
          </View>
          { this.renderList(componentExamples) }
          <View style={styles.noteWrap}>
            <Text style={styles.noteWrapTextIcon}>{'\uf07f'}</Text><Text style={styles.noteWrapText}>QRN API</Text>
          </View>
          { this.renderList(qrnApiExamples) }
          <View style={styles.noteWrap}>
            <Text style={styles.noteWrapTextIcon}>{'\uf07f'}</Text><Text style={styles.noteWrapText}>RN API</Text>
          </View>
          { this.renderList(apiExamples) }
        </View>
      </ScrollView>
    )
  }

  gotoExample(example) {
    Ext.open('ExampleRender', {
      title: example.title,
      param: {example}
    });
  }

  renderList(examples) {
    return Object.keys(examples).map((exampleName, i) =>
      <TouchableOpacity
        key={i}
        style={styles.listRow}
        onPress={this.gotoExample.bind(this, examples[exampleName])}>
        <Text style={styles.listRowText}>{exampleName}</Text>
      </TouchableOpacity>
    )
  }
}
