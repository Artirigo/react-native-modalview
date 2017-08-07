/* @flow */

import React from 'react';

import { Platform, StyleSheet, Text, View } from 'react-native';

const Banner = () => (
  <View style={styles.banner} >
    <Text style={styles.title} >React Modal Playground</Text >
  </View >
);

export default Banner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ec6608',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 36 : 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '200',
    color: '#fff',
    margin: 8,
    textAlign: 'center',
  },
});
