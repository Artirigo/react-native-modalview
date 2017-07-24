const inputRange = [0, 1];

export const scaleBackground = ({ animatedValue, content }) => {
  if (animatedValue) {
    return {
      opacity: animatedValue,
      transform: [
        { translateX: content.x },
        { translateY: content.y },
        {
          scale: animatedValue.interpolate({
            inputRange,
            outputRange: [0.8, 1],
          }),
        },
      ],
    };
  }

  return null;
};
