import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import {Images} from 'app-assets';
import IconF from 'react-native-vector-icons/Feather';

import {Client, setToken} from 'app-api';
import {connect} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {tronLog, deleteFCMToken} from 'app-common';
import styles from './styles';
import {
  saveUserToken,
  setUser,
  setRecentSearch,
  setOverview,
} from '../../actions/user';
import {showLoading} from '../../actions/common';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.backHandler = null;
  }

  async componentDidMount() {
    const {user, dispatch} = this.props;

    if (user?.token) {
      const tokenDecode = jwtDecode(user.token);
      tronLog('tokenDecode', tokenDecode);
      const response = await Client.getUser(tokenDecode.data.user.id);
      tronLog('response 1', response);
      dispatch(setUser(response));
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    }
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onLogout = () => {
    const {t} = this.props;
    Alert.alert(
      t('logout'),
      t('alert.logoutTxt'),
      [
        {
          text: t('alert.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('alert.ok'),
          onPress: async () => {
            const {dispatch, navigation} = this.props;

            await dispatch(showLoading(true));
            await deleteFCMToken();
            await dispatch(showLoading(false));

            navigation.navigate('LoginScreen');
            dispatch(setUser(null));
            dispatch(saveUserToken(null));
            dispatch(setRecentSearch([]));
            dispatch(setOverview(null));
            setToken(null);
          },
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {t, navigation, user} = this.props;
    tronLog('user', user);
    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />

        <View style={styles.header}>
          <View style={styles.header1}>
            <Text style={styles.title}>{t('profile.title')}</Text>
          </View>
        </View>
        {user?.token ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri:
                    user?.info?.avatar_url ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMjCj43UJiVu-3Qp9b5yj-SwLGR-kndCzqLaiMv5SMkITd4CcbQQ7vX_CEZd-xxqka8ZM&usqp=CAU',
                }}
                style={styles.avatar}
              />
              <View style={{marginLeft: 15, flex: 1}}>
                <Text style={styles.fullName}>{user?.info?.name}</Text>
                {user?.info?.description !== '' && (
                  <Text style={styles.txtContent}>
                    {user?.info?.description}
                  </Text>
                )}
                {user?.info?.email && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconF name="mail" size={18} color="#F8C719" />
                    <Text style={styles.txtPhone}>{user?.info?.email}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.border} />
            <View style={{alignSelf: 'center'}}>
              <View style={{marginLeft: 30}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SettingsScreen')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      backgroundColor: '#36CE61',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconF name="settings" size={20} color="#fff" />
                  </View>
                  <Text style={styles.txt1}>{t('settings.title')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('YourOrderScreen')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      backgroundColor: '#F8C719',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconF name="shopping-bag" size={20} color="#fff" />
                  </View>
                  <Text style={styles.txt1}>{t('myOrders.title')}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                onPress={() => navigation.navigate('YourCoursesScreen')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: '#3DBCF3',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconF name="book" size={20} color="#fff" />
                </View>
                <Text style={styles.txt1}>Your Courses</Text>
              </TouchableOpacity> */}
              </View>
              <View
                style={[styles.border, {marginTop: 70, marginBottom: 30}]}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 30,
                }}
                onPress={this.onLogout}>
                <IconF name="log-out" size={20} color="#FF3535" />
                <Text style={[styles.txt1, {marginLeft: 14}]}>
                  {t('logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 16,
                marginBottom: 20,
                color: '#444',
              }}>
              {t('needLogin')}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 10,
                border: 1,
                backgroundColor: '#000',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 5,
              }}
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: '#fff',
                }}>
                {t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Text
          style={{
            fontSize: 10,
            position: 'absolute',
            bottom: 100,
            textAlign: 'center',
            left: 0,
            right: 0,
            color: '#666',
          }}>
          Version: {DeviceInfo.getVersion()} - Build:{' '}
          {DeviceInfo.getBuildNumber()}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({user}) => ({
  user,
});
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Profile));
