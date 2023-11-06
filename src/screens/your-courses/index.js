import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Images } from 'app-assets';
import { ConvertToDateTime } from 'app-common';

import styles from './styles';

class YourCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.backHandler = null;
  }

  async componentDidMount() {
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

  keyExtractor = (item) => String(item.Id);

  renderHeader = () => {
    return (
      <View
        style={{ flexDirection: 'row', height: 30, backgroundColor: '#36CE61' }}
      >
        <View style={styles.colId}>
          <Text style={styles.txtTitleCol}>Course</Text>
        </View>
        <View style={styles.colDate}>
          <Text style={styles.txtTitleCol}>Result</Text>
        </View>
        <View style={styles.colDate}>
          <Text style={styles.txtTitleCol}>Expiration</Text>
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 36,
          backgroundColor: index % 2 === 0 ? '#F3F3F3' : '#fff',
        }}
      >
        <View style={styles.colId}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CoursesDetailsScreen', {
                id: item.Id,
              })
            }
          >
            <Text style={styles.txtCol}>{item.Name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.colDate}>
          <Text style={styles.txtCol}>
            {item.Result ? `${item.Result}%` : ''}
          </Text>
        </View>
        <View style={styles.colDate}>
          <Text style={styles.txtCol}>
            {ConvertToDateTime(item.ExpirationDate)}
          </Text>
        </View>
      </View>
    );
  };

  getData = () => {
    const { user } = this.props;

    const data = user?.info?.tabs?.courses?.content?.enrolled?.['in-progress'];

    return data
      ? Object.values(data).map((course) => ({
          Id: course?.id || 0,
          Name: course?.title || '--',
          Result: course?.results?.result || '',
          ExpirationDate: course?.expiration || '',
          EndDate: course?.end_time || '',
        }))
      : [];
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={this.goBack}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            >
              <Image source={Images.iconBack} style={styles.iconBack} />
            </TouchableOpacity>
            <Text style={styles.title}>Your Courses</Text>
            <View
              style={{
                width: 40,
                height: 40,
              }}
            />
          </View>
        </View>
        <View style={styles.content}>
          <View>
            <Text style={styles.childTitle}>Your courses - In progress</Text>
            <FlatList
              bounces={false}
              ListHeaderComponent={this.renderHeader}
              data={this.getData()}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor} // Performance purpose
              rremoveClippedSubviews={false}
              onEndReachedThreshold={0.5}
              scrollEventThrottle={1}
              style={{ borderBottomWidth: 1, borderColor: '#E3E3E3' }}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  user,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(YourCourses);
