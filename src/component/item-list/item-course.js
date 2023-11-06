/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { withTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { Images } from 'app-assets';
import IconI from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Client } from 'app-api';
import styles from './styles/item-course';
import { showLoading } from '../../actions/common';
import { saveDataWishlist } from '../../actions/wishlist';

class ItemCourse extends PureComponent {
  onNavigateDetail = (item) => {
    const { navigation } = this.props;
    navigation.navigate('CoursesDetailsScreen', { id: item.id });
  };

  onToggleWishlish = async () => {
    const { dispatch, item } = this.props;
    const param = {
      id: item.id,
    };
    dispatch(showLoading());
    const response = await Client.addRemoveWishlist(param);
    dispatch(showLoading(false));
    if (response.status === 'success') {
      dispatch(saveDataWishlist(response?.data?.items || []));
    } else {
      Alert.alert(response.message);
    }
  };

  render() {
    const { t, item, wishlist } = this.props;
    const dataWishlist = wishlist?.data;
    const ids =
      wishlist && dataWishlist.length > 0 ? dataWishlist.map((x) => x.id) : [];
    return (
      <TouchableOpacity
        onPress={() => this.onNavigateDetail(item)}
        style={styles.container}
      >
        <FastImage
          style={styles.image}
          source={{
            uri: item.image,
          }}
        >
          {item.on_sale ? (
            <View
              style={{
                backgroundColor: '#FBC815',
                top: 20,
                left: 20,
                width: 49,
                borderRadius: 4,
                height: 21,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.txtSale}>{t('sale')}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={this.onToggleWishlish}
            style={{
              position: 'absolute',
              top: 10,
              right: 15,
              backgroundColor: ids.includes(item.id)
                ? '#FBC815'
                : 'rgba(0,0,0,0.2)',
              borderRadius: 6,
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconI name="heart-outline" color="#fff" size={22} />
          </TouchableOpacity>
          <View style={styles.viewAvatar}>
            <View>
              {item.on_sale ? (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 30,
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  {item?.sale_price_rendered ? (
                    <Text style={styles.price}>{item.sale_price_rendered}</Text>
                  ) : (
                    <Text style={styles.price}>${item.sale_price}</Text>
                  )}
                  {item?.origin_price_rendered ? (
                    <Text style={styles.oldPrice}>
                      {item.origin_price_rendered}
                    </Text>
                  ) : (
                    <Text style={styles.oldPrice}>${item.origin_price}</Text>
                  )}
                </View>
              ) : item.price > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 30,
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  {item?.price_rendered ? (
                    <Text style={styles.price}>{item?.price_rendered}</Text>
                  ) : (
                    <Text style={styles.price}>${item?.price}</Text>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 30,
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={styles.price}>{t('free')}</Text>
                </View>
              )}
            </View>
            <View>
              {item.rating > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconI name="star" color="#FBC815" size={15} />
                  <Text style={styles.rate}>{item.rating}</Text>
                </View>
              )}
            </View>
          </View>
        </FastImage>
        <View style={{ padding: 15 }}>
          {item?.categories && item?.categories.length > 0 && (
            <Text style={styles.content} numberOfLines={1}>
              {item?.categories.map((x) => x.name).join(', ')}
            </Text>
          )}
          <Text numberOfLines={2} style={styles.title}>
            {item.name}
          </Text>
          <View
            style={{ flexDirection: 'row', marginTop: 9, alignItems: 'center' }}
          >
            <Image source={Images.iconClock} style={styles.icon} />
            <Text style={styles.txt1}>{t('durations')}</Text>
            <Text style={styles.content}>{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = ({ wishlist }) => ({
  wishlist,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ItemCourse));
