import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  DeviceEventEmitter,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { ListWishlist } from 'app-component';
import { Client } from 'app-api';
import { Images } from 'app-assets';
import { connect } from 'react-redux';
import styles from './styles';
import { saveDataWishlist } from '../../actions/wishlist';

class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      refreshing: false,
      showFooter: false,
      isLoading: true,
    };
    this.isFetchData = true;
    this.eventListener = null;
    this.backHandler = null;
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      if (this.isFetchData) {
        await dispatch(saveDataWishlist([]));
        this.getData();
      }
      this.isFetchData = false;
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
    this.eventListener = DeviceEventEmitter.addListener(
      'refreshWishlist',
      this.refreshWishlist
    );
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
    if (this.backHandler) {
      this.backHandler.remove();
    }
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }

  refreshWishlist = () => {
    this.getData();
  };

  getData = async () => {
    const { page } = this.state;
    const { dispatch, wishlist, user } = this.props;

    if (!user?.token) {
      return;
    }

    const param = {
      page,
      per_page: 10,
      optimize: true,
    };
    const response = await Client.getWishlist(param);

    if (response.status === 'success') {
      const newData = wishlist.data.concat(response.data.items);
      this.setState({ isLoading: false });
      dispatch(saveDataWishlist(newData));
    }
  };

  handleBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  handleLoadMore = async () => {
    const { endLoadMore, page } = this.state;
    if (!endLoadMore) {
      await this.setState({ showFooter: true, page: page + 1 });
      await this.getData();
      await this.setState({ showFooter: false });
    }
  };

  onRefresh = async () => {
    try {
      const { dispatch } = this.props;
      await dispatch(saveDataWishlist([]));
      await this.setState({
        refreshing: true,
        page: 1,
        endLoadMore: false,
        isLoading: false,
      });
      await this.getData();
      await this.setState({
        refreshing: false,
        endLoadMore: true,
        isLoading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  refreshScreen() {
    const { refreshing } = this.state;

    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={this.onRefresh}
        progressViewOffset={30}
      />
    );
  }

  render() {
    const { refreshing, showFooter, isLoading } = this.state;
    const { t, navigation, wishlist, user } = this.props;

    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <Text style={styles.title}>{t('wishlist.title')}</Text>
          </View>
        </View>

        {user?.token ? (
          <>
            {isLoading && (
              <View style={{ marginTop: 50, zIndex: 1000 }}>
                <ActivityIndicator size="small" />
              </View>
            )}

            {!isLoading && !refreshing && wishlist?.data.length === 0 && (
              <Text
                style={[
                  styles.txtFilterItem,
                  { alignSelf: 'center', marginTop: 50 },
                ]}
              >
                {t('dataNotFound')}
              </Text>
            )}

            <ListWishlist
              data={wishlist?.data}
              navigation={navigation}
              style={{ marginTop: 20 }}
              contentContainerStyle={{ paddingBottom: 150 }}
              refreshScreen={this.refreshScreen()}
              // nextPage={this.handleLoadMore}
              refreshing={refreshing}
              showFooter={showFooter}
            />
          </>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 16,
                marginBottom: 20,
                color: '#444',
              }}
            >
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
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: '#fff',
                }}
              >
                {t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = ({ wishlist, user }) => ({
  wishlist,
  user,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Wishlist));
