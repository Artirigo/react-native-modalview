// @flow

import React, { PureComponent } from 'react';
import { View, Animated, Easing, Modal } from 'react-native';
import { func } from 'prop-types';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import * as animations from '../../animations';
import { easing } from '../../easing';
import type { EasingType } from '../../easing';

import styles from './styles';

const POSITION = {
  start: 'start',
  center: 'center',
  end: 'end',
};

const modalSupportedOrientations: Array<string> = ['landscape', 'portrait'];

type ViewLayout = {
  x?: number,
  y?: number,
  width?: number,
  height?: number,
};

type ContentStyle = {
  openContentStyle: StyleObj,
  closeContentStyle: StyleObj,
};

type AnimationType = $Keys<typeof animations>;

export type Props = {
  /**
   * open/close the modal
   */
  open?: boolean,
  /**
   * disable open/closing of the modal
   */
  disabled?: boolean,
  /**
   * the children to render inside the modal
   */
  children?: React.Element<any>,
  /**
   * add styles to the modal
   */
  style?: StyleObj,
  /**
   * Rendered under the actual Modal content. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  renderBefore?: ?(ReactClass<any> | React.Element<any>),
  /**
   * vertical position of the modal
   */
  positionVertical?: $Keys<typeof POSITION>,
  /**
   * horizontal position of the modal
   */
  positionHorizontal?: $Keys<typeof POSITION>,
  /**
   * convenience prop to set the animation type for open/close
   */
  animation?: AnimationType,
  /**
   * convenience prop to set the animation duration for open/close/backdrop
   */
  animationDuration?: number,
  /**
   * convenience prop to set the animation easing for open/close/backdrop
   */
  animationEasing?: EasingType,
  /**
   * animation type for opening the modal
   */
  animationIn?: AnimationType,
  /**
   * animation duration for opening the modal
   */
  animationInDuration?: number,
  /**
   * animation easing for opening the modal
   */
  animationInEasing?: EasingType,
  /**
   * animation type for closing the modal
   */
  animationOut?: AnimationType,
  /**
   * animation duration for closing the modal
   */
  animationOutDuration?: number,
  /**
   * animation easing for closing the modal
   */
  animationOutEasing?: EasingType,
  /**
   * use `useNativeDriver` for animations
   */
  animationUseNativeDriver?: boolean,
  /**
   * pan handlers
   */
  panHandlers?: Object,
  /**
   * wrap view in react-native `Modal` to present content above
   * everything else
   */
  overlay?: boolean,
  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string,
  /**
   * invoked on mount and layout changes
   */
  onLayout?: ?() => void,
  /**
   * invoked when content layout changes
   */
  onContentLayout?: ?() => void,
  /**
   * when the modal starts closing
   */
  onClose?: ?() => void,
  /**
   * when the modal is closed completely
   */
  onClosed?: ?() => void,
  /**
   * when the modal starts opening
   */
  onOpen?: ?() => void,
  /**
   * when the modal is opened completely
   */
  onOpened?: ?() => void,
};
type State = {
  isOpen: boolean,
  isOpening: boolean,
  isClosing: boolean,
  isLayouting: boolean,
  openContentStyle: StyleObj,
  closeContentStyle: StyleObj,
};
export type DefaultProps = {
  open: boolean,
  disabled: boolean,
  children: ?React.Element<any>,
  style: ?StyleObj,
  renderBefore: ?(ReactClass<any> | React.Element<any>),
  positionVertical: $Keys<typeof POSITION>,
  positionHorizontal: $Keys<typeof POSITION>,
  animation: AnimationType,
  animationDuration: number,
  animationEasing: EasingType,
  animationIn: ?AnimationType,
  animationInDuration: ?number,
  animationInEasing: ?EasingType,
  animationOut: ?AnimationType,
  animationOutDuration: ?number,
  animationOutEasing: ?EasingType,
  animationUseNativeDriver: boolean,
  panHandlers: ?Object,
  overlay: boolean,
  onLayout: ?() => void,
  onContentLayout: ?() => void,
  onClose: ?() => void,
  onClosed: ?() => void,
  onOpen: ?() => void,
  onOpened: ?() => void,
};

export default class ModalBase extends PureComponent<DefaultProps, Props, State> {
  static defaultProps = {
    open: false,
    disabled: false,
    children: null,
    style: null,
    positionVertical: POSITION.center,
    positionHorizontal: POSITION.center,
    animation: 'slideBottom',
    animationDuration: 300,
    animationEasing: 'easeOut',
    animationIn: null,
    animationInDuration: null,
    animationInEasing: null,
    animationOut: null,
    animationOutDuration: null,
    animationOutEasing: null,
    animationUseNativeDriver: false,
    renderBefore: null,
    overlay: false,
    onLayout: null,
    onContentLayout: null,
    onOpen: null,
    onOpened: null,
    onClose: null,
    onClosed: null,
    panHandlers: null,
  };
  static childContextTypes = {
    modalClose: func,
  };
  props: Props; // eslint-disable-line react/sort-comp
  state: State = {
    ...this._updateAnimationStyles(this.props),
    isOpen: false, //this.props.open,
    isOpening: false,
    isClosing: false,
  };

  // store the layout-promise
  _layoutPromise: any;
  // store the resolve function to be called from event-handler
  _contentLayoutComplete: ?() => void;
  // store the resolve function to be called from event-handler
  _containerLayoutComplete: ?() => void;
  // animated value for modal open/close animation
  _modalAnimatedValue: Animated.Value;
  // reference to the current open animation
  _openAnimation: any;
  // reference to the current open animation
  _closeAnimation: any;
  // layout dimensions of the modal content
  _contentLayout: ?ViewLayout = null;
  // layout dimensions of the container (=screen in most cases)
  _containerLayout: ?ViewLayout = null;

  getChildContext() {
    return {
      modalClose: this.close,
    };
  }

  componentWillMount() {
    const { isOpen } = this.state;

    this._modalAnimatedValue = new Animated.Value(isOpen ? 1 : 0);

    this._layoutPromise = Promise.all([
      new Promise((resolve: () => void) => {
        this._contentLayoutComplete = resolve;
      }),
      new Promise((resolve: () => void) => {
        this._containerLayoutComplete = resolve;
      }),
    ]);

    this._handleOpenClose(this.props);
  }

  componentWillReceiveProps(props: Props) {
    if (this.props.open !== props.open) {
      this._handleOpenClose(props);
    }
  }

  /**
   * open the modal
   */
  open = () => {
    const { disabled } = this.props;
    if (disabled) return;

    const { isOpening, isClosing, isOpen } = this.state;
    const isClosedOrClosing = !isOpen || isClosing;

    if (!isOpening && isClosedOrClosing) {
      // set flag to show the content already
      this.setState({ isLayouting: true });
      // wait for layout-size calculation and start animation afterwards
      this._layoutPromise.then(() => this._animateOpenStart());
    }
  };

  /**
   * close the modal
   */
  close = () => {
    const { disabled } = this.props;
    if (disabled) return;

    const { isOpening, isClosing, isOpen } = this.state;
    const isOpenOrOpening = isOpen || isOpening;

    if (!isClosing && isOpenOrOpening) {
      this._animateCloseStart();
    }
  };

  /**
   * animated to the open-state
   */
  reset = () => {
    const { disabled } = this.props;
    const { isOpen } = this.state;
    if (disabled || !isOpen) return;
    this._animateOpenStart(true);
  };

  updateAnimatedValue = (value: number) => {
    if (this._modalAnimatedValue) {
      this._modalAnimatedValue.setValue(value);
    }
  };

  _handleOpenClose = (props: Props) => {
    if (props.open === undefined) return;
    if (props.open) this.open();
    else this.close();
  };

  _updateAnimationStyles(props: Props): ContentStyle {
    const { style, animationOut, animationIn, animation } = props;

    const contentStyle = [styles.content, style];

    if (this._contentLayout && this._containerLayout) {
      const animationOptions = {
        animatedValue: this._modalAnimatedValue,
        container: this._containerLayout,
        content: this._calculateModalPosition(props),
      };

      return {
        openContentStyle: [...contentStyle, animations[animationIn || animation](animationOptions)],
        closeContentStyle: [
          ...contentStyle,
          animations[animationOut || animation](animationOptions),
        ],
      };
    }

    return {
      openContentStyle: contentStyle,
      closeContentStyle: contentStyle,
    };
  }

  /*
   * Calculate when should be placed the modal
   */
  _calculateModalPosition(props: Props) {
    const { positionVertical, positionHorizontal, onContentLayout } = props;

    let result: ?ViewLayout;

    if (this._contentLayout && this._containerLayout) {
      const containerWidth: number = this._containerLayout.width || 0;
      const containerHeight: number = this._containerLayout.height || 0;

      result = this._contentLayout;
      if (!result.width) result.width = 0;

      // HORIZONTAL

      if (positionHorizontal === POSITION.end) {
        result.x = containerWidth - result.width;
      } else if (positionHorizontal === POSITION.center) {
        result.x = (containerWidth - result.width) / 2;
      } else {
        result.x = 0;
      }

      if (result.x < 0) result.x = 0;
      result.x = Math.floor(result.x);

      // VERTICAL
      if (!result.height) result.height = 0;

      if (positionVertical === POSITION.end) {
        result.y = containerHeight - result.height;
      } else if (positionVertical === POSITION.center) {
        result.y = (containerHeight - result.height) / 2;
      } else {
        result.y = 0;
      }

      if (result.y < 0) result.y = 0;
      result.y = Math.floor(result.y);

      if (onContentLayout) onContentLayout(result);
    }

    return result;
  }

  _isVisible(): boolean {
    const { isOpen, isOpening, isClosing, isLayouting } = this.state;
    return isOpen || isOpening || isClosing || isLayouting;
  }

  //
  // --------------  CLOSE ----------------
  //

  /*
   * Close animation for the modal, will move down
   */
  _animateCloseStart = () => {
    this._animateOpenStop();

    const {
      animationOutDuration,
      animationOutEasing,
      animationDuration,
      animationEasing,
      onClose,
      animationUseNativeDriver,
    } = this.props;
    const { isOpen } = this.state;
    //
    if (isOpen && onClose) onClose();

    this.setState({ isClosing: true, isOpen: false });

    this._closeAnimation = Animated.timing(this._modalAnimatedValue, {
      toValue: 0,
      duration: animationOutDuration || animationDuration,
      easing: easing(animationOutEasing) || easing(animationEasing),
      useNativeDriver: animationUseNativeDriver,
    });
    this._closeAnimation.start(this._animateCloseComplete);
  };

  _animateCloseComplete = ({ finished }) => {
    const { onClosed, overlay, animationUseNativeDriver } = this.props;

    const newState = { isClosing: false };
    let setStateCallback;

    // when using `overlay` and `animationUseNativeDriver` the
    // underlying native view apparently isn't removed immediately
    // therefore when rendering an empty view after closing
    // you'll see the modal-content flashing up for some ms
    // -> we hide the content before removing it
    if (finished && overlay && animationUseNativeDriver) {
      newState.isLayouting = true;
      setStateCallback = () => this.setState({ isLayouting: false });
    }

    //
    this.setState(newState, setStateCallback);

    // manually set animatedValue to the end-value
    // otherwise the value doesn't get updated correctly
    // when using `swipeToClose` and `useNativeDriver`
    if (finished) this._modalAnimatedValue.setValue(0);

    if (finished && onClosed) onClosed();
  };

  /*
   * Stop closing animation
   */
  _animateCloseStop = () => {
    if (this._closeAnimation) {
      this._closeAnimation.stop();
      this._closeAnimation = null;
    }
    this.setState({ isClosing: false });
  };

  //
  // --------------  OPEN ----------------
  //

  /*
   * Open animation for the modal, will move up
   */
  _animateOpenStart = (reset: boolean = false) => {
    this._animateCloseStop();

    const { onOpen } = this.props;
    const { isOpen } = this.state;

    //
    if (!isOpen && onOpen) onOpen();

    if (!reset) this.setState({ isOpening: true, isLayouting: false });

    const {
      animationInDuration,
      animationEasing,
      animationInEasing,
      animationDuration,
      animationUseNativeDriver,
    } = this.props;

    this._openAnimation = Animated.timing(this._modalAnimatedValue, {
      toValue: 1,
      duration: animationInDuration || animationDuration,
      easing: easing(animationInEasing) || easing(animationEasing),
      useNativeDriver: animationUseNativeDriver,
    });
    this._openAnimation.start(this._animateOpenComplete);
  };

  _animateOpenComplete = ({ finished }) => {
    const { onOpened } = this.props;
    const { isOpen } = this.state;

    // manually set animatedValue to the end-value
    // otherwise the value doesn't get updated correctly
    // when using `swipeToDismiss` and `useNativeDriver`
    if (finished) this._modalAnimatedValue.setValue(1);

    this.setState({ isOpening: false, isOpen: true });
    if (!isOpen && finished && onOpened) onOpened();
  };

  /*
   * Stop opening animation
   */
  _animateOpenStop = () => {
    if (this._openAnimation) {
      this._openAnimation.stop();
      this._openAnimation = null;
    }
    this.setState({ isOpening: false });
  };

  //
  // --------------  LAYOUT EVENTS ----------------
  //

  /*
   * Event called when the modal view layout is calculated
   */

  _handleContentLayout = event => {
    this._contentLayout = { ...event.nativeEvent.layout };
    this.setState(this._updateAnimationStyles(this.props));
    if (this._contentLayoutComplete) this._contentLayoutComplete();
  };

  /*
   * Event called when the container view layout is calculated
   */
  _handleContainerLayout = event => {
    const { onLayout } = this.props;
    this._containerLayout = { ...event.nativeEvent.layout };
    this.setState(this._updateAnimationStyles(this.props));
    if (onLayout) onLayout(event);
    if (this._containerLayoutComplete) this._containerLayoutComplete();
  };

  //
  // --------------  RENDER ----------------
  //

  render() {
    const { openContentStyle, closeContentStyle, isOpening, isLayouting } = this.state;
    if (!this._isVisible()) return <View />;

    // openContentStyle and closeContentStyle supply the same style for `_modalAnimatedValue=1`
    // so in general it doesn't matter which of both is attached when in `isOpen` state.
    // But if we have panHandlers assigned we want to see the `animationOut`, therefore
    // we choose to have the `closeContentStyle` atteached.
    const contentStyle = isOpening ? openContentStyle : closeContentStyle;

    const {
      overlay,
      children,
      panHandlers,
      renderBefore: RenderBeforeComponent,
      testID,
    } = this.props;

    let renderBefore;

    if (RenderBeforeComponent) {
      renderBefore = React.isValidElement(RenderBeforeComponent)
        ? RenderBeforeComponent // $FlowFixMe
        : <RenderBeforeComponent />;
    }

    // even with the contentStyle being { opacity:0 } for the initial layout phase
    // you can see the children for a few ms before starting in open animation
    // therefor we also hide the wrapping container in the layout phase
    let contentContainerStyle = styles.contentContainer;
    if (isLayouting) contentContainerStyle = [contentContainerStyle, { opacity: 0 }];

    let content = (
      <View style={styles.container} pointerEvents="box-none" testID={testID}>
        <View style={{ flex: 1 }} pointerEvents="box-none" onLayout={this._handleContainerLayout}>
          {renderBefore}
          {/* content */}
          <View style={contentContainerStyle} pointerEvents="box-none">
            <Animated.View
              onLayout={this._handleContentLayout}
              style={contentStyle}
              {...panHandlers}
            >
              {children}
            </Animated.View>
          </View>
        </View>
      </View>
    );

    // wrap in modal-component
    if (overlay) {
      content = (
        <Modal
          onRequestClose={this.close}
          supportedOrientations={modalSupportedOrientations}
          transparent={true}
          visible={true}
          pointerEvents="box-none"
        >
          {content}
        </Modal>
      );
    }

    return content;
  }
}
