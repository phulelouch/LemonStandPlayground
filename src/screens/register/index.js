import React, { PureComponent } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { Images } from 'app-assets';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Client, setToken } from 'app-api';
import { ValidateEmail, registerFCMToken, deleteFCMToken } from 'app-common';
import styles from './styles';
import { saveUserToken, setUser } from '../../actions/user';
import { setLoading } from '../../actions/common';

class Register extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
    };
    this.backHandler = null;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleBackPress = () => {
    this.onBack(); // works best when the goBack is async
    return true;
  };

  onBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onValidate = () => {
    const { isCheck } = this.state;
    if (!isCheck) {
      return false;
    }
    return true;
  };

  validate() {
    const { t } = this.props;
    const { email, username, password, confirmPassword, isCheck } = this.state;
    if (!username || username.length === 0) {
      Alert.alert('', t('registerScreen.usernameEmpty'));
      this.username.focus();
      return false;
    }
    if (!email || email.length === 0) {
      Alert.alert('', t('registerScreen.emailEmpty'));
      this.email.focus();
      return false;
    }
    if (!ValidateEmail(email)) {
      Alert.alert('', t('registerScreen.validEmail'));
      this.email.focus();
      return false;
    }
    if (!password || password.length === 0) {
      Alert.alert('', t('registerScreen.passwordEmpty'));
      this.password.focus();
      return false;
    }
    if (!confirmPassword || confirmPassword.length === 0) {
      Alert.alert('', t('registerScreen.confirmPasswordEmpty'));
      this.confirmpassword.focus();
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('', t('registerScreen.incorrectPassword'));
      this.confirmpassword.focus();
      return false;
    }
    if (!isCheck) {
      Alert.alert('', t('registerScreen.termAndConditionEmpty'));
      return false;
    }

    return true;
  }

  register = async () => {
    if (!this.validate()) {
      return;
    }
    const { dispatch, navigation } = this.props;

    if (!this.onValidate) {
      return;
    }

    Keyboard.dismiss();

    dispatch(setLoading(true));

    const { email, username, password, confirmPassword } = this.state;
    const params = {
      email,
      username,
      password,
      confirm_password: confirmPassword,
    };
    const response = await Client.register(params);

    if (response && response?.token) {
      dispatch(saveUserToken(response.token));
      dispatch(setUser(response));
      setToken(response.token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeTabScreen' }],
      });

      // Delete FCM Token.
      await deleteFCMToken();

      // Register FCM Token.
      await registerFCMToken();
    } else {
      Alert.alert('', response.message);
    }

    dispatch(setLoading(false));
  };

  render() {
    const { t } = this.props;
    const { isCheck, email, username, password, confirmPassword } = this.state;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <Image source={Images.iconBannerLogin2} style={styles.imgBanner} />
        <View style={{ marginTop: 80 }}>
          <TouchableOpacity
            style={{ marginLeft: 16, width: 50 }}
            onPress={this.onBack}
          >
            <Image source={Images.iconBack} style={styles.iconBack} />
          </TouchableOpacity>
          <View style={styles.viewLogo}>
            <Image source={Images.LogoSchool} style={styles.logo} />
            <Text style={styles.title}>{t('registerScreen.title')}</Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: 46, marginTop: 35 }}>
            <View
              style={[
                styles.viewInput,
                username.length > 0
                  ? { borderWidth: 2, borderColor: '#000' }
                  : {},
              ]}
            >
              <TextInput
                ref={(ref) => {
                  this.username = ref;
                }}
                placeholder={t('registerScreen.usernamePlaceholder')}
                placeholderTextColor="#9E9E9E"
                style={styles.textInput}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => this.setState({ username: value })}
              />
              {username.length > 0 && (
                <Image source={Images.icEnterUsername} style={styles.icEnter} />
              )}
            </View>
            <View
              style={[
                styles.viewInput,
                email.length > 0 ? { borderWidth: 2, borderColor: '#000' } : {},
              ]}
            >
              <TextInput
                ref={(ref) => {
                  this.email = ref;
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t('registerScreen.emailPlaceholder')}
                placeholderTextColor="#9E9E9E"
                style={styles.textInput}
                onChangeText={(value) => this.setState({ email: value })}
              />
              {email.length > 0 && (
                <Image source={Images.icEnterEmail} style={styles.icEnter} />
              )}
            </View>
            <View
              style={[
                styles.viewInput,
                password.length > 0
                  ? { borderWidth: 2, borderColor: '#000' }
                  : {},
              ]}
            >
              <TextInput
                ref={(ref) => {
                  this.password = ref;
                }}
                secureTextEntry={!this.state.showPassword}
                placeholder={t('registerScreen.passwordPlaceholder')}
                placeholderTextColor="#9E9E9E"
                style={styles.textInput}
                value={password}
                onChangeText={(value) => this.setState({ password: value })}
              />
              {password.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ showPassword: !this.state.showPassword })
                  }
                >
                  <Image
                    source={Images.icEnterPassword}
                    style={styles.icEnter}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.viewInput,
                confirmPassword.length > 0
                  ? { borderWidth: 2, borderColor: '#000' }
                  : {},
              ]}
            >
              <TextInput
                ref={(ref) => {
                  this.confirmpassword = ref;
                }}
                placeholder={t('registerScreen.confirmPasswordPlaceholder')}
                placeholderTextColor="#9E9E9E"
                style={styles.textInput}
                secureTextEntry={!this.state.showConfirmPassword}
                value={confirmPassword}
                onChangeText={(value) =>
                  this.setState({ confirmPassword: value })
                }
              />
              {confirmPassword.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      showConfirmPassword: !this.state.showConfirmPassword,
                    })
                  }
                >
                  <Image
                    source={Images.icEnterPassword}
                    style={styles.icEnter}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.setState({ isCheck: !isCheck })}
              >
                <Icon
                  name={!isCheck ? 'stop-outline' : 'ios-checkbox-outline'}
                  style={styles.iconCheck}
                />
              </TouchableOpacity>
              <Text style={styles.txtAccept}>
                {t('registerScreen.termAndCondition')}
              </Text>
            </View>
            <TouchableOpacity style={styles.btnSubmit} onPress={this.register}>
              <Text style={styles.txtSubmit}>
                {t('registerScreen.btnSubmit')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = ({ network }) => ({
  network,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Register));
