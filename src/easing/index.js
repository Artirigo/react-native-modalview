// @flow

import { Easing } from 'react-native';

const EASINGS = {
  linear: Easing.linear,

  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),

  easeInQuad: Easing.in(Easing.quad),
  easeOutQuad: Easing.out(Easing.quad),
  easeInOutQuad: Easing.inOut(Easing.quad),

  easeInCubic: Easing.in(Easing.cubic),
  easeOutCubic: Easing.out(Easing.cubic),
  easeInOutCubic: Easing.inOut(Easing.cubic),

  easeInSine: Easing.in(Easing.sin),
  easeOutSine: Easing.out(Easing.sin),
  easeInOutSine: Easing.inOut(Easing.sin),

  easeInCirc: Easing.in(Easing.circle),
  easeOutCirc: Easing.out(Easing.circle),
  easeInOutCirc: Easing.inOut(Easing.circle),

  easeInExpo: Easing.in(Easing.exp),
  easeOutExpo: Easing.out(Easing.exp),
  easeInOutExpo: Easing.inOut(Easing.exp),

  easeInBounce: Easing.in(Easing.bounce),
  easeOutBounce: Easing.out(Easing.bounce),
  easeInOutBounce: Easing.inOut(Easing.bounce),

  easeInQuart: Easing.in(Easing.poly(4)),
  easeOutQuart: Easing.out(Easing.poly(4)),
  easeInOutQuart: Easing.inOut(Easing.poly(4)),

  easeInQuint: Easing.in(Easing.poly(5)),
  easeOutQuint: Easing.out(Easing.poly(5)),
  easeInOutQuint: Easing.inOut(Easing.poly(5)),

  easeInElastic: Easing.in(Easing.elastic()),
  easeOutElastic: Easing.out(Easing.elastic()),
  easeInOutElastic: Easing.inOut(Easing.elastic()),

  easeInBack: Easing.in(Easing.back()),
  easeOutBack: Easing.out(Easing.back()),
  easeInOutBack: Easing.inOut(Easing.back()),
};

export default EASINGS;

export type EasingType = $Keys<typeof EASINGS> | ((t: number) => number);

export const easing = (e: EasingType) => {
  if (typeof e === 'string') {
    return EASINGS[e];
  }
  return e;
};
