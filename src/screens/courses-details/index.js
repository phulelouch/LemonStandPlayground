import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
  Linking,
  TextInput,
  RefreshControl,
  Platform,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {withTranslation} from 'react-i18next';
import {Client} from 'app-api';
import {Images} from 'app-assets';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import {Rating} from 'react-native-ratings';
import Accordion from 'react-native-collapsible/Accordion';
import {connect} from 'react-redux';
import {tronLog} from 'app-common';
import {RenderDataHTML} from 'app-component';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  getAvailablePurchases,
  initConnection,
  getProducts,
  purchaseErrorListener,
  purchaseUpdatedListener,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
  requestPurchase,
} from 'react-native-iap';
import styles from './styles';
import {showLoading} from '../../actions/common';
import {saveCourse} from '../../actions/course';
import {saveDataWishlist} from '../../actions/wishlist';
import {saveProductIAP} from '../../actions/product-iap';
import {setOverview} from '../../actions/user';

// PRODUCTS_IAP moved to src/config/index.js

class CoursesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [0],
      review: null,
      reviewMessage: '',
      isWishlist: false,

      titleRating: '',
      contentRating: '',
      starRating: 5,
      hiddenBottom: false,
    };
    this.id = null;

    this.eventListener = null;
    this.backHandler = null;
  }

  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;

  async componentDidMount() {
    await this.initConnectIAP();

    await this.getData();

    this.inAppPurchase();

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.eventListener = DeviceEventEmitter.addListener(
      'loadCourseDetail',
      this.refreshData,
    );

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = () => {
    this.setState({
      hiddenBottom: true,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      hiddenBottom: false,
    });
  };

  inAppPurchase = async () => {
    const {t, dispatch} = this.props;

    try {
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }

      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async purchase => {
          const receipt = purchase.transactionReceipt
            ? purchase.transactionReceipt
            : purchase.originalJson;

          await finishTransaction({
            purchase,
            isConsumable: true,
            developerPayloadAndroid: '',
          });

          if (receipt) {
            await dispatch(showLoading(true));

            try {
              const verifyReceipt = await Client.verifyReceipt({
                'receipt-data': receipt,
                'is-ios': Platform.OS === 'ios',
                'course-id': this.id || 0,
              });

              console.log('verifyReceipt', verifyReceipt);

              if (verifyReceipt.status === 'success') {
                const response = await Client.courseDetail(this.id);
                await dispatch(saveCourse(response));
              } else {
                throw new Error(
                  verifyReceipt?.message || 'Verify receipt error',
                );
              }
            } catch (err) {
              Alert.alert('', t('singleCourse.purchaseNotCompleted'));
            }

            await dispatch(showLoading(false));
          }
        },
      );

      this.purchaseErrorSubscription = purchaseErrorListener(error => {
        Alert.alert('', t('singleCourse.purchaseNotCompleted'));
      });
    } catch (e) {
      console.log('error', e.message);
    }
  };

  initConnectIAP = async () => {
    const {dispatch, productIAP} = this.props;

    await dispatch(showLoading(true));

    try {
      let {ids} = productIAP;

      if (ids.length === 0) {
        const response = await Client.getProductIAP();

        if (!response || response?.code) {
          ids = [];
          await dispatch(saveProductIAP([]));
        } else {
          ids = response;
          await dispatch(saveProductIAP(response));
        }
      }

      await initConnection();

      await getProducts({skus: ids});
    } catch (e) {
      console.log('error', e.message);
    }

    await dispatch(showLoading(false));
  };

  refreshData = async () => {
    const {dispatch} = this.props;
    this.setState({
      refreshing: true,
    });
    const response = await Client.courseDetail(this.id);
    dispatch(saveCourse(response));
    this.setState({refreshing: false});
  };

  async getData() {
    const {route, dispatch, user} = this.props;

    try {
      await dispatch(showLoading(true));

      this.id = route.params?.id;

      const response = await Client.courseDetail(this.id);

      await dispatch(showLoading(false));

      dispatch(setOverview(this.id));

      dispatch(saveCourse(response));

      if (user?.token) {
        const courseWishlist = await Client.getWishlistWithId(this.id);
        if (
          courseWishlist.status === 'success' &&
          courseWishlist.data.in_wishlist !== 'no'
        ) {
          this.setState({isWishlist: courseWishlist?.data?.in_wishlist});
        }

        this.getRating({
          per_page: 3,
        });
      }
    } catch (e) {
      dispatch(showLoading(false));
      console.log(e.message || 'Error when get product data');
    }
  }

  getRating = async params => {
    const review = await Client.getReview(this.id, params);
    if (review.status === 'success') {
      this.setState({
        review: review.data,
        reviewMessage: review.message || '',
      });
    }
  };

  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch(saveCourse(null));

    endConnection();

    if (this.backHandler) {
      this.backHandler.remove();
    }

    if (this.eventListener) {
      this.eventListener.remove();
    }

    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }

    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }

    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    DeviceEventEmitter.emit('refresh_overview');
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const {navigation} = this.props;
    DeviceEventEmitter.emit('refresh_overview');
    navigation.goBack();
  };

  onNavigateLearning = (item, index) => {
    const {navigation} = this.props;

    navigation.navigate('LearningScreen', {
      item,
      index,
      idCourse: this.id,
    });
  };

  renderItemFilter = ({item}) => {
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
        }}>
        <Text style={styles.txtItemFilter}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  renderItemRating = () => {
    const {review} = this.state;
    const {t, navigation} = this.props;

    if (!review) {
      return null;
    }

    return (
      <View>
        {review?.reviews.reviews.map((item, i) => (
          <View
            key={String(i)}
            style={{
              borderBottomWidth: 1,
              borderColor: '#EBEBEB',
              paddingBottom: 16,
              marginBottom: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={styles.txtNameRating} numberOfLines={1}>
                {item.display_name}
              </Text>
              <Rating
                ratingCount={5}
                imageSize={12}
                readonly
                ratingColor="#FBC815"
                startingValue={Number(item.rate)}
              />
            </View>
            <Text style={styles.titleRating}>{item.title}</Text>
            <Text style={[styles.txtOverview, {marginTop: 5}]}>
              {item.content}
            </Text>
          </View>
        ))}
        {review?.reviews?.paged < review?.reviews?.pages && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
            onPress={() => {
              navigation.navigate('ReviewsScreen', {
                id: this.id,
              });
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}>
              {t('singleCourse.showAllReview', {count: review?.total})}
            </Text>
            <IconF name="chevron-right" size={18} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderHeaderSession = (section, index, isActive) => {
    return (
      <View key={String(index)}>
        <View
          style={[styles.subSectionTitle, {marginTop: 8, marginBottom: 11}]}>
          <View style={styles.subSectionTitle}>
            <IconI name={isActive ? 'caret-up' : 'caret-down'} size={15} />
            <Text numberOfLines={1} style={styles.txtSubSection}>
              {section.title}
            </Text>
          </View>
          <Text style={styles.txtLength}>{section.items.length}</Text>
        </View>
      </View>
    );
  };

  renderContent = (section, index) => {
    const {course, user} = this.props;
    const data = course?.data;
    const {items} = section;
    return (
      <View>
        {items.map((item, i) => (
          <TouchableOpacity
            key={String(i)}
            onPress={() => this.onNavigateLearning(item, index)}
            style={[styles.subSectionTitle, {marginBottom: 5, marginLeft: 24}]}
            disabled={!user?.token || item.locked}>
            <View style={styles.subSectionTitle}>
              {item.type === 'lp_lesson' && (
                <IconF name="book" color="#4E4E4E" size={14} />
              )}
              {item.type === 'lp_quiz' && (
                <IconF name="help-circle" color="#4E4E4E" size={14} />
              )}
              {item.type === 'lp_assignment' && (
                <IconF name="file" color="#4E4E4E" size={14} />
              )}
              <Text numberOfLines={1} style={styles.txtItemLession}>
                {item.title}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {item.preview &&
                !['completed', 'evaluated'].includes(item.status) && (
                  <IconI name="eye-outline" style={styles.iconPreview} />
                )}
              {item.duration !== '' && (
                <Text style={styles.totalHours}>{item.duration}</Text>
              )}
              {item.locked && (
                <IconI
                  name="lock-closed"
                  color="#4E4E4E"
                  size={16}
                  style={styles.iconLock}
                />
              )}
              {['completed', 'evaluated'].includes(item.status) && (
                <IconI name="ios-checkmark-circle" style={styles.iconPreview} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  onStart = async () => {
    const {course} = this.props;
    const data = course?.data;

    if (data.sections.length > 0 && data.sections[0].items.length > 0) {
      let itemRedirect = null;

      data.sections.forEach(section => {
        if (!itemRedirect) {
          itemRedirect = section.items.find(
            item => item.status !== 'completed',
          );
        }
      });

      this.onNavigateLearning(itemRedirect || data.sections[0].items[0], 0);
    }
  };

  onEnroll = async () => {
    const {dispatch, user} = this.props;

    if (!user?.token) {
      return this.notLoggedIn();
    }

    dispatch(showLoading());
    const param = {
      id: this.id,
    };

    const response = await Client.enroll(param);
    dispatch(showLoading(false));
    if (response.status === 'success') {
      // Alert.alert('Enroll success');
      DeviceEventEmitter.emit('loadMyCourse');
      this.getData();
      this.onStart();
    } else {
      Alert.alert('', response.message);
    }
  };

  onRetake = async () => {
    const {t, dispatch} = this.props;
    dispatch(showLoading());
    const param = {
      id: this.id,
    };

    const response = await Client.retakeCourse(param);
    dispatch(showLoading(false));
    if (response.status === 'success') {
      Alert.alert(t('singleCourse.retakeNotice'));
      this.getData();
      DeviceEventEmitter.emit('loadMyCourse');
    } else {
      Alert.alert(response.message);
    }
  };

  onToggleWishlish = async () => {
    const {dispatch, course, user} = this.props;

    if (!user?.token) {
      return this.notLoggedIn();
    }

    const {isWishlist} = this.state;
    const data = course?.data;
    const param = {
      id: data.id,
    };
    dispatch(showLoading());
    const response = await Client.addRemoveWishlist(param);
    dispatch(showLoading(false));
    if (response.status === 'success') {
      this.setState({isWishlist: !isWishlist});
      dispatch(saveDataWishlist(response?.data?.items || []));
    } else {
      Alert.alert(response.message);
    }
  };

  notLoggedIn = () => {
    const {t, navigation} = this.props;

    return Alert.alert(t('alert.notLoggedIn'), t('alert.loggedIn'), [
      {
        text: t('alert.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('alert.btnLogin'),
        onPress: () =>
          navigation.navigate('LoginScreen', {
            screen: 'CoursesDetailsScreen',
            id: this.id,
          }),
      },
    ]);
  };

  addToCard = async id => {
    const {dispatch, user} = this.props;

    if (!user?.token) {
      return this.notLoggedIn();
    }

    await dispatch(showLoading(true));
    try {
      await requestPurchase(
        Platform.select({
          ios: {
            sku: id,
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
          },
          android: {
            skus: [id],
          },
        }),
      );
    } catch (err) {
      console.log(err.message);
    }
    await dispatch(showLoading(false));
  };

  restorePurchases = async id => {
    const {dispatch, user, t} = this.props;

    if (!user?.token) {
      return this.notLoggedIn();
    }

    await dispatch(showLoading(true));

    try {
      const purchases = await getAvailablePurchases();

      const purchase = purchases.find(p => p.productId === id);

      if (purchase) {
        const verifyReceipt = await Client.verifyReceipt({
          'receipt-data': purchase.transactionReceipt,
          'is-ios': Platform.OS === 'ios',
          'course-id': purchase.productId || 0,
        });

        if (verifyReceipt.status === 'success') {
          const response = await Client.courseDetail(this.id);
          await dispatch(saveCourse(response));
          await Alert.alert(
            t('alert.restorePurchases'),
            t('alert.restorePurchasesSuccess'),
          );
        } else {
          throw new Error(verifyReceipt?.message || 'Verify receipt error');
        }
      } else {
        throw new Error(t('singleCourse.restoreCourseNotPurchase'));
      }
    } catch (err) {
      Alert.alert(
        t('alert.restorePurchases'),
        err.message || t('singleCourse.restoreCourseNotPurchase'),
      );
    }

    await dispatch(showLoading(false));
  };

  submitRating = async () => {
    const {t, dispatch} = this.props;
    const {titleRating, contentRating, starRating} = this.state;
    if (titleRating.trim() === '') {
      Alert.alert(t('singleCourse.review'), t('singleCourse.reviewTitleEmpty'));
      return;
    }
    if (contentRating.trim() === '') {
      Alert.alert(
        t('singleCourse.review'),
        t('singleCourse.reviewContentEmpty'),
      );
      return;
    }
    const param = {
      id: this.id,
      title: titleRating,
      rate: starRating,
      content: contentRating,
    };
    dispatch(showLoading(true));
    const response = await Client.createReview(param);
    dispatch(showLoading(false));
    if (response.status === 'success') {
      this.getRating();
      Alert.alert(response.message);
    } else {
      Alert.alert(response.message);
    }
  };

  render() {
    const {course} = this.props;
    const data = course?.data;
    const {
      refreshing,
      activeSections,
      isWishlist,
      review,
      reviewMessage,
      hiddenBottom,
    } = this.state;
    tronLog('review', review);
    const {t, navigation} = this.props;

    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Image source={Images.iconBack} style={styles.iconBack} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('singleCourse.title')}</Text>
            <View style={styles.iconBack} />
          </View>
        </View>

        <KeyboardAwareScrollView
          removeClippedSubviews={false}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.refreshData}
            />
          }>
          <FastImage
            style={styles.imageBanner}
            source={{
              uri: data?.image,
            }}>
            <TouchableOpacity
              onPress={this.onToggleWishlish}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: isWishlist ? '#FBC815' : 'rgba(0,0,0,0.2)',
                borderRadius: 12,
                height: 42,
                width: 42,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconI name="heart-outline" color="#fff" size={22} />
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 2,
                right: 16,
              }}>
              <Text numberOfLines={2} style={styles.txt2}>
                {data?.name}
              </Text>
            </View>
            <Image
              source={Images.backgroundBanner}
              style={{position: 'absolute', bottom: 0, width: '100%'}}
            />
          </FastImage>
          <View style={styles.content2}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Images.iconClock} style={styles.icon} />
                <Text style={styles.txt3}>{data?.duration}</Text>
                {data &&
                  data?.count_students !== '' &&
                  data?.count_students > 0 && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image source={Images.iconStudent} style={styles.icon1} />
                      <Text style={styles.txt3}>{data?.count_students}</Text>
                    </View>
                  )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {data?.on_sale ? (
                  <>
                    {data?.sale_price_rendered ? (
                      <Text style={styles.price}>
                        {data.sale_price_rendered}
                      </Text>
                    ) : (
                      <Text style={styles.price}>${data.sale_price}</Text>
                    )}
                    {data?.origin_price_rendered ? (
                      <Text style={styles.oldPrice}>
                        {data.origin_price_rendered}
                      </Text>
                    ) : (
                      <Text style={styles.oldPrice}>${data.origin_price}</Text>
                    )}
                  </>
                ) : data?.price > 0 ? (
                  <>
                    {data?.price_rendered ? (
                      <Text style={styles.price}>{data?.price_rendered}</Text>
                    ) : (
                      <Text style={styles.price}>${data?.price}</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.price}>{t('free')}</Text>
                )}
              </View>
            </View>
            {data?.content ? (
              <>
                <Text style={styles.txtTitle}>
                  {t('singleCourse.overview')}
                </Text>
                <RenderDataHTML html={data?.content} />
              </>
            ) : null}
            <Text style={styles.txtTitle}>{t('singleCourse.curriculum')}</Text>
            {data && data.sections.length > 0 ? (
              <Accordion
                sections={data.sections}
                underlayColor="transpation"
                activeSections={activeSections}
                renderHeader={this.renderHeaderSession}
                renderContent={this.renderContent}
                onChange={value => {
                  this.setState({activeSections: value});
                }}
              />
            ) : (
              <Text style={{fontFamily: 'Poppins'}}>
                {t('singleCourse.curriculumEmpty')}
              </Text>
            )}

            <View style={styles.line} />

            <Text style={styles.txtTitle}>{t('singleCourse.instructor')}</Text>
            <TouchableOpacity
              style={styles.viewInstructor}
              onPress={() =>
                navigation.navigate('InstructorScreen', {
                  instructor: data?.instructor,
                })
              }>
              <Image
                style={styles.imgAvatar}
                source={{
                  uri:
                    data?.instructor?.avatar ||
                    'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
                }}
              />
              <Text style={styles.txtSubTitle}>{data?.instructor?.name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  disabled={data?.instructor?.social?.facebook === ''}
                  onPress={() =>
                    Linking.openURL(data?.instructor?.social?.facebook)
                  }
                  style={{marginHorizontal: 6}}>
                  <IconF name="facebook" color="#D2D2D2" size={15} />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  disabled={data?.instructor?.social.facebook === ''}
                >
                  <Image source={Images.iconInstagram} style={styles.iconIns} />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(data?.instructor?.social?.twitter)
                  }
                  disabled={data?.instructor?.social?.twitter === ''}
                  style={{marginHorizontal: 6}}>
                  <IconF name="twitter" color="#D2D2D2" size={14} />
                </TouchableOpacity>
                {/* <TouchableOpacity>
                  <Image source={Images.iconGoogle2} style={styles.iconIns} />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(data?.instructor?.social?.youtube)
                  }
                  disabled={data?.instructor?.social?.youtube === ''}
                  style={{marginHorizontal: 6}}>
                  <IconF name="youtube" color="#D2D2D2" size={16} />
                </TouchableOpacity>
              </View>
              {data?.instructor?.description && (
                <Text style={styles.txtBio}>{data.instructor.description}</Text>
              )}
            </TouchableOpacity>
            {review && (
              <>
                <Text style={styles.txtTitle}>{t('singleCourse.review')}</Text>
                <View>
                  <View style={styles.viewReview}>
                    <Text style={styles.txtRating}>
                      {Number(review?.rated).toFixed(1)}
                    </Text>
                    <Rating
                      ratingCount={5}
                      imageSize={15}
                      readonly
                      ratingColor="#FBC815"
                      startingValue={Number(review?.rated).toFixed(1)}
                    />
                    <Text style={[styles.txtOverview, {marginTop: 5}]}>
                      {t('singleCourse.rating', {total: review?.total})}
                    </Text>
                    <Text
                      style={[
                        styles.txtOverview,
                        {marginTop: 10, textAlign: 'center'},
                      ]}>
                      {reviewMessage}
                    </Text>
                  </View>
                  {this.renderItemRating()}
                </View>
              </>
            )}
            {review?.can_review && (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 18,
                    fontWeight: '500',
                    marginBottom: 5,
                  }}>
                  {t('singleCourse.leaveAReview')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-ExtraLight',
                    fontSize: 13,
                    fontWeight: '300',
                    marginBottom: 10,
                  }}>
                  {t('singleCourse.leaveAReviewDescription')}
                </Text>
                <View style={{marginTop: 16, flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, marginRight: 8}}>
                    <Text style={{marginBottom: 10}}>
                      {t('singleCourse.reviewTitle')}
                    </Text>
                    <TextInput
                      style={{
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#F3F3F3',
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        fontFamily: 'Poppins',
                        color: '#000',
                      }}
                      onChangeText={value =>
                        this.setState({titleRating: value})
                      }
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      marginLeft: 8,
                    }}>
                    <Text style={{marginBottom: 10}}>
                      {t('singleCourse.reviewRating')}
                    </Text>
                    <Rating
                      ratingCount={5}
                      imageSize={20}
                      jumpValue={1}
                      startingValue={5}
                      ratingColor="#FBC815"
                      onFinishRating={value =>
                        this.setState({starRating: value})
                      }
                    />
                  </View>
                </View>
                <Text style={{marginBottom: 10, marginTop: 16}}>
                  {t('singleCourse.reviewContent')}
                </Text>
                <TextInput
                  style={{
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#F3F3F3',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    minHeight: 80,
                    fontFamily: 'Poppins',
                    color: '#000',
                  }}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={value => this.setState({contentRating: value})}
                />
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: '#000',
                    borderRadius: 6,
                    flex: 1,
                    alignSelf: 'flex-start',
                    marginTop: 20,
                  }}
                  onPress={() => this.submitRating()}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 13,
                      fontWeight: '500',
                      lineHeight: 18,
                    }}>
                    {t('singleCourse.reviewSubmit')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>

        {!hiddenBottom ? (
          <View style={styles.bottom}>
            {data?.course_data.status === 'enrolled' ? (
              <>
                <Text style={styles.txtTotal}>
                  {t('singleCourse.average')}{' '}
                  <Text style={{fontWeight: '500'}}>
                    {data.course_data.result.result} %
                  </Text>
                </Text>
                <TouchableOpacity
                  style={styles.btnAddToCart}
                  onPress={this.onStart}>
                  <Text style={styles.txtAddToCart}>
                    {t('singleCourse.btnContinue')}
                  </Text>
                  <IconI
                    name="arrow-forward-outline"
                    style={{color: '#fff', fontSize: 20, marginLeft: 16}}
                  />
                </TouchableOpacity>
              </>
            ) : data?.course_data.status === 'purchased' ? (
              <TouchableOpacity
                style={styles.btnAddToCart}
                onPress={this.onEnroll}>
                <Text style={styles.txtAddToCart}>
                  {t('singleCourse.btnStartNow')}
                </Text>
              </TouchableOpacity>
            ) : data?.price > 0 && !data?.course_data.status ? (
              <>
                <TouchableOpacity
                  style={styles.btnAddToCart}
                  onPress={() => this.restorePurchases(String(data.id))}>
                  <Text style={styles.txtAddToCart}>
                    {t('singleCourse.btnRestore')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnAddToCart}
                  onPress={() => this.addToCard(String(data.id))}>
                  <Text style={styles.txtAddToCart}>
                    {t('singleCourse.btnAddToCart')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              data?.price === 0 &&
              data?.course_data.status !== 'finished' && (
                <TouchableOpacity
                  style={styles.btnAddToCart}
                  onPress={this.onEnroll}>
                  <Text style={styles.txtAddToCart}>
                    {t('singleCourse.btnStartNow')}
                  </Text>
                </TouchableOpacity>
              )
            )}
            {data?.course_data.status === 'finished' &&
              data?.course_data?.graduation && (
                <View
                  style={{
                    marginLeft: 10,
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      lineHeight: 21,
                      color:
                        data?.course_data?.graduation === 'passed'
                          ? '#25C717'
                          : '#F66',
                      fontWeight: '500',
                    }}>
                    {data?.course_data?.graduation === 'passed' ? (
                      <>
                        <IconF name="check" color="#25C717" size={14} />{' '}
                        {t('singleCourse.passed')}
                      </>
                    ) : (
                      <>
                        <IconF name="x" color="#F66" size={14} />{' '}
                        {t('singleCourse.failed')}
                      </>
                    )}
                  </Text>
                </View>
              )}
            {data?.course_data.status === 'finished' && data?.can_retake && (
              <TouchableOpacity
                style={styles.btnAddToCart}
                onPress={this.onRetake}>
                <Text style={styles.txtAddToCart}>
                  {t('singleCourse.btnRetake')}
                </Text>
              </TouchableOpacity>
            )}
            {data?.course_data.status === 'finished' && !data?.can_retake && (
              <View
                style={{
                  marginLeft: 10,
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    lineHeight: 21,
                    color: '#000',
                    fontWeight: '500',
                  }}>
                  {t('singleCourse.finished')}
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  }
}
const mapStateToProps = ({course, wishlist, user, productIAP}) => ({
  course,
  wishlist,
  user,
  productIAP,
});
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(CoursesDetails));
