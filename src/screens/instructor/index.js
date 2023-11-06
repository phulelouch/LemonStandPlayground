import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Client} from 'app-api';
import {Images} from 'app-assets';
import {connect} from 'react-redux';
import {tronLog} from 'app-common';
import styles from './styles';
import IconF from 'react-native-vector-icons/Feather';
import ListCoursesOfInstructor from '../../component/list/list-course-instructor';

class Instructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      refreshing: true,
      showFooter: false,
    };
    this.instructor = undefined;
    this.backHandler = null;
  }

  async componentDidMount() {
    const {route} = this.props;
    this.instructor = route.params?.instructor;
    this.forceUpdate();
    tronLog('instructor', this.instructor);
    this.getData();
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

  getData = async () => {
    const param = {
      page: this.state.page,
      per_page: 10,
      optimize: true,
      user: this.instructor.id,
    };
    const response = await Client.course(param);
    this.setState({
      data: this.state.page === 1 ? response : this.state.data.concat(response),
      refreshing: false,
      isLoadMore: response.length === 10,
    });
  };

  handleBackPress = () => {
    const {navigation} = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  handleLoadMore = async () => {
    const {page, isLoadMore} = this.state;
    if (!isLoadMore) {
      return;
    }
    await this.setState({
      showFooter: true,
      page: page + 1,
    });
    tronLog('handleLoadMore');
    await this.getData();
    await this.setState({showFooter: false});
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
    const {refreshing} = this.state;

    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={this.onRefresh}
        progressViewOffset={30}
      />
    );
  }

  render() {
    const {refreshing, showFooter, data} = this.state;
    const {t, navigation} = this.props;
    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={Images.iconBack} style={styles.iconBack} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('instructorScreen.title')}</Text>
          </View>
        </View>
        <View style={styles.viewInstructor}>
          <View>
            <Image
              style={styles.imgAvatar}
              source={{
                uri:
                  this.instructor?.avatar_url ||
                  this.instructor?.avatar ||
                  'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                gap: 8,
              }}>
              <TouchableOpacity
                disabled={!this.instructor?.social?.facebook}
                onPress={() =>
                  Linking.openURL(this.instructor?.social?.facebook)
                }>
                <IconF name="facebook" size={16} color={'#444'} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!this.instructor?.social?.twitter}
                onPress={() =>
                  Linking.openURL(this.instructor?.social?.twitter)
                }>
                <IconF name="twitter" size={16} color={'#444'} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!this.instructor?.social?.youtube}
                onPress={() =>
                  Linking.openURL(this.instructor?.social?.youtube)
                }>
                <IconF name="youtube" size={16} color={'#444'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.viewInstructorContent}>
            <Text style={styles.txtTitle}>{this.instructor?.name}</Text>
            <Text style={styles.txtDes}>{this.instructor?.description}</Text>
          </View>
        </View>
        {this.instructor?.instructor_data && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <Text style={styles.txtTitle}>
              {t('instructorScreen.countCourse', {
                count: this.instructor?.instructor_data?.total_courses || 0,
              })}
            </Text>
            <Text style={styles.txtTitle}>
              {t('instructorScreen.countStudent', {
                count: this.instructor?.instructor_data?.total_users || 0,
              })}
            </Text>
          </View>
        )}

        {!refreshing && data.length === 0 && (
          <Text
            style={[
              styles.txtFilterItem,
              {alignSelf: 'center', marginTop: 50},
            ]}>
            {t('dataNotFound')}
          </Text>
        )}
        <ListCoursesOfInstructor
          data={data}
          navigation={navigation}
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: 150}}
          refreshScreen={this.refreshScreen()}
          nextPage={this.handleLoadMore}
          refreshing={refreshing}
          showFooter={showFooter}
        />
      </View>
    );
  }
}
const mapStateToProps = ({wishlist}) => ({
  wishlist,
});
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Instructor));
