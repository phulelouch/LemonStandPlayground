import { StyleSheet } from 'react-native';
import { Colors, Fonts } from 'app-assets';

const { text, background } = Colors;
export default StyleSheet.create({
  container: {
    borderRadius: 6,
    width: 220,
    marginRight: 8,
    height: 179,
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
    resizeMode: 'cover'
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
  },
  price: {
    fontFamily: "Poppins",
    fontSize: 10,
    lineHeight: 15,
    color: "#000",
    fontWeight: '500',
  },
  rate: {
    fontFamily: "Poppins",
    fontSize: 10,
    lineHeight: 15,
    color: "#fff",
    fontWeight: '500',
    marginLeft: 3,
    marginTop: 2,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 12,
    lineHeight: 18,
    color: "#000",
    fontWeight: '500',
    marginTop: 10,
  },
  content: {
    fontFamily: "Poppins",
    fontSize: 10,
    lineHeight: 15,
    color: "#939393",
    marginTop: 2,
  },
  viewTime: {
    backgroundColor: "#fff", justifyContent: 'center',
    alignItems: 'center',
    width: 26,
    height: 26,
    borderRadius: 6,
    marginRight: 4,
  }
});
