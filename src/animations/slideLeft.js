const inputRange = [0, 1];

export const slideLeft = ({ animatedValue, content }) => {
  if (animatedValue && content) {
    return {
      opacity: 1,
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange,
            outputRange: [-content.width, content.x],
          }),
        },
        { translateY: content.y },
      ],
    };
  }

  return null;
};
