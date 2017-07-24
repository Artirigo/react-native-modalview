const inputRange = [0, 1];

export const slideBottom = ({ animatedValue, container, content }) => {
  if (animatedValue && content) {
    return {
      opacity: 1,
      transform: [
        { translateX: content.x },
        {
          translateY: animatedValue.interpolate({
            inputRange,
            outputRange: [container.height, content.y],
          }),
        },
      ],
    };
  }

  return null;
};
