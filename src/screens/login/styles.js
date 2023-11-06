import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  imgBanner: {
    width: (1120 / 1500) * deviceWidth,
    height: (1272 / 1500) * deviceWidth,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
  },
  imgBottom: {
    marginTop: 10,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textBottom: {
    marginTop: 40,
    fontSize: 14,
    color: '#000',
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
    height: 45,
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  icEnter: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
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
  txtAccept: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  iconCheck: {
    fontSize: 22,
    color: '#9E9E9E',
    marginRight: 12,
  },
  btnSubmit: {
    marginTop: 0,
    flex: 1,
    height: 50,
    backgroundColor: '#FFC224',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  txtSubmit: {
    fontFamily: 'Sniglet-Regular',
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
  },
  line: {
    width: 90,
    height: 1,
    backgroundColor: '#DBDBDB',
  },
  iconFacebook: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  iconTwitter: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconGoogle: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  txtForgot: {
    marginTop: 24,
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    color: '#569EC6',
  },
  viewLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 250,
    alignSelf: 'center',
    marginTop: 71,
  },
  viewButton: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
    alignSelf: 'center',
  },
  viewInput: {
    flex: 1,
    color: '#000',
    backgroundColor: '#F3F3F3',
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#F3F3F3',
  },
});
