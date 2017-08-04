// @flow

import React, { PureComponent, Component } from 'react';
import { Animated } from 'react-native';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import Backdrop from '../components/Backdrop';
import type {
  Props as ModalProps,
  DefaultProps as ModalDefaultProps,
} from '../components/ModalBase';
import { easing } from '../easing';
import type { EasingType } from '../easing';

type Props = {
  /**
   * show/hide backdrop
   */
  backdrop?: boolean,
  /**
   * change backdrop color
   */
  backdropColor?: ?string,
  /**
   * animation duration for opening and closing the backdrop
   * (defaults to using `animationDuration` )
   */
  backdropAnimationDuration?: ?number,
  /**
   * animation easing for opening and closing the backdrop
   * (defaults to using `animationEasing` )
   */
  backdropAnimationEasing?: EasingType,
} & ModalProps;

type DefaultProps = {
  backdrop: boolean,
  backdropColor: ?string,
  backdropAnimationDuration: ?number,
  backdropAnimationEasing: EasingType,
} & ModalDefaultProps;

export default (DecoratedComponent: Class<Component<*, *, *>>) => {
  class WithBackdrop extends PureComponent<DefaultProps, Props, void> {
    static defaultProps = {
      ...(DecoratedComponent.defaultProps || {}),
      backdrop: false,
      backdropColor: null,
      backdropAnimationDuration: null,
      backdropAnimationEasing: null,
    };
    props: Props; // eslint-disable-line react/sort-comp

    _backdropStyle: StyleObj;
    _backdropAnimation: Object;
    _backdropAnimatedValue: Animated.Value;
    _modalRef = null;

    componentWillMount() {
      const { open } = this.props;
      this._backdropAnimatedValue = new Animated.Value(open ? 1 : 0);
      this._backdropStyle = { opacity: this._backdropAnimatedValue };
    }

    open = () => {
      if (this._modalRef) this._modalRef.open();
    };

    close = () => {
      if (this._modalRef) this._modalRef.close();
    };

    reset = () => {
      if (this._modalRef) this._modalRef.reset();
    };

    updateAnimatedValue = (value: number) => {
      if (this._modalRef) this._modalRef.updateAnimatedValue(value);
    };

    /*
   * Open animation for the backdrop, will fade in
   */
    _backdropOpen = () => {
      const {
        backdropAnimationDuration,
        backdropAnimationEasing,
        onOpen,
        animationDuration,
        animationEasing,
        animationUseNativeDriver,
      } = this.props;

      if (this._backdropAnimation) this._backdropAnimation.stop();
      this._backdropAnimation = Animated.timing(this._backdropAnimatedValue, {
        toValue: 1,
        duration: backdropAnimationDuration || animationDuration,
        easing: easing(backdropAnimationEasing) || easing(animationEasing),
        useNativeDriver: animationUseNativeDriver,
      });
      this._backdropAnimation.start();

      // pass-through callback
      if (onOpen) onOpen();
    };

    /*
     * Close animation for the backdrop, will fade out
     */
    _backdropClose = () => {
      const {
        backdropAnimationDuration,
        backdropAnimationEasing,
        onClose,
        animationDuration,
        animationEasing,
        animationUseNativeDriver,
      } = this.props;

      if (this._backdropAnimation) this._backdropAnimation.stop();
      this._backdropAnimation = Animated.timing(this._backdropAnimatedValue, {
        toValue: 0,
        duration: backdropAnimationDuration || animationDuration,
        easing: easing(backdropAnimationEasing) || easing(animationEasing),
        useNativeDriver: animationUseNativeDriver,
      });
      this._backdropAnimation.start();

      // pass-through callback
      if (onClose) onClose();
    };

    _captureRef = ref => {
      this._modalRef = ref;
    };

    _renderBackdrop = () => {
      const { backdropColor } = this.props;

      let style: StyleObj = this._backdropStyle;
      if (backdropColor) {
        style = [style, { backgroundColor: backdropColor }];
      }

      return <Backdrop style={style} />;
    };

    render() {
      const { backdrop, ...otherProps } = this.props;

      return (
        <DecoratedComponent
          {...otherProps}
          ref={this._captureRef}
          renderBefore={backdrop ? this._renderBackdrop : null}
          onOpen={this._backdropOpen}
          onClose={this._backdropClose}
        />
      );
    }
  }

  return WithBackdrop;
};
