export const fade = ({ animatedValue, content }) => {
  if (animatedValue && content) {
    return {
      opacity: animatedValue,
      transform: [{ translateX: content.x }, { translateY: content.y }],
    };
  }

  return null;
};
