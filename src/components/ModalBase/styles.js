import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'flex-start',
  },
  content: {
    opacity: 0,
  },
});

export default {
  container: [StyleSheet.absoluteFill, styles.container],
  contentContainer: [StyleSheet.absoluteFill, styles.contentContainer],
};
