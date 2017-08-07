# react-native-modalview

[![npm version](https://badge.fury.io/js/react-native-modalview.svg)](https://badge.fury.io/js/react-native-modalview)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
 
An advanced and composable Modal component for react-native

## Features

- Very modular through composable components
- all features are easy to toggle on/off via props
- Smooth open/close animations
- Extendable with own animations/easings/...
- Customizable backdrop opacity, color, duration and easing
- Event listeners for the modal states `onOpen`, `onOpened`, `onClose`, `onClosed`

## Demo

coming soon

## Setup

This library is available on npm, install it with: `npm install --save react-native-modalview` or `yarn add react-native-modalview`.

## Usage

Use all of the features or toggle features on and off via props;

```javascript
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modalview'

export default class ModalTester extends Component {
  state = {
    showModal: false
  }

  _showModal = () => this.setState({ showModal: true })

  _hideModal = () => this.setState({ showModal: false })

  render () {
    const { showModal } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this._showModal}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
        <Modal 
          open={showModal}
          backdrop={true}
          swipeToDismiss={true}
          onClosed={this._hideModal}
        >
          <View style={{ backgroundColor: '#fff' }}>
            <Text>Hello!</Text>
          </View>
        </Modal>
      </View>
    )
  }

}
```

If you don't need all the functionality like `backdrop` or `swipeToDismiss` you can also 
import the base components and compose the Modal without this functionality or extend it with 
your own.


```javascript
import { ModalBase, withBackdrop} from 'react-native-modalview'
import { compose } from 'ramda';

const Modal = compose(
  withBackdrop, 
)(ModalBase);
```


## Props

`ModalBase`

| Name | Type| Default | Description |
| --- | --- | --- | --- |
| open | `bool` | false | open/close the modal |
| disabled | `bool` | false | disable open/closing of the modal |
| children | `node` | **REQUIRED** | The modal content |
| style | `any` | null | Style applied to the modal |
| positionVertical | `string` | 'center' | vertical position of the modal. possible values: 'start', 'center', 'end'  |
| positionHorizontal | `string` | 'center' | horizontal position of the modal. possible values: 'start', 'center', 'end'  |
| animation | `string` | 'slideBottom' | convenience prop to set the animation type for open/close.  |
| animationDuration | `number` | 300 | convenience prop to set the animation duration for open/close/backdrop  |
| animationEasing | `string` | 'easeOut' | convenience prop to set the animation easing for open/close/backdrop  |
| animationIn | `string` | `animation` | animation type for opening the modal  |
| animationInDuration | `string` | `animationDuration` | animation duration for opening the modal  |
| animationInEasing | `string | func` | `animationEasing` | animation easing for opening the modal  |
| animationOut | `string` | `animation` | animation type for closing the modal  |
| animationOutDuration | `string` | `animationDuration` | animation duration for closing the modal  |
| animationOutEasing | `string | func` | `animationEasing` | animation easing for closing the modal  |
| animationUseNativeDriver | `bool` | false | use `useNativeDriver` for animations  |
| overlay | `bool` | false | wrap view in react-native `Modal` to present content above everything else  |
| testID | `string` | null | Used to locate this view in end-to-end tests.  |

`withBackdrop`

| Name | Type| Default | Description |
| --- | --- | --- | --- |
| backdrop | `bool` | false | show/hide backdrop  |
| backdropClickToClose | `bool` | false | close modal by clicking on backdrop  |
| backdropColor | `string` | #00000099 | change backdrop color  |
| backdropAnimationDuration | `string` | `animationDuration` | animation duration for opening and closing the backdrop  |
| backdropAnimationEasing | `string | func` | `animationEasing` | animation easing for opening and closing the backdrop  |

`withSwipeToDismiss`

| Name | Type| Default | Description |
| --- | --- | --- | --- |
| swipeToDismiss | `bool` | false | enable/disable swipe-to-dismiss functionality  |
| swipeThreshold | `number` | 50 | threshold to reach in pixels to close the modal  |
| swipeArea | `number` | null | width/height in pixels of the swipeable area. By default the whole modal is swipeable.  |


## Events

| Name | Type| Default | Description |
| --- | --- | --- | --- |
| onLayout | `func` | null | invoked on mount and layout changes |
| onContentLayout | `func` | null | invoked when content layout changes |
| onClose | `func` | null | invoked when the modal starts closing |
| onClosed | `func` | null | invoked when the modal is closed completely |
| onOpen | `func` | null | invoked when the modal starts opening |
| onOpened | `func` | null | invoked when the modal is opened completely |


## Animations

- `fade`
- `slideBottom`
- `slideTop`
- `slideRight`
- `slideLeft`
- `scaleBackground`
- `scaleForeground`
- custom animation `func`


## Easings

- `linear`
- `easeIn`
- `easeOut`
- `easeInOut`
- `easeInQuad`
- `easeOutQuad`
- `easeInOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInSine`
- `easeOutSine`
- `easeInOutSine`
- `easeInCirc`
- `easeOutCirc`
- `easeInOutCirc`
- `easeInExpo`
- `easeOutExpo`
- `easeInOutExpo`
- `easeInBounce`
- `easeOutBounce`
- `easeInOutBounce`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `easeInElastic`
- `easeOutElastic`
- `easeInOutElastic`
- `easeInBack`
- `easeOutBack`
- `easeInOutBack`
- custom easing `func`


## TODO

- [ ] usage examples
- [ ] unit-tests
- [ ] demo gifs