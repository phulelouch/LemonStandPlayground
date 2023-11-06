import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { ListCourses } from 'app-component';
import { Client } from 'app-api';
import { Images } from 'app-assets';
import IconI from 'react-native-vector-icons/Ionicons';
import { tronLog } from 'app-common';
import styles from './styles';

const hitSlop = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};
const deviceWidth = Dimensions.get('window').width;

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFilter: false,
      page: 1,
      data: [],
      filter: 0,
      isLoading: true,
      dataFilter: [],
      categorySelect: [],
      keySearch: undefined,
      isLoadMore: true,
    };
    this.isFetchData = true;
    this.eventListener = null;
    this.backHandler = null;
  }

  async componentDidMount() {
    const categories = await Client.getCategory();
    const { navigation, route } = this.props;
    const idCategory = route.params?.idCategory;

    await this.setState({
      dataFilter: categories,
      categorySelect: [idCategory],
    });

    this.focusListener = navigation.addListener('focus', async () => {
      if (this.isFetchData) {
        await this.getData();
      }
      this.isFetchData = false;
    });
    // await this.getData();
    this.eventListener = DeviceEventEmitter.addListener(
      'keywordSearch',
      this.updateKeywordSearch
    );
    DeviceEventEmitter.addListener(
      'refresh_with_category',
      this.refreshWithCate
    );
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
    if (this.eventListener) {
      this.eventListener.remove();
    }
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

  refreshWithCate = async (idCate) => {
    this.isFetchData = false;
    await this.setState({
      categorySelect: [idCate],
      refreshing: true,
      data: [],
      page: 1,
    });
    await this.getData();
  };

  updateKeywordSearch = async (value) => {
    await this.setState({ keySearch: value });
    this.onRefresh();
  };

  async getData() {
    tronLog('load_data');
    const { page, filter, categorySelect, keySearch } = this.state;

    const param = {
      // context: 'view',
      page,
      per_page: 10,
      // search: keySearch,
      // after: null,
      // before: null,
      // exclude: null,
      // include: null,
      // offset: null,
      // order: null,
      // orderby: null,
      // category: null,
      // tag: null,
      // learned: false,
      optimize: true,
    };
    if (keySearch) {
      param.search = keySearch;
    }
    if (filter === 3) {
      param.on_sale = true;
    }
    if (filter === 4) {
      param.popular = true;
    }
    if (filter === 5) {
      param.orderby = 'date';
      param.order = 'desc';
    }
    if (filter === 7) {
      param.orderby = 'date';
      param.order = 'asc';
    }
    if (filter === 6) {
      param.orderby = 'title';
      param.order = 'asc';
    }
    if (filter === 2) {
      param.orderby = 'price';
      param.order = 'desc';
    }
    if (filter === 1) {
      param.orderby = 'price';
      param.order = 'asc';
    }
    if (categorySelect.length > 0) {
      param.category = categorySelect;
    }
    const response = await Client.course(param, false);
    const newData = [];
    for (let i = 0; i < response.length; i += 1) {
      const element = response[i];

      if (
        this.state.data.length === 0 ||
        this.state.data.find((x) => x.id !== element.id)
      ) {
        newData.push(element);
      }
    }
    this.setState({
      data: page === 1 ? newData : this.state.data.concat(newData),
      refreshing: false,
      isLoading: false,
      isLoadMore: response.length === 10,
    });
  }

  showFilter = () => {
    const { isShowFilter } = this.state;
    this.setState({ isShowFilter: !isShowFilter });
  };

  async setFilter(value) {
    await this.setState({
      isShowFilter: false,
      filter: value,
      data: [],
    });

    this.onRefresh();
  }

  onSelectCate = async (item) => {
    const { categorySelect } = this.state;
    if (categorySelect.includes(item.id)) {
      await this.setState({
        data: [],
        categorySelect: categorySelect.filter((x) => x !== item.id),
        isLoading: true,
      });
    } else {
      await this.setState({
        data: [],
        categorySelect: [...categorySelect, item.id],
        isLoading: true,
      });
    }

    await this.onRefresh();
  };

  onAnimatedSearch = () => {
    setTimeout(() => {
      this.inputSearch.focus();
    }, 200);
  };

  renderItemFilter = ({ item }) => {
    const { categorySelect } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.onSelectCate(item)}
        style={{
          height: 30,
          paddingHorizontal: 19,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: categorySelect.includes(item.id) ? '#000' : '#fff',
          borderRadius: 60,
          borderWidth: 1,
          borderColor: '#EBEBEB',
          marginRight: 10,
        }}
      >
        <Text
          style={[
            styles.txtItemFilter,
            { color: categorySelect.includes(item.id) ? '#fff' : '#858585' },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  handleLoadMore = async () => {
    const { page, isLoadMore } = this.state;
    if (!isLoadMore) {
      return;
    }
    await this.setState({
      showFooter: true,
      page: page + 1,
    });
    tronLog('handleLoadMore');
    await this.getData();
    await this.setState({ showFooter: false });
  };

  onRefresh = async () => {
    try {
      await this.setState({
        refreshing: true,
        data: [],
        page: 1,
      });
      await this.getData();
      await this.setState({
        refreshing: false,
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

  onCloseKeywordSearch = async () => {
    await this.setState({
      data: [],
      keySearch: null,
    });

    this.onRefresh();
  };

  render() {
    const {
      isShowFilter,
      refreshing,
      showFooter,
      data,
      filter,
      isLoading,
      dataFilter,
      keySearch,
    } = this.state;
    const { t, navigation } = this.props;
    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            {/* <TouchableOpacity onPress={this.goBack}>
              <Image source={Images.iconBack} style={styles.iconBack} />
            </TouchableOpacity> */}
            <Text style={styles.title}>{t('courses.title')}</Text>
            <TouchableOpacity
              style={styles.viewSearch}
              onPress={() =>
                navigation.navigate('CoursesSearchScreen', {
                  keySearch,
                })
              }
            >
              <Image source={Images.iconSearch} style={styles.iconSearch} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 26,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {keySearch && (
              <>
                <Text numberOfLines={1} style={styles.txtSearch}>
                  {t('courses.searching', { keySearch })}
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 6 }}
                  hitSlop={hitSlop}
                  onPress={this.onCloseKeywordSearch}
                >
                  <IconI name="close" size={20} />
                </TouchableOpacity>
                {/* <Text style={styles.txtSearch}>
              Showing 1-25 courses of 365 courses (api chưa trả về)
            </Text> */}
              </>
            )}
          </View>
          <View>
            <TouchableOpacity
              onPress={this.showFilter}
              style={styles.viewFilter}
            >
              {filter === 1 && (
                <Text style={styles.txtFilter}>Price: Low to High</Text>
              )}
              {filter === 2 && (
                <Text style={styles.txtFilter}>Price: High to Low</Text>
              )}
              {filter === 3 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.sale')}
                </Text>
              )}
              {filter === 4 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.popular')}
                </Text>
              )}
              {filter === 5 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.newest')}
                </Text>
              )}
              {filter === 7 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.oldest')}
                </Text>
              )}
              {filter === 6 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.title')}
                </Text>
              )}
              {filter === 0 && (
                <Text style={styles.txtFilter}>
                  {t('courses.filters.filter')}
                </Text>
              )}

              <IconI name="ios-caret-down" color="#C5C5C5" size={8} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 26,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            alignItems: 'center',
          }}
        >
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={dataFilter}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItemFilter}
          />
        </View>
        {isLoading && (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="small" />
          </View>
        )}
        {!isLoading && !refreshing && data.length === 0 && (
          <Text
            style={[
              styles.txtFilterItem,
              { alignSelf: 'center', marginTop: 50 },
            ]}
          >
            {t('dataNotFound')}
          </Text>
        )}
        <ListCourses
          navigation={navigation}
          data={data}
          extraData={this.state}
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingBottom: 150 }}
          refreshScreen={this.refreshScreen()}
          nextPage={this.handleLoadMore}
          refreshing={refreshing}
          showFooter={showFooter}
        />
        {/* )} */}

        {isShowFilter && (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ isShowFilter: false });
            }}
          >
            <View style={[styles.viewUpdateRole, {}]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.viewModalFilter,
                    { right: -deviceWidth + 127 + 16, top: 150 },
                  ]}
                >
                  <TouchableOpacity onPress={() => this.setFilter(0)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 0 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.default')}
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => this.setFilter(1)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 1 && { color: '#000' },
                      ]}
                    >
                      Price: Low to High
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setFilter(2)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 2 && { color: '#000' },
                      ]}
                    >
                      Price: High to Low
                    </Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => this.setFilter(6)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 6 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.title')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setFilter(5)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 5 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.newest')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setFilter(7)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 7 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.oldest')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setFilter(3)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 3 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.sale')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setFilter(4)}>
                    <Text
                      style={[
                        styles.txtFilterItem,
                        filter === 4 && { color: '#000' },
                      ]}
                    >
                      {t('courses.filters.popular')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}
export default withTranslation()(Courses);
