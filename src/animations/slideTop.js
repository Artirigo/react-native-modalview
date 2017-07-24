const inputRange = [0, 1];

export const slideTop = ({ animatedValue, content }) => {
  if (animatedValue && content) {
    return {
      opacity: 1,
      transform: [
        { translateX: content.x },
        {
          translateY: animatedValue.interpolate({
            inputRange,
            outputRange: [-content.height, content.y],
          }),
        },
      ],
    };
  }
  return null;
};
