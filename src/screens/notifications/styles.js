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
    textAlign: 'center',
    flex: 1,
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
    paddingBottom: 10,
    backgroundColor: '#f3f4f6',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
  },
  itemImage: {
    marginVertical: 4,
    marginHorizontal: 4,
    height: (180 / 375) * deviceWidth,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  itemContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemTitle: {
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  itemContent: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
  },
  itemTime: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    marginTop: 8,
  },
});
