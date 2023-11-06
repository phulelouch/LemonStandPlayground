import {StyleSheet, Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'app-common';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const isIos = Platform.OS === 'ios';
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Platform.OS !== 'ios' ? getStatusBarHeight() : 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgBanner: {
    width: deviceWidth,
    height: (198 / 375) * deviceWidth,
    resizeMode: 'contain',
    position: 'absolute',
    top: -20,
    zIndex: -1,
  },
  iconHome: {
    width: 115,
    height: 30,
    resizeMode: 'contain',
  },
  iconHeader: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  imgBottom: {
    width: deviceWidth,
    height: (440 / 1500) * deviceWidth,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textBottom: {
    marginTop: 40,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Sniglet-Regular',
    fontWeight: '400',
  },
  logo: {
    height: (98 / 375) * deviceWidth,
    width: (73 / 375) * deviceWidth,
    resizeMode: 'contain',
    // position: "absolute",
  },
  viewLogo: {
    alignSelf: 'center',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'Sniglet-Regular',
  },
  containerImg: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: '#000',
  },
  textInput: {
    flex: 1,
    color: '#000',
    backgroundColor: '#F3F3F3',
    height: 45,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 15,
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
    top: deviceHeight / 2 - 20,
  },
  nextButton: {
    height: (264 / 375) * deviceWidth,
    width: (264 / 375) * deviceWidth,
    resizeMode: 'contain',
  },
  iconBack: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  fullname: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  email: {
    fontSize: 13,
    color: '#929292',
    lineHeight: 19,
    fontFamily: 'Poppins',
  },
  overview: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginTop: 25,
    marginHorizontal: 16,
    // width: deviceWidth - 32,
    // height: isIos ? (260 / 375) * deviceWidth : (260 / 375) * deviceWidth + 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  overTitle: {
    fontSize: 14,
    color: '#000',
    lineHeight: 21,
    fontFamily: 'Poppins',
  },
  viewItem: {
    flexDirection: 'row',
    marginBottom: 22,
    alignItems: 'center',
  },
  iconItem: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 13,
  },
  txtItem: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 10,
  },
  line: {
    marginTop: 4,
    width: (150 / 375) * deviceWidth,
    height: 6,
    borderColor: '#000',
    borderWidth: 1,
  },
  progress: {
    height: 4,
  },
  txt1: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#929292',
  },
  viewList: {
    // paddingHorizontal: 16,
  },
  titleList: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
    fontWeight: '500',
    marginLeft: 16,
    marginVertical: 25,
  },
  txtAllSource: {
    fontFamily: 'Poppins-ExtraLight',
    fontSize: 13,
    lineHeight: 19,
    color: '#929292',
    fontWeight: '300',
    textDecorationLine: 'underline',
  },
  loginRegister: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loginRegisterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  loginRegisterIcon: {
    color: '#000',
    fontWeight: '500',
    marginHorizontal: 5,
  },
});
