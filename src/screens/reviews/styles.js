import {StyleSheet, Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'app-common';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    zIndex: 1,
    paddingTop: Platform.OS !== 'ios' ? getStatusBarHeight() : 0,
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
  header: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    marginTop: 20,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBack: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    tintColor: '#000',
    marginLeft: 16,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 36,
  },
  dataNotFound: {
    marginTop: 50,
    alignSelf: 'center',
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 15,
    color: '#64748b',
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  txtNameRating: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 13,
    lineHeight: 16,
    color: '#777',
    marginTop: 0,
  },
  titleRating: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '500',
  },
  contentRating: {
    marginTop: 5,
    fontFamily: 'Poppins-ExtraLight',
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    fontWeight: '300',
  },
});
