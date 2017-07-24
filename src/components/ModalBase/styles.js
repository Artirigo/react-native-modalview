import { StyleSheet } from 'react-native';
import { mergeStyleSheets } from 'artirigo-library/lib/util/react';

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

export default mergeStyleSheets(
  {
    container: StyleSheet.absoluteFill,
    contentContainer: StyleSheet.absoluteFill,
  },
  styles,
);
