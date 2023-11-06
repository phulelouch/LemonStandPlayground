import { StyleSheet, Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'app-common';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    zIndex: 1,
    paddingTop: Platform.OS !== 'ios' ? getStatusBarHeight() : 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() + 20 : 10,
    // marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FBC815',
    height: Platform.OS === 'ios' ? 100 : 60,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flex: 1,
    height: 40,
    marginLeft: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  inputSearch: {
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#000',
  },
  iconBack: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  imgBanner: {
    width: (276 / 375) * deviceWidth,
    height: (209 / 375) * deviceWidth,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 30,
    marginBottom: 20,
  },

  viewSearch: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },

  iconSearch: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  viewFilter: {
    backgroundColor: '#fff',
    width: 64,
    height: 24,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  txtFilter: {
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    marginRight: 4,
  },
  viewUpdateRole: {
    zIndex: 1000,
    flex: 1,
    position: 'absolute',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: deviceWidth,
    height: deviceHeight,
  },
  viewModalFilter: {
    width: 127,
    height: 131,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  txtFilterItem: {
    marginBottom: 10,
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 15,
    color: '#A9A9A9',
  },
  txtSearch: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  txtItemFilter: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#858585',
  },
  textRecent: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 20,
    color: '#767676',
    flex: 1,
  },
});
