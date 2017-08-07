/* @flow */

import React from 'react';
import { StyleSheet, View, Button, Picker, ScrollView, Text } from 'react-native';
import Modal from 'react-native-modalview';

const items = new Array(100).fill(1);

const ModalWithList = (props) => (
  <Modal
    {...props}
    style={styles.modal}
  >
    <View style={styles.modalContent} >
      <ScrollView>
        {
          items.map((_ , i) => (
            <View key={i} style={styles.item}>
              <Text>Elem {i}</Text>
            </View>
          ))
        }
      </ScrollView>
      <Button
        onPress={props.onClosed}
        title="Close"
      />
    </View >
  </Modal >
);

export default ModalWithList;

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'stretch',
    height: 500,
  },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 300,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    padding: 5,
  },
});
