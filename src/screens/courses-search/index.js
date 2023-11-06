import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  DeviceEventEmitter,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { Images } from 'app-assets';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { tronLog } from 'app-common';
import styles from './styles';
import { setRecentSearch } from '../../actions/user';

class CoursesSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch: '',
    };

    this.backHandler = null;
  }

  async componentDidMount() {
    const { route } = this.props;
    this.setState({ keySearch: route.params?.keySearch || '' });
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
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onSearch = async (value = null) => {
    const { dispatch, user } = this.props;
    const { textSearch } = this.state;
    tronLog('recentSearch', user.recentSearch);
    const newRecent = JSON.parse(JSON.stringify(user.recentSearch));
    if (!newRecent.includes(value || textSearch)) {
      newRecent.unshift(value || textSearch);
    }
    tronLog('newRecent', newRecent);
    dispatch(setRecentSearch(newRecent.splice(0, 5)));
    DeviceEventEmitter.emit('keywordSearch', value || textSearch);
    this.goBack();
  };

  renderItemFilter = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          height: 30,
          paddingHorizontal: 19,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderRadius: 60,
          borderWidth: 1,
          borderColor: '#EBEBEB',
          marginRight: 10,
        }}
      >
        <Text style={styles.txtItemFilter}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { t, user } = this.props;
    tronLog('user.recentSearch', user);
    return (
      <KeyboardAwareScrollView bounces={false} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            >
              <Icon name="close" color="#000" size={30} />
            </TouchableOpacity>
            <View style={styles.viewInput}>
              <Image source={Images.iconSearch} style={styles.iconSearch} />
              <TextInput
                style={styles.inputSearch}
                placeholder={t('searchScreen.placeholder')}
                ref={(ref) => {
                  this.inputSearch = ref;
                }}
                underlineColorAndroid="transparent"
                value={this.state.textSearch}
                onChangeText={(value) => this.setState({ textSearch: value })}
                returnKeyType="search"
                onSubmitEditing={() => this.onSearch()}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 16,
          }}
        >
          {user?.recentSearch && user.recentSearch.length > 0 && (
            <Text style={styles.title}>{t('searchScreen.title')}</Text>
          )}

          {user?.recentSearch &&
            user?.recentSearch.map((item, i) => (
              <TouchableOpacity
                key={String(i)}
                onPress={() => this.onSearch(item)}
              >
                <Text numberOfLines={1} style={styles.textRecent}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  user,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CoursesSearch));
