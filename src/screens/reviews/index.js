import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Rating} from 'react-native-ratings';
import {Client} from 'app-api';
import {Images} from 'app-assets';
import styles from './styles';

export default function Reviews({navigation, route}) {
  const {t} = useTranslation();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFooter, setShowFooter] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  useEffect(() => {
    async function getReviews() {
      try {
        const id = route.params?.id;

        if (!id) {
          throw new Error(t('reviews.error'));
        }

        if (page > totalPages) {
          return;
        }

        if (!loadingMore && !refreshing) {
          return;
        }

        if (loadingMore) {
          setShowFooter(true);
        }

        const response = await Client.getReview(id, {
          per_page: 15,
          page,
        });

        if (response?.status === 'success') {
          if (page === 1) {
            setData(response?.data?.reviews?.reviews || []);
          } else {
            setData(data.concat(response?.data?.reviews?.reviews || []));
          }
          if (response?.data?.reviews?.pages) {
            setTotalPages(response.data.reviews.pages);
          }
        } else {
          setData([]);
        }
      } catch (e) {
        setError(e.message || t('reviews.error'));
      }

      setRefreshing(false);
      setLoadingMore(false);
      setShowFooter(false);
    }

    getReviews();
  }, [refreshing, loadingMore]);

  const handleRefresh = React.useCallback(async () => {
    setData([]);
    setRefreshing(true);
    setLoadingMore(false);
    setPage(1);
  }, []);

  function handleLoadMore(d) {
    if (!isScrollEnd) {
      return;
    }

    if (loadingMore || refreshing) {
      return;
    }

    if (!data || data.length <= 0) {
      return;
    }

    setLoadingMore(true);
    setPage(page + 1);

    setIsScrollEnd(false);
  }

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#EBEBEB',
          paddingBottom: 16,
          marginBottom: 16,
          paddingHorizontal: 16,
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
            imageSize={13}
            readonly
            ratingColor="#FBC815"
            startingValue={Number(item.rate)}
          />
        </View>
        <Text style={styles.titleRating}>{item.title}</Text>
        <Text style={styles.contentRating}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
      <View style={styles.header}>
        <View style={styles.header1}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Image source={Images.iconBack} style={styles.iconBack} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('reviews.title')}</Text>
          <View style={styles.iconBack} />
        </View>
      </View>

      {error ? (
        <Text
          style={[styles.dataNotFound, {alignSelf: 'center', marginTop: 50}]}>
          {error}
        </Text>
      ) : (
        <>
          {!refreshing && data.length === 0 ? (
            <Text
              style={[
                styles.dataNotFound,
                {alignSelf: 'center', marginTop: 50},
              ]}>
              {t('reviews.empty')}
            </Text>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                contentContainerStyle={{paddingBottom: 30}}
                removeClippedSubviews={false}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                refreshing={refreshing}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#000"
                    progressViewOffset={30}
                  />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onScrollBeginDrag={() => {
                  setIsScrollEnd(true);
                }}
                onMomentumScrollBegin={() => {
                  setIsScrollEnd(true);
                }}
                ListFooterComponent={() =>
                  showFooter ? (
                    <View
                      style={{
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator size="small" color="#000" />
                    </View>
                  ) : null
                }
                scrollEnabled={true}
                scrollEventThrottle={1}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}
