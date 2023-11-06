import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ConvertToDateTime } from 'app-common';
import { Images } from 'app-assets';

import styles from './styles';

class YourOrder extends Component {
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
    const { t } = this.props;
    return (
      <View
        style={{ flexDirection: 'row', height: 30, backgroundColor: '#36CE61' }}
      >
        <View style={styles.colId}>
          <Text style={styles.txtTitleCol}>{t('myOrders.order')}</Text>
        </View>
        <View style={styles.colDate}>
          <Text style={styles.txtTitleCol}>{t('myOrders.date')}</Text>
        </View>
        <View style={styles.colStatus}>
          <Text style={styles.txtTitleCol}>{t('myOrders.status')}</Text>
        </View>
        <View style={styles.colTotal}>
          <Text style={styles.txtTitleCol}>{t('myOrders.total')}</Text>
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 36,
          backgroundColor: index % 2 === 0 ? '#F3F3F3' : '#fff',
        }}
      >
        <View style={styles.colId}>
          <Text style={styles.txtCol}>{item.Id}</Text>
        </View>

        <View style={styles.colDate}>
          <Text style={styles.txtCol}>{ConvertToDateTime(item.Date)}</Text>
        </View>
        <View style={styles.colStatus}>
          <Text style={styles.txtCol}>{item.Status.toUpperCase()}</Text>
        </View>
        <View style={styles.colTotal}>
          <Text style={styles.txtCol}>${item.Total}</Text>
        </View>
      </View>
    );
  };

  getData = () => {
    const { user } = this.props;

    const data = user?.info?.tabs?.orders?.content;

    return data
      ? Object.values(data).map((order) => ({
          Id: order?.order_key || 0,
          Date: order?.date,
          Status: order?.status,
          Total: order?.total,
        }))
      : [];
  };

  render() {
    const { t } = this.props;

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
            <Text style={styles.title}>{t('myOrders.title')}</Text>
            <View
              style={{
                width: 40,
                height: 40,
              }}
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.content}>
            {/* <Text style={styles.txt1}>
            If you have a valid order key you can recover it here
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputSearch}
                placeholder="Order key"
                placeholderTextColor="#8B8B8B"
              />
            </View>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.txtBtn}>Recover</Text>
            </TouchableOpacity>
          </View> */}
            <View>
              <FlatList
                bounces={false}
                ListHeaderComponent={this.renderHeader}
                data={this.getData()}
                showsVerticalScrollIndicator={false}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor} // Performance purpose
                removeClippedSubviews={false}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={1}
                style={{ borderBottomWidth: 1, borderColor: '#E3E3E3' }}
              />
            </View>
          </View>
        </ScrollView>
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
)(withTranslation()(YourOrder));
