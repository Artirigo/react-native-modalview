const inputRange = [0, 1];

export const scaleForeground = ({ animatedValue, content }) => {
  if (animatedValue) {
    return {
      opacity: animatedValue,
      transform: [
        { translateX: content.x },
        { translateY: content.y },
        {
          scale: animatedValue.interpolate({
            inputRange,
            outputRange: [1.2, 1.0],
          }),
        },
      ],
    };
  }

  return null;
};
