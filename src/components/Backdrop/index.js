// @flow

import React from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import styles from './styles';

type Props = {
  /**
   * the children to render inside
   */
  children?: React.Element<any>,
  /**
   * Override container style
   */
  style?: StyleObj,
  /**
   * callback when pressing on container
   */
  onPress?: () => void,
  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string,
};

const Backdrop = ({ children, onPress, testID, style }: Props) =>
  <TouchableWithoutFeedback onPress={onPress} testID={testID}>
    <Animated.View style={[styles.container, style]}>
      {children}
    </Animated.View>
  </TouchableWithoutFeedback>;

Backdrop.defaultProps = {
  children: null,
  style: null,
  onPress: null,
  testID: null,
};

export default Backdrop;
