import React, { PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Switch,
  TextInput,
} from 'react-native';

import ModalPicker from './ModalPicker';
import ModalSimple from './ModalSimple';
import ModalWithList from './ModalWithList';
import Banner from './Banner';

const TYPES = {
  SIMPLE: 'simple',
  LIST: 'list',
};

const modalTypes = {
  [TYPES.SIMPLE]: ModalSimple,
  [TYPES.LIST]: ModalWithList,
};


export default class App extends PureComponent {
  state = {
    open: false,
    disabled: false,
    positionVertical: 'center',
    positionHorizontal: 'center',
    animation: 'slideBottom',
    animationDuration: 300,
    animationEasing: 'easeOut',
    animationIn: null,
    animationInDuration: null,
    animationInEasing: null,
    animationOut: null,
    animationOutDuration: null,
    animationOutEasing: null,
    animationUseNativeDriver: true,
    backdrop: true,
    backdropClickToClose: true,
    backdropColor: '#00000099',
    backdropAnimationDuration: null,
    backdropAnimationEasing: null,
    swipeToDismiss: true,
    swipeThreshold: null,
    swipeArea: null,
    renderBefore: null,
    overlay: false,
    onLayout: null,
    onOpen: null,
    onOpened: null,
    onClose: null,
    onClosed: null,
    panHandlers: null,
    modalType: TYPES.SIMPLE,
  };

  _handlePickerOpen = (field, items) => () => {
    this.setState({ picker: { field, items } });
  };

  _handlePickerClose = () => {
    this.setState({ picker: null });
  };

  _handleOpen = () => {
    this.setState({ open: true });
  };

  _handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { picker, modalType, ...otherState } = this.state;
    const Modal = modalTypes[modalType];
    return (
      <View style={styles.container} >
        <StatusBar
          backgroundColor="#ec6608"
          barStyle="dark-content"
        />
        <Banner />
        <ScrollView >
          <View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Modal Type</Text >
              <Button onPress={this._handlePickerOpen('modalType', pickerModalType)}
                title={this.state.modalType} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Swipe To Dismiss</Text >
              <Switch
                value={this.state.swipeToDismiss}
                onValueChange={swipeToDismiss => this.setState({ swipeToDismiss })}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Swipe Threshold</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ swipeThreshold: parseInt(value) || null })}
                value={String(this.state.swipeThreshold || 0)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Swipe Area</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ swipeArea: parseInt(value) || null })}
                value={String(this.state.swipeArea || 0)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Backdrop</Text >
              <Switch
                value={this.state.backdrop}
                onValueChange={backdrop => this.setState({ backdrop })}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Backdrop Click To Close</Text >
              <Switch
                value={this.state.backdropClickToClose}
                onValueChange={backdropClickToClose => this.setState({ backdropClickToClose })}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Backdrop Color</Text >
              <TextInput
                style={styles.input}
                onChangeText={value => this.setState({ backdropColor: value || null })}
                value={String(this.state.backdropColor)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Backdrop Animation Easing</Text >
              <Button onPress={this._handlePickerOpen('backdropAnimationEasing', pickerEasings)}
                title={this.state.backdropAnimationEasing || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Backdrop Animation Duration</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ backdropAnimationDuration: parseInt(value) || null })}
                value={String(this.state.backdropAnimationDuration || 0)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Overlay</Text >
              <Switch
                value={this.state.overlay}
                onValueChange={overlay => this.setState({ overlay })}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Native Animation</Text >
              <Switch
                value={this.state.animationUseNativeDriver}
                onValueChange={animationUseNativeDriver => this.setState({ animationUseNativeDriver })}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation</Text >
              <Button onPress={this._handlePickerOpen('animation', pickerAnimation)}
                title={this.state.animation || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation Easing</Text >
              <Button onPress={this._handlePickerOpen('animationEasing', pickerEasings)}
                title={this.state.animationEasing || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation Duration</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ animationDuration: parseInt(value) || null })}
                value={String(this.state.animationDuration || 0)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation In</Text >
              <Button onPress={this._handlePickerOpen('animationIn', pickerAnimation)}
                title={this.state.animationIn || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation In Easing</Text >
              <Button onPress={this._handlePickerOpen('animationInEasing', pickerEasings)}
                title={this.state.animationInEasing || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation In Duration</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ animationInDuration: parseInt(value) || null })}
                value={String(this.state.animationInDuration || 0)}
              />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation Out</Text >
              <Button onPress={this._handlePickerOpen('animationOut', pickerAnimation)}
                title={this.state.animationOut || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation Out Easing</Text >
              <Button onPress={this._handlePickerOpen('animationOutEasing', pickerEasings)}
                title={this.state.animationOutEasing || 'none'} />
            </View >
            <View style={styles.row} >
              <Text style={styles.rowLabel} >Animation Out Duration</Text >
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={value => this.setState({ animationOutDuration: parseInt(value) || null })}
                value={String(this.state.animationOutDuration || 0)}
              />
            </View >
          </View >
        </ScrollView >
        <View style={styles.footer} >
          <Button
            onPress={this._handleOpen}
            title="Open Modal"
          />
        </View >
        <Modal
          {...otherState}
          onClosed={this._handleClose}
        />
        <ModalPicker
          picker={picker}
          value={picker && this.state[picker.field]}
          onClose={this._handlePickerClose}
          onChange={(value) => this.setState({ [picker.field]: value })}
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
  },
  rowLabel: {
    flex: 1,
  },
  input: {
    height: 25,
    flex: 0.6,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'right',
    padding: 5,
  },
  footer: {
    backgroundColor: '#ec6608',
  },
});

const pickerModalType = [
  { label: TYPES.SIMPLE, value: TYPES.SIMPLE },
  { label: TYPES.LIST, value: TYPES.LIST },
];

const pickerAnimation = [
  { label: 'slideTop', value: 'slideTop' },
  { label: 'slideBottom', value: 'slideBottom' },
  { label: 'slideLeft', value: 'slideLeft' },
  { label: 'slideRight', value: 'slideRight' },
  { label: 'scaleBackground', value: 'scaleBackground' },
  { label: 'scaleForeground', value: 'scaleForeground' },
  { label: 'none', value: null },
];

const pickerEasings = [
  { label: 'linear', value: 'linear' },
  { label: 'easeIn', value: 'easeIn' },
  { label: 'easeOut', value: 'easeOut' },
  { label: 'easeInOut', value: 'easeInOut' },
  { label: 'easeInQuad', value: 'easeInQuad' },
  { label: 'easeOutQuad', value: 'easeOutQuad' },
  { label: 'easeInOutQuad', value: 'easeInOutQuad' },
  { label: 'easeInCubic', value: 'easeInCubic' },
  { label: 'easeOutCubic', value: 'easeOutCubic' },
  { label: 'easeInOutCubic', value: 'easeInOutCubic' },
  { label: 'easeInSine', value: 'easeInSine' },
  { label: 'easeOutSine', value: 'easeOutSine' },
  { label: 'easeInOutSine', value: 'easeInOutSine' },
  { label: 'easeInCirc', value: 'easeInCirc' },
  { label: 'easeOutCirc', value: 'easeOutCirc' },
  { label: 'easeInOutCirc', value: 'easeInOutCirc' },
  { label: 'easeInExpo', value: 'easeInExpo' },
  { label: 'easeOutExpo', value: 'easeOutExpo' },
  { label: 'easeInOutExpo', value: 'easeInOutExpo' },
  { label: 'easeInBounce', value: 'easeInBounce' },
  { label: 'easeOutBounce', value: 'easeOutBounce' },
  { label: 'easeInOutBounce', value: 'easeInOutBounce' },
  { label: 'easeInQuart', value: 'easeInQuart' },
  { label: 'easeOutQuart', value: 'easeOutQuart' },
  { label: 'easeInOutQuart', value: 'easeInOutQuart' },
  { label: 'easeInQuint', value: 'easeInQuint' },
  { label: 'easeOutQuint', value: 'easeOutQuint' },
  { label: 'easeInOutQuint', value: 'easeInOutQuint' },
  { label: 'easeInElastic', value: 'easeInElastic' },
  { label: 'easeOutElastic', value: 'easeOutElastic' },
  { label: 'easeInOutElastic', value: 'easeInOutElastic' },
  { label: 'easeInBack', value: 'easeInBack' },
  { label: 'easeOutBack', value: 'easeOutBack' },
  { label: 'easeInOutBack', value: 'easeInOutBack' },
  { label: 'none', value: null },
];