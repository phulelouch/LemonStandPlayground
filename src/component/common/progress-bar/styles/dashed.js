import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    width: width - 20,
    height: 5,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: 'white',
  },
});
