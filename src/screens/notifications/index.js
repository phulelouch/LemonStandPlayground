import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Client} from 'app-api';
import {useTranslation} from 'react-i18next';
import notifee from '@notifee/react-native';
import {Images} from 'app-assets';
import styles from './styles';
import ListNotifications from '../../component/list/list-notification';

export default function Notifications({navigation}) {
  const {t} = useTranslation();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotifications();
    notifee.setBadgeCount(0);
  }, []);

  const refreshScreen = () => {
    setRefreshing(true);
    setPage(1);

    getNotifications();

    setRefreshing(false);
  };

  const getNotifications = async () => {
    try {
      const response = await Client.getNotifications();

      if (response.success) {
        const {data: notifications, total_pages: total} = response;

        if (page === 1) {
          setData(notifications);
        } else {
          setData(data.concat(notifications));
        }
        setTotalPages(total);
      } else {
        setData([]);
      }
    } catch (e) {
      setError(e.message || t('notification.error'));
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (page >= totalPages) {
      return;
    }

    setShowFooter(true);
    setPage(page + 1);

    getNotifications();

    setShowFooter(false);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        {item.image && (
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.itemImage}
          />
        )}
        <View style={styles.itemContentContainer}>
          {item.title ? (
            <Text style={styles.itemTitle}>{item.title}</Text>
          ) : null}
          <Text style={styles.itemContent}>{item.content}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
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
          <Text style={styles.title}>{t('notification.title')}</Text>
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
              {t('notification.empty')}
            </Text>
          ) : (
            <View style={styles.listContainer}>
              <ListNotifications
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{paddingBottom: 150}}
                refreshScreen={refreshScreen}
                refreshing={refreshing}
                nextPage={loadMore}
                showFooter={showFooter}
                scrollEnabled
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}
