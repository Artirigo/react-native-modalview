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

const posKeyForSwipeDirection: Object = {
  [SWIPE.left]: 'x',
  [SWIPE.right]: 'x',
  [SWIPE.up]: 'y',
  [SWIPE.down]: 'y',
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

type ViewLayout = {
  x?: number,
  y?: number,
  width?: number,
  height?: number,
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
    _contentLayout: ?ViewLayout;
    _containerLayout: ?ViewLayout;

    componentWillMount() {
      const { swipeToDismiss } = this.props;
      if (swipeToDismiss) this._createPanResponder();
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

      const isInSwipeArea = event => {
        const { animationOut, animation, swipeArea } = this.props;

        const anim: string = animationOut || animation;
        const swipeDirection: string = swipeDirectionForAnimation[anim];
        const dimensionKey: string = dimensionKeyForSwipeDirection[swipeDirection];
        const posKey: string = posKeyForSwipeDirection[swipeDirection];
        const panSign: number = signForSwipeDirection[swipeDirection];
        const localPosition: number =
          event.nativeEvent[`page${posKey.toUpperCase()}`] - this._contentLayout[posKey];

        if (panSign < 0) return localPosition >= this._contentLayout[dimensionKey] - swipeArea;
        return localPosition <= swipeArea;
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

          const getGestureValue = view(lensProp(`d${posKeyForSwipeDirection[swipeDirection]}`));

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
          const { swipeArea, swipeToDismiss, disabled } = this.props;
          if (!swipeToDismiss || disabled) return false;
          if (swipeArea) return isInSwipeArea(event);
          return false;
        },

        onStartShouldSetPanResponder: event => {
          const { swipeToDismiss, disabled, swipeArea } = this.props;
          if (!swipeToDismiss || disabled) return false;
          return !swipeArea || isInSwipeArea(event);
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

    _handleContentLayout = (layout: ViewLayout) => {
      this._contentLayout = { ...layout };
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
          onContentLayout={this._handleContentLayout}
        />
      );
    }
  }

  return WithSwipeToDismiss;
};
