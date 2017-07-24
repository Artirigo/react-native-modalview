// @flow

import React, { PureComponent, Component } from 'react';
import { PanResponder } from 'react-native';
import { lensProp, compose, view } from 'ramda';

import type {
  Props as ModalProps,
  DefaultProps as ModalDefaultProps,
} from '../components/ModalBase';

const SWIPE: Object = {
  down: 'down',
  up: 'up',
  left: 'left',
  right: 'right',
};

const gestureKeyForSwipeDirection: Object = {
  [SWIPE.left]: 'dx',
  [SWIPE.right]: 'dx',
  [SWIPE.up]: 'dy',
  [SWIPE.down]: 'dy',
};
const dimensionKeyForSwipeDirection: Object = {
  [SWIPE.left]: 'width',
  [SWIPE.right]: 'width',
  [SWIPE.up]: 'height',
  [SWIPE.down]: 'height',
};
const signForSwipeDirection: Object = {
  [SWIPE.left]: -1,
  [SWIPE.right]: 1,
  [SWIPE.up]: -1,
  [SWIPE.down]: 1,
};
const swipeDirectionForAnimation: Object = {
  fade: SWIPE.down,
  scaleBackground: SWIPE.down,
  scaleForeground: SWIPE.up,
  slideBottom: SWIPE.down,
  slideLeft: SWIPE.left,
  slideRight: SWIPE.right,
  slideTop: SWIPE.up,
};

type Props = {
  /**
   * enable/disable swipe-to-close functionality
   */
  swipeToDismiss?: boolean,
  /**
   * threshold to reach in pixels to close the modal
   */
  swipeThreshold?: number,
  /**
   * height in pixels of the swipeable area
   * by default the whole modal is swipeable
   */
  swipeArea?: number,
} & ModalProps;

type DefaultProps = {
  swipeToDismiss: boolean,
  swipeThreshold: number,
  swipeArea: ?number,
} & ModalDefaultProps;

type ViewSize = {
  width?: ?number,
  height?: ?number,
};

export default (DecoratedComponent: Class<Component<*, *, *>>) => {
  class WithSwipeToDismiss extends PureComponent<DefaultProps, Props, void> {
    static defaultProps = {
      ...(DecoratedComponent.defaultProps || {}),
      swipeThreshold: 50,
      swipeArea: null,
      swipeToDismiss: false,
    };
    props: Props; // eslint-disable-line react/sort-comp

    _panResponder: ?Object;
    _containerLayout: ?ViewSize;

    componentWillMount() {
      this._createPanResponder();
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
     * Create the pan responder to detect gesture
     * Only used if swipeToDismiss is enabled
     */
    _createPanResponder = () => {
      if (this._panResponder) return;

      let gestureToAnimatedValue: (gestureState: Object) => number;
      let swipeHitThreshold: (gestureState: Object) => boolean;
      let shouldPan: (gestureState: Object) => boolean;

      const onPanRelease = (evt, gestureState) => {
        if (shouldPan(gestureState)) {
          if (swipeHitThreshold(gestureState)) this.close();
          else this.reset();
        }
      };

      this._panResponder = PanResponder.create({
        onPanResponderGrant: () => {
          // $FlowFixMe
          const { animationOut, animation, swipeThreshold } = this.props;

          const anim: string = animationOut || animation;
          const swipeDirection: string = swipeDirectionForAnimation[anim];
          const dimensionKey: string = dimensionKeyForSwipeDirection[swipeDirection];
          const panSign: number = signForSwipeDirection[swipeDirection];

          // animated value is percentual (0-1) therefore devide  the
          // actual gesture distance by width/height of the container
          const containerSize: number =
            (this._containerLayout && this._containerLayout[dimensionKey]) || 0;

          const getGestureValue = view(lensProp(gestureKeyForSwipeDirection[swipeDirection]));

          const getGestureValueAbs = compose(
            // get absolute value
            Math.abs,
            // get prop from gestureState
            getGestureValue,
          );

          swipeHitThreshold = compose(
            //
            (value: number) => value > swipeThreshold,
            getGestureValueAbs,
          );

          //
          gestureToAnimatedValue = compose(
            //
            (value: number) => 1 - value / containerSize,
            getGestureValueAbs,
          );

          shouldPan = compose((sign: number) => panSign === sign, Math.sign, getGestureValue);
        },

        onStartShouldSetPanResponderCapture: event => {
          // use capture phase to force grabbing the pan-responder
          // when in swipeable-area to prevent underlying buttons
          // to get the pan-responder
          const { swipeArea } = this.props;
          return swipeArea && event.nativeEvent.locationY <= swipeArea;
        },

        onStartShouldSetPanResponder: event => {
          const { swipeToDismiss, disabled, swipeArea } = this.props;
          return (
            swipeToDismiss && !disabled && (!swipeArea || event.nativeEvent.locationY <= swipeArea)
          );
        },
        onPanResponderMove: (event, gestureState) => {
          if (shouldPan(gestureState)) {
            this.updateAnimatedValue(gestureToAnimatedValue(gestureState));
          }
        },
        onPanResponderRelease: onPanRelease,
        onPanResponderTerminate: onPanRelease,
      });
    };

    _handleLayout = event => {
      const { onLayout } = this.props;
      this._containerLayout = { ...event.nativeEvent.layout };
      if (onLayout) onLayout(event);
    };

    _modalRef = null;
    _captureRef = ref => {
      this._modalRef = ref;
    };

    render() {
      const { ...otherProps } = this.props;

      const panHandlers = this._panResponder && this._panResponder.panHandlers;

      return (
        <DecoratedComponent
          {...otherProps}
          ref={this._captureRef}
          panHandlers={panHandlers}
          onLayout={this._handleLayout}
        />
      );
    }
  }

  return WithSwipeToDismiss;
};
