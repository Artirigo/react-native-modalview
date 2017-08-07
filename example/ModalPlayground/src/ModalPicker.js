/* @flow */

import React from 'react';
import { StyleSheet, View, Button, Picker } from 'react-native';
import Modal from 'react-native-modalview';


const ModalPicker = ({ picker, onClose, value, onChange }) => (
  <Modal
    // overlay
    backdrop
    backdropAnimationEasing="easeOut"
    open={picker}
    style={styles.modal}
    positionVertical="end"
  >
    <View style={styles.modalContent} >
      <Picker
        selectedValue={value}
        onValueChange={onChange} >
        {
          picker && picker.items.map(props => <Picker.Item key={props.value} {...props} />)
        }
      </Picker >
      <Button onPress={onClose} title="Close" />
    </View >
  </Modal >
);

export default ModalPicker;

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'stretch',
  },
  modalContent: {
    backgroundColor: '#f1f1f1',
  },
});
