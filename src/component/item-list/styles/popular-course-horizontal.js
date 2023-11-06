import { StyleSheet } from 'react-native';
import { Colors, Fonts } from 'app-assets';

const { text, background } = Colors;
export default StyleSheet.create({
  container: {
    borderRadius: 6,
    width: 220,
    marginRight: 8,
    minHeight: 179,
    backgroundColor: '#fff',

    // marginVertical: 8,
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
  },
  item: { marginHorizontal: 12, flex: 1 },
  smallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  image: {
    width: 220,
    height: 134,
    borderRadius: 6,
    resizeMode: 'cover',
    backgroundColor: '#E5E5E5',
  },
  price: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 15,
    color: '#000',
    fontWeight: '500',
  },
  oldPrice: {
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    color: '#B0B0B0',
    textDecorationLine: 'line-through',
    marginLeft: 13,
  },
  rate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 15,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 3,
    marginTop: 2,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000',
    fontWeight: '500',
    marginTop: 10,
  },
  content: {
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
    marginTop: 2,
  },
  txtSale: {
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    color: '#fff',
  },
});
