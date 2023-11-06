import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    // height: 100,
    // padding: 20,
    marginBottom: 15,
    flexDirection: 'row',

    // marginVertical: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 10,
  },
  item: { marginHorizontal: 12, flex: 1 },
  smallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 14,
    resizeMode: 'cover',
    backgroundColor: '#E5E5E5',
  },

  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
    fontWeight: '500',
  },
  childTitle: {
    fontFamily: 'Poppins',
    fontSize: 9,
    lineHeight: 13,
    color: '#A8A8A8',
    marginTop: 2,
    marginRight: 10,
  },
  avatar: {
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: '#D2D2D2',
  },
  viewContent: {
    marginLeft: 20,
    flex: 1,
  },
  content: {
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
    marginTop: 2,
  },
  txt1: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    marginTop: 7,
    marginBottom: 10,
  },
  txtPass: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#56C943',
  },
  txtFail: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#FF6161',
  },
  txtProgress: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#58C3FF',
  },
});
