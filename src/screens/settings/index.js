import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Dimensions,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {Client, setToken} from 'app-api';
import {Images} from 'app-assets';
import IconF from 'react-native-vector-icons/Feather';

import ImagePicker from 'react-native-image-crop-picker';
import {deleteFCMToken} from 'app-common';
import {showLoading} from '../../actions/common';
import {
  saveUserToken,
  setUser,
  setOverview,
  setRecentSearch,
} from '../../actions/user';
import styles from './styles';

const deviceWidth = Dimensions.get('window').width;

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGenaral: true,
      isPassword: false,
      isDeleteAccount: false,
      avatar: undefined,

      description: props.user?.info?.description || '',
      firstName: props.user?.info?.first_name || '',
      lastName: props.user?.info?.last_name || '',
      nickName: props.user?.info?.nickname || '',

      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrentPassword: true,
      showNewPassword: true,
      showConfirmPassword: true,
      deletePassword: '',
    };
    this.backHandler = null;
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
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

  onClickGenaral = () => {
    this.setState({
      isGenaral: true,
      isPassword: false,
      isDeleteAccount: false,
    });
  };

  onClickPassword = () => {
    this.setState({
      isGenaral: false,
      isPassword: true,
      isDeleteAccount: false,
    });
  };

  onClickDeleteAccount = () => {
    this.setState({
      isGenaral: false,
      isPassword: false,
      isDeleteAccount: true,
    });
  };

  onUpload = async () => {
    const {user} = this.props;

    // TODO: CHECK PERMISSION DENIED

    ImagePicker.openPicker({
      width: Number(user?.info?.avatar_size?.width) || 250,
      height: Number(user?.info?.avatar_size?.height) || 250,
      cropping: true,
      multiple: false,
      mediaType: 'photo',
    })
      .then(image => {
        this.setState({avatar: image});
      })
      .catch(error => {
        Alert.alert('', error.message || 'Error');
      });
  };

  onRemove = () => {
    this.setState({avatar: null});
  };

  onLogout = async () => {
    const {dispatch, navigation} = this.props;

    await dispatch(showLoading(true));
    await deleteFCMToken();
    await dispatch(showLoading(false));

    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });

    dispatch(setUser(null));
    dispatch(saveUserToken(null));
    dispatch(setRecentSearch([]));
    dispatch(setOverview(null));
    setToken(null);
  };

  submitGeneral = async () => {
    Keyboard.dismiss();

    const {dispatch, user} = this.props;

    const {avatar, description, firstName, lastName, nickName} = this.state;

    if (nickName.trim() === '') {
      Alert.alert('Please enter nickname');
      return;
    }

    const param = new FormData();
    param.append('first_name', firstName);
    param.append('last_name', lastName);
    param.append('nickname', nickName);
    param.append('description', description);

    if (avatar) {
      const file = {
        uri: avatar?.path,
        type: avatar?.mime,
        name: avatar?.path.split('/').pop(),
      };

      param.append('lp_avatar_file', file);
    }

    await dispatch(showLoading(true));

    const response = await Client.updateUser(user?.info?.id, param);

    await dispatch(showLoading(false));

    if (response?.code) {
      Alert.alert(response?.message || 'Error');
    } else {
      Alert.alert('Changes saved.');
      dispatch(setUser(response));
    }
  };

  submitPassword = async () => {
    const {t} = this.props;

    Keyboard.dismiss();

    const {dispatch} = this.props;
    const {oldPassword, newPassword, confirmPassword} = this.state;

    if (oldPassword.trim() === '') {
      Alert.alert('', t('settings.emptyCurrentPassword'));
      return;
    }

    if (newPassword.trim() === '') {
      Alert.alert('', t('settings.emptyNewPassword'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('', t('settings.passwordNotMatch'));
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert('', t('settings.passwordAlreadyExists'));
      return;
    }

    const params = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    await dispatch(showLoading(true));

    const response = await Client.changePassword(params);

    await dispatch(showLoading(false));

    if (response.code === 'success') {
      Alert.alert(response.message);
      this.onLogout();
    } else {
      Alert.alert(response.message);
    }
  };

  onDeletedAccount = async () => {
    const {dispatch, user, t} = this.props;
    const {deletePassword} = this.state;

    if (!deletePassword) {
      Alert.alert('', t('settings.deleteAccountPasswordEmpty'));
      return;
    }

    await dispatch(showLoading(true));

    const response = await Client.deleteAccount({
      id: user?.info?.id,
      password: deletePassword,
    });

    await dispatch(showLoading(false));

    if (response.code === 'success') {
      Alert.alert(response.message);
      this.onLogout();
    } else {
      Alert.alert(response.message);
    }
  };

  toggleShowCurrentPassword = () => {
    const {showCurrentPassword} = this.state;
    this.setState({showCurrentPassword: !showCurrentPassword});
  };

  toggleShowNewPassword = () => {
    const {showNewPassword} = this.state;
    this.setState({showNewPassword: !showNewPassword});
  };

  toggleShowConfirmPassword = () => {
    const {showConfirmPassword} = this.state;
    this.setState({showConfirmPassword: !showConfirmPassword});
  };

  render() {
    const {
      isGenaral,
      isPassword,
      isDeleteAccount,
      avatar,
      description,
      firstName,
      lastName,
      nickName,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
    } = this.state;
    const {t, user} = this.props;
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always">
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
          <View style={styles.header}>
            <View style={styles.header1}>
              <TouchableOpacity
                onPress={this.goBack}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={Images.iconBack} style={styles.iconBack} />
              </TouchableOpacity>
              <Text style={styles.title}>{t('settings.title')}</Text>
              <View
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.btnGenaral}
                onPress={this.onClickGenaral}>
                <Text
                  style={[
                    styles.txtActive,
                    {color: isGenaral ? '#000' : '#999'},
                  ]}>
                  {t('settings.general')}
                </Text>
                {isGenaral && <View style={styles.lineButton} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnGenaral}
                onPress={this.onClickPassword}>
                <Text
                  style={[
                    styles.txtActive,
                    {color: isPassword ? '#000' : '#999'},
                  ]}>
                  {t('settings.password')}
                </Text>
                {isPassword && <View style={styles.lineButton} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onClickDeleteAccount}>
                <Text
                  style={[
                    styles.txtActive,
                    {color: isDeleteAccount ? '#000' : '#999'},
                  ]}>
                  {t('settings.deleteAccount')}
                </Text>
                {isDeleteAccount && <View style={styles.lineButton} />}
              </TouchableOpacity>
            </View>
            {isGenaral && (
              <View>
                {avatar?.path || avatar?.sourceURL || user?.info?.avatar_url ? (
                  <Image
                    source={{
                      uri:
                        avatar?.path ||
                        avatar?.sourceURL ||
                        user?.info?.avatar_url,
                    }}
                    style={[
                      styles.viewAvatar,
                      {
                        width:
                          (user?.info?.avatar_size?.width &&
                            (Number(user?.info?.avatar_size?.width) <
                            deviceWidth
                              ? Number(user?.info?.avatar_size?.width)
                              : deviceWidth - 32)) ||
                          250,
                        height:
                          (user?.info?.avatar_size?.width &&
                            (Number(user?.info?.avatar_size?.width) <
                            deviceWidth
                              ? Number(user?.info?.avatar_size?.height)
                              : (Number(user?.info?.avatar_size?.height) *
                                  (deviceWidth - 32)) /
                                Number(user?.info?.avatar_size?.width))) ||
                          250,
                      },
                    ]}
                  />
                ) : null}
                <TouchableOpacity
                  onPress={this.onUpload}
                  style={{
                    backgroundColor: '#FBC815',
                    width: 99,
                    height: 35,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                    marginBottom: 30,
                  }}>
                  <Text style={styles.txtBtnUpload}>
                    {t('settings.upload')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}>
                  <Text style={styles.titleChild}>{t('settings.bio')}</Text>
                  <IconF name="edit-2" color="#D2D2D2" size={17} />
                </View>
                <View style={styles.viewInputBio}>
                  <TextInput
                    style={styles.textInputBio}
                    multiline
                    value={description}
                    onChangeText={value => this.setState({description: value})}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}>
                  <Text style={styles.titleChild}>
                    {t('settings.firstName')}
                  </Text>
                  <IconF name="edit-2" color="#D2D2D2" size={17} />
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    value={firstName}
                    onChangeText={value => this.setState({firstName: value})}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}>
                  <Text style={styles.titleChild}>
                    {t('settings.lastName')}
                  </Text>
                  <IconF name="edit-2" color="#D2D2D2" size={17} />
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    value={lastName}
                    onChangeText={value => this.setState({lastName: value})}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}>
                  <Text style={styles.titleChild}>
                    {t('settings.nickName')}
                  </Text>
                  <IconF name="edit-2" color="#D2D2D2" size={17} />
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    value={nickName}
                    onChangeText={value => this.setState({nickName: value})}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FBC815',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    marginTop: 14,
                  }}
                  onPress={() => this.submitGeneral()}>
                  <Text style={styles.titleChild}>{t('settings.save')}</Text>
                </TouchableOpacity>
              </View>
            )}
            {isPassword && (
              <View>
                <View style={{marginBottom: 14}}>
                  <Text style={styles.titleChild}>
                    {t('settings.currentPassword')}
                  </Text>
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    secureTextEntry={showCurrentPassword}
                    onChangeText={value => this.setState({oldPassword: value})}
                  />
                  <TouchableOpacity
                    style={styles.btnViewPass}
                    onPress={() => this.toggleShowCurrentPassword()}>
                    {showCurrentPassword ? (
                      <IconF name="eye" color="#D2D2D2" size={18} />
                    ) : (
                      <IconF name="eye-off" color="#D2D2D2" size={18} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{marginBottom: 14}}>
                  <Text style={styles.titleChild}>
                    {t('settings.newPassword')}
                  </Text>
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    secureTextEntry={showNewPassword}
                    onChangeText={value => this.setState({newPassword: value})}
                  />
                  <TouchableOpacity
                    style={styles.btnViewPass}
                    onPress={() => this.toggleShowNewPassword()}>
                    {showNewPassword ? (
                      <IconF name="eye" color="#D2D2D2" size={18} />
                    ) : (
                      <IconF name="eye-off" color="#D2D2D2" size={18} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{marginBottom: 14}}>
                  <Text style={styles.titleChild}>
                    {t('settings.confirmNewPassword')}
                  </Text>
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.txtInput}
                    numberOfLines={1}
                    secureTextEntry={showConfirmPassword}
                    onChangeText={value =>
                      this.setState({confirmPassword: value})
                    }
                  />
                  <TouchableOpacity
                    style={styles.btnViewPass}
                    onPress={() => this.toggleShowConfirmPassword()}>
                    {showConfirmPassword ? (
                      <IconF name="eye" color="#D2D2D2" size={18} />
                    ) : (
                      <IconF name="eye-off" color="#D2D2D2" size={18} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FBC815',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    marginTop: 14,
                  }}
                  onPress={() => this.submitPassword()}>
                  <Text style={styles.titleChild}>{t('settings.save')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {isDeleteAccount && (
              <View>
                <View style={{marginBottom: 5}}>
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      color: '#444',
                      marginBottom: 20,
                    }}>
                    {t('settings.deleteAccountTitle')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: '#222',
                      marginBottom: 10,
                    }}>
                    {t('settings.deleteAccountTitle2')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      color: '#444',
                      marginBottom: 20,
                    }}>
                    {t('settings.deleteAccountContent')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: '#222',
                      marginBottom: 20,
                    }}>
                    {t('settings.deleteAccountContent2')}
                  </Text>
                  <View style={styles.viewInput}>
                    <TextInput
                      style={styles.txtInput}
                      numberOfLines={1}
                      secureTextEntry
                      onChangeText={value =>
                        this.setState({deletePassword: value})
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f6f8fa',
                      height: 42,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      marginTop: 14,
                      borderWidth: 1,
                      borderColor: '#e5e5e5',
                    }}
                    onPress={() => this.onDeletedAccount()}>
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        lineHeight: 24,
                        color: '#dc2626',
                      }}>
                      {t('settings.deleteAccountBtn')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
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
)(withTranslation()(Settings));
