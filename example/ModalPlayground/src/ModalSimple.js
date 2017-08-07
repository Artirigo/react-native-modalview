/* @flow */

import React from 'react';
import { StyleSheet, View, Button, Picker } from 'react-native';
import Modal from 'react-native-modalview';

const ModalSimple = (props) => (
  <Modal
    {...props}
    style={styles.modal}
  >
    <View style={styles.modalContent} >
      <Button
        onPress={props.onClosed}
        title="Close"
      />
    </View >
  </Modal >
);

export default ModalSimple;

const styles = StyleSheet.create({
  modal: {
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 50,
  },
});
