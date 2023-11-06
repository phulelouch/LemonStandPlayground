import { StyleSheet } from 'react-native';
import { Colors } from 'app-assets';

const { text } = Colors;
export default StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // marginVertical: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  contentContainer: {
    height: 108,
    flexDirection: 'row',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
    height: 128,
    marginLeft: 10,
    marginRight: 10,
  },
  imageBackground: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    width: 108,
    height: 108,
  },
  smallContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

});
