import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  DeviceEventEmitter,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ListMyCourse } from 'app-component';
import { Client } from 'app-api';
import { Images } from 'app-assets';
import IconI from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const hitSlop = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};
const deviceWidth = Dimensions.get('window').width;

class MyCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFilter: false,
      showAnimatedSearh: false,
      data: [],
      page: 1,
      isLoadMore: true,
      filter: '',
      keySearch: '',
      refreshing: false,
      loading: true,
      showFooter: false,
    };

    this.isFetchData = true;

    this.eventListener = null;
    this.backHandler = null;
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      if (this.isFetchData) {
        await this.getData();
      }
      this.setState({ refreshing: false });
      this.isFetchData = false;
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
    this.eventListener = DeviceEventEmitter.addListener(
      'loadMyCourse',
      this.refreshMyCourse
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

  refreshMyCourse = async () => {
    await this.getData();
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

  async getData() {
    const { filter, keySearch, page } = this.state;
    const param = {
      page,
      per_page: 10,
      learned: true,
      optimize:
        'sections,on_sale,can_finish,can_retake,ratake_count,rataken,rating,price,origin_price,sale_price,tags,count_students,instructor,meta_data',
    };
    if (keySearch) {
      param.search = keySearch;
    }
    if (filter !== '') {
      param.course_filter = filter;
    }

    const response = await Client.course(param);

    this.setState({
      data: page !== 1 ? this.state.data.concat(response) : response,
      isLoadMore: response.length === 10,
      loading: false,
      showFooter: false,
    });
  }

  showFilter = () => {
    const { isShowFilter, refreshing, loading } = this.state;

    if (refreshing || loading) {
      return;
    }

    this.setState({ isShowFilter: !isShowFilter });
  };

  onAnimatedSearch = () => {
    this.setState({ showAnimatedSearh: true });

    setTimeout(() => {
      this.inputSearch.focus();
    }, 200);
  };

  handleLoadMore = async () => {
    const { page, isLoadMore } = this.state;

    if (!isLoadMore) {
      return;
    }

    await this.setState({
      page: page + 1,
      showFooter: true,
      refreshing: false,
      loading: false,
    });
    await this.getData(true);
  };

  onRefresh = async () => {
    this.setState({
      refreshing: true,
      data: [],
      page: 1,
      showFooter: false,
      loading: false,
    });
    await this.getData();
    this.setState({ refreshing: false });
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

  async onFilter(value) {
    await this.setState({
      isShowFilter: false,
      filter: value === 'all' ? '' : value,
      data: [],
      page: 1,
      showFooter: false,
      loading: true,
    });

    await this.getData();
  }

  async onSearch() {
    const { refreshing, loading } = this.state;

    if (loading || refreshing) {
      return;
    }

    await this.setState({
      isShowFilter: false,
      data: [],
      page: 1,
      showFooter: false,
      loading: true,
    });

    await this.getData();
  }

  async onCloseSearch() {
    const { refreshing, loading } = this.state;

    if (loading || refreshing) {
      return;
    }

    await this.setState({
      showAnimatedSearh: false,
      keySearch: '',
      isShowFilter: false,
      data: [],
      page: 1,
      showFooter: false,
      loading: true,
    });

    await this.getData();
  }

  render() {
    const {
      isShowFilter,
      filter,
      showAnimatedSearh,
      data,
      refreshing,
      showFooter,
      loading,
    } = this.state;

    const { t, navigation, user } = this.props;

    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          {showAnimatedSearh ? (
            <View style={styles.viewInput}>
              <TouchableOpacity
                hitSlop={hitSlop}
                style={{ marginRight: 16 }}
                onPress={() => this.onCloseSearch()}
              >
                <Image source={Images.iconBack} style={styles.iconBack} />
              </TouchableOpacity>
              <TextInput
                style={styles.inputSearch}
                ref={(ref) => {
                  this.inputSearch = ref;
                }}
                onChangeText={(value) => this.setState({ keySearch: value })}
                onSubmitEditing={() => this.onSearch()}
                returnKeyType="search"
              />
              <TouchableOpacity
                hitSlop={hitSlop}
                onPress={() => this.onSearch()}
                disabled={loading || refreshing}
              >
                <Image source={Images.iconSearch} style={styles.iconSearch} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.header1}>
              <Text style={styles.title}>{t('myCourse.title')}</Text>
              {user?.token ? (
                <TouchableOpacity
                  style={styles.viewSearch}
                  onPress={this.onAnimatedSearch}
                >
                  <Image source={Images.iconSearch} style={styles.iconSearch} />
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
        {user?.token ? (
          <>
            <View
              style={{
                marginTop: 26,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
              }}
            >
              <View />
              <View>
                <TouchableOpacity
                  onPress={this.showFilter}
                  style={styles.viewFilter}
                >
                  {filter === '' && (
                    <Text style={styles.txtFilter}>
                      {t('myCourse.filters.filter')}
                    </Text>
                  )}
                  {filter === 'passed' && (
                    <Text style={styles.txtFilter}>
                      {' '}
                      {t('myCourse.filters.passed')}
                    </Text>
                  )}
                  {filter === 'in-progress' && (
                    <Text style={styles.txtFilter}>
                      {' '}
                      {t('myCourse.filters.inProgress')}
                    </Text>
                  )}
                  {filter === 'failed' && (
                    <Text style={styles.txtFilter}>
                      {' '}
                      {t('myCourse.filters.failed')}
                    </Text>
                  )}
                  <IconI name="ios-caret-down" color="#C5C5C5" size={8} />
                </TouchableOpacity>
              </View>
            </View>
            {loading && (
              <View style={styles.viewLoading}>
                <ActivityIndicator size="small" />
              </View>
            )}

            {!loading && !refreshing && data.length === 0 && (
              <Text
                style={[
                  styles.txtFilterItem,
                  { alignSelf: 'center', marginTop: 50 },
                ]}
              >
                {t('dataNotFound')}
              </Text>
            )}

            <ListMyCourse
              navigation={navigation}
              data={data}
              style={{ marginTop: 20 }}
              contentContainerStyle={{ paddingBottom: 150 }}
              refreshScreen={this.refreshScreen()}
              nextPage={this.handleLoadMore}
              refreshing={refreshing}
              showFooter={showFooter}
            />
            {isShowFilter && (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ isShowFilter: false });
                }}
              >
                <View style={[styles.viewUpdateRole]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.viewModalFilter,
                        { right: -deviceWidth + 107 + 16, top: 150 },
                      ]}
                    >
                      <TouchableOpacity onPress={() => this.onFilter('all')}>
                        <Text style={styles.txtFilterItem}>
                          {' '}
                          {t('myCourse.filters.all')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.onFilter('in-progress')}
                      >
                        <Text style={styles.txtFilterItem}>
                          {' '}
                          {t('myCourse.filters.inProgress')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.onFilter('passed')}>
                        <Text style={styles.txtFilterItem}>
                          {' '}
                          {t('myCourse.filters.passed')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.onFilter('failed')}>
                        <Text style={styles.txtFilterItem}>
                          {' '}
                          {t('myCourse.filters.failed')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            )}
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
const mapStateToProps = ({ user }) => ({
  user,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(MyCourse));
