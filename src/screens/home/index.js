import React, {PureComponent} from 'react';
import {
  DeviceEventEmitter,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Images} from 'app-assets';
import {connect} from 'react-redux';
import {
  ProgressCircle,
  PopularCourses,
  LearnToday,
  Instructor,
} from 'app-component';
import {Client} from 'app-api';
import styles from './styles';
import SkeletonFlatList from '../../component/common/skeleton/flatlist';
import SkeletonCategory from '../../component/common/skeleton/category';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataInstructor: [],
      dataOverview: {},
      dataNewCourse: [],
      dataCate: [],
      topCourseWithStudent: [],
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
    };

    this.eventListener = null;
  }

  async componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener(
      'refresh_overview',
      this.refreshOverview,
    );
    this.onGetData();
  }

  componentWillUnmount() {
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }

  async onGetData() {
    const param = {
      roles: ['lp_teacher', 'administrator'],
    };

    const {user} = this.props;

    if (user?.overview) {
      Client.getOverview(user.overview).then(response => {
        this.setState({
          dataOverview: response,
        });
      });
    }
    Client.topCoursesWithStudent().then(response => {
      this.setState({
        topCourseWithStudent: response,
        loading2: false,
      });
    });
    Client.newCourses().then(response => {
      this.setState({
        dataNewCourse: response,
        loading3: false,
      });
    });
    Client.getCategoryHome().then(response => {
      this.setState({
        dataCate: response,
        loading1: false,
      });
    });
    Client.getIntructor(param).then(response => {
      this.setState({
        dataInstructor: response,
        loading4: false,
      });
    });
  }

  refreshOverview = async () => {
    const {user} = this.props;

    if (user?.overview) {
      const response = await Client.getOverview(user.overview);
      this.setState({dataOverview: response});
    }
  };

  onBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onRefresh = async () => {
    this.setState({
      refreshing: true,
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
    });
    await this.onGetData();
    this.setState({refreshing: false});
  };

  render() {
    const {
      dataInstructor,
      dataOverview,
      topCourseWithStudent,
      dataNewCourse,
      dataCate,
      refreshing,
      loading1,
      loading2,
      loading3,
      loading4,
    } = this.state;

    const {t, navigation, user} = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}>
          <Image source={Images.bannerHome} style={styles.imgBanner} />
          <View style={styles.header}>
            <Image source={Images.iconHome} style={styles.iconHome} />
            {!user?.token ? (
              <View style={styles.loginRegister}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.loginRegisterText}>{t('login')}</Text>
                </TouchableOpacity>
                <Text style={styles.loginRegisterIcon}>|</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={styles.loginRegisterText}>{t('register')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('NotificationsScreen')}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Image
                    source={Images.iconNotification}
                    style={styles.iconHeader}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {user?.token && (
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 16,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileStackScreen')}
                style={{flexDirection: 'row'}}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri:
                      user?.info?.avatar_url ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMjCj43UJiVu-3Qp9b5yj-SwLGR-kndCzqLaiMv5SMkITd4CcbQQ7vX_CEZd-xxqka8ZM&usqp=CAU',
                  }}
                />
                <View style={{marginLeft: 15}}>
                  <Text style={styles.fullname}>{user?.info?.name}</Text>
                  <Text style={styles.email}>{user?.info?.email}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {user?.token && dataOverview?.id && (
            <View style={styles.overview}>
              <Text style={styles.overTitle}>{t('home.overview.title')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <ProgressCircle
                  widthX={77}
                  progress={
                    Math.round(dataOverview.course_data?.result?.result) / 100
                  }
                  strokeWidth={8}
                  backgroundColor="#F6F6F6"
                  progressColor="#958CFF"
                />
                <View style={{marginLeft: 24}}>
                  <View style={styles.viewItem}>
                    <Image
                      source={Images.iconLession}
                      style={styles.iconItem}
                    />
                    <View>
                      <Text style={styles.txtItem}>{t('lesson')}</Text>
                      <View style={styles.line}>
                        <View
                          style={[
                            styles.progress,
                            {
                              width: `${
                                (dataOverview.course_data?.result?.items?.lesson
                                  ?.completed /
                                  dataOverview.course_data?.result?.items
                                    ?.lesson?.total) *
                                100
                              }%`,
                              backgroundColor: '#FFD336',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.viewItem}>
                    <Image source={Images.iconQuiz} style={styles.iconItem} />
                    <View>
                      <Text style={styles.txtItem}>{t('quiz')}</Text>
                      <View style={styles.line}>
                        <View
                          style={[
                            styles.progress,
                            {
                              width: `${
                                (dataOverview.course_data?.result?.items?.quiz
                                  ?.completed /
                                  dataOverview.course_data?.result?.items?.quiz
                                    ?.total) *
                                100
                              }%`,
                              backgroundColor: '#41DBD2',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  {dataOverview.course_data?.result?.items?.assignment?.total >
                    0 && (
                    <View style={styles.viewItem}>
                      <Image
                        source={Images.iconAssignment}
                        style={styles.iconItem}
                      />
                      <View>
                        <Text style={styles.txtItem}>{t('assignment')}</Text>
                        <View style={styles.line}>
                          <View
                            style={[
                              styles.progress,
                              {
                                width: `${
                                  (dataOverview.course_data?.result?.items
                                    ?.assignment?.completed /
                                    dataOverview.course_data?.result?.items
                                      ?.assignment?.total) *
                                  100
                                }%`,
                                backgroundColor: '#958CFF',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CoursesDetailsScreen', {
                    id: dataOverview.id,
                  })
                }
                style={styles.container}>
                <Text
                  numberOfLines={1}
                  style={[styles.overTitle, {marginTop: 30}]}>
                  {dataOverview?.name}
                </Text>
                <Text style={styles.txt1}>
                  {dataOverview?.sections.length}{' '}
                  {dataOverview?.sections.length > 1
                    ? t('home.overview.sections').toUpperCase()
                    : t('home.overview.section').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.viewList}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight: 15,
              }}>
              <Text style={styles.titleList}>{t('home.category')}</Text>
            </View>
            {dataCate && dataCate.length > 0 && (
              <LearnToday
                navigation={navigation}
                contentContainerStyle={{paddingHorizontal: 16}}
                data={dataCate}
                horizontal
              />
            )}
            {loading1 && <SkeletonCategory />}
          </View>

          {topCourseWithStudent && topCourseWithStudent.length > 0 && (
            <View style={styles.viewList}>
              <Text style={styles.titleList}>{t('home.popular')}</Text>
              <PopularCourses
                navigation={navigation}
                contentContainerStyle={{paddingHorizontal: 16}}
                data={topCourseWithStudent}
                horizontal
              />
            </View>
          )}
          {loading2 && (
            <View style={styles.viewList}>
              <Text style={styles.titleList}>{t('home.popular')}</Text>
              <SkeletonFlatList />
            </View>
          )}
          {dataNewCourse && dataNewCourse.length > 0 && (
            <View style={styles.viewList}>
              <Text style={styles.titleList}>{t('home.new')}</Text>
              <PopularCourses
                navigation={navigation}
                contentContainerStyle={{paddingHorizontal: 16}}
                data={dataNewCourse}
                horizontal
              />
            </View>
          )}
          {loading3 && (
            <View style={styles.viewList}>
              <Text style={styles.titleList}>{t('home.new')}</Text>
              <SkeletonFlatList />
            </View>
          )}

          {dataInstructor && dataInstructor.length > 0 && (
            <View style={styles.viewList}>
              <Text style={[styles.titleList, {marginBottom: 8}]}>
                {t('instructor')}
              </Text>

              <Instructor
                navigation={navigation}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
                data={dataInstructor}
                horizontal
              />
            </View>
          )}
          {loading4 && (
            <View style={styles.viewList}>
              <Text style={[styles.titleList, {marginBottom: 8}]}>
                {t('instructor')}
              </Text>
              <SkeletonFlatList
                itemStyles={{
                  height: 80,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
        </ScrollView>
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
)(withTranslation()(Home));
