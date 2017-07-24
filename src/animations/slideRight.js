const inputRange = [0, 1];

export const slideRight = ({ animatedValue, container, content }) => {
  if (animatedValue && content) {
    return {
      opacity: 1,
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange,
            outputRange: [container.width, content.x],
          }),
        },
        { translateY: content.y },
      ],
    };
  }

  return null;
};
