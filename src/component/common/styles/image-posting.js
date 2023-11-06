import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from 'app-assets';

const { text } = Colors;
const isIos = Platform.OS === 'ios';
const isIpad = Platform.isPad;
const deviceWidth = Dimensions.get('window').width;
// const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    overflow: isIos ? 'visible' : 'hidden',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 16,
    // marginHorizontal: 16,
    // borderRadius: 7,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgUser: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: '#B8A7BC',
  },
  txtUserName: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: 15,
    color: text.black,
    width: 200,
  },
  txtTime: {
    fontFamily: 'SF Pro Display',
    fontSize: 13,
    color: text.gray,
    marginTop: 5,
  },
  follow: {
    width: 80,
    height: 24,
    borderRadius: 5,
    backgroundColor: text.orangeInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  txtFollow: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: 13,
    color: '#fff',
  },
  unFollow: {
    borderWidth: 1.5,
    borderRadius: 5,
    width: 80,
    height: 24,
    borderColor: text.orangeInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  txtUnFollow: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: 13,
    color: text.orangeInput,
  },
  iconMore: {
    width: 16,
    height: 3,
    resizeMode: 'center',
  },
  containerFooter: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    // flexGrow: 1
  },
  interactiveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconFooter: {
    width: 16,
    height: 16,
  },
  txtFooter: {
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
    color: '#A7A9BC',
    marginLeft: 8,
  },
  containerImgFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgFooter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  imgFooter3: {
    position: 'relative',
    left: -5,
  },
  imgFooter1: {
    position: 'relative',
    right: -5,
  },
  containerBody: {
    flexDirection: 'column',
    marginTop: 10,
    overflow: 'hidden',
  },
  txtContent: {
    fontFamily: 'SF Pro Display',
    fontSize: 15,
    color: text.black,
  },
  txtSeeMore: {
    fontFamily: 'SF Pro Display',
    fontSize: 15,
    color: text.gray,
  },
  txtHashTag: {
    fontFamily: 'SF Pro Display',
    fontSize: 13,
    color: text.blue,
    marginRight: 12,
  },
  containerHashTag: {
    paddingBottom: 8,
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#B8A7BC',
  },
  txtImageMore: {
    fontFamily: 'SF Pro Display',
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  icCloseRight: {
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: isIpad ? 32 : 16,
    height: isIpad ? 32 : 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 8,
  },
  like: {
    marginTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.3,
    borderColor: '#A7A9BC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtLike: {
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 20,
    color: '#A7A9BC',
  },
  saveComment: {
    flexDirection: 'row',
  },
  txtComment: {
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 20,
    color: '#A7A9BC',
    marginLeft: 12,
  },
  titleAlbum: {
    color: '#3793D8',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'SF Pro Text',
    marginLeft: 8,
    flex: 1,
  },
  viewAlbum: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#A7A9BC',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  img1: {
    marginBottom: 10,
    height: ((deviceWidth - 32) * 228) / 343,
  },
  icDetailClose: {
    width: isIpad ? 16 : 8,
    height: isIpad ? 16 : 8,
  },
  img2: {
    marginBottom: 10,
    flexDirection: 'row',
    height: ((deviceWidth - 32) * 228) / 343,
  },
  imgRow3: {
    height: (((deviceWidth - 32) / 2) * 257) / 168,
    flex: 1,
    marginRight: 4,
  },
  imgColumn3: {
    height: (((deviceWidth - 32) / 2) * 257) / 168,
    flex: 1,
    marginLeft: 4,
    flexDirection: 'column',
  },
  imgColumn4: {
    // height: ((deviceWidth - 32) * 140) / 343,
    // flexDirection: 'column',
    flex: 1,
    marginBottom: 10,
  },
  imgTop4: {
    width: deviceWidth - 32,
    height: ((deviceWidth - 32) * 140) / 343,
    marginBottom: 4,
  },
  imgLeft4: {
    width: (deviceWidth - 48) / 3,
    height: (deviceWidth - 48) / 3,
  },
});
