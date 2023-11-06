/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import styles from './styles/item-my-course';

class ItemMyCourse extends PureComponent {
  onNavigateDetail = (item) => {
    const { navigation } = this.props;
    navigation.navigate('CoursesDetailsScreen', { id: item.id });
  };

  render() {
    const { t, item } = this.props;
    const target = item.meta_data._lp_passing_condition;
    const progress = item.course_data?.result?.result || 0;
    const categories =
      item.categories.length > 0
        ? item.categories.map((x) => x.name).join(', ')
        : null;
    return (
      <TouchableOpacity
        onPress={() => this.onNavigateDetail(item)}
        style={styles.container}
      >
        <FastImage source={{ uri: item.image }} style={styles.image} />
        <View style={styles.viewContent}>
          {categories && (
            <Text numberOfLines={1} style={styles.content}>
              {categories}
            </Text>
          )}
          <Text style={styles.txt1} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={{
              height: 3,
              backgroundColor: '#F3F3F3',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <View
              style={{
                zIndex: 100,
                position: 'absolute',
                height: 7,
                width: 1,
                backgroundColor: '#000',
                left: `${String(target)}%`,
              }}
            />
            <View
              style={{
                width: `${String(progress)}%`,
                height: 3,
                backgroundColor:
                  item.course_data.graduation === 'failed'
                    ? '#FF6161'
                    : item.course_data.graduation === 'passed'
                    ? '#56C943'
                    : '#58C3FF',
              }}
            />
          </View>
          <View>
            {item.course_data.graduation === 'passed' && (
              <Text style={styles.txtPass}>{t('myCourse.filters.passed')}</Text>
            )}
            {item.course_data.graduation === 'failed' && (
              <Text style={styles.txtFail}>{t('myCourse.filters.failed')}</Text>
            )}
            {item.course_data.graduation === 'in-progress' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.txtProgress}>
                  {t('myCourse.filters.inProgress')}
                </Text>
                <Text style={[styles.txtProgress, { color: '#939393' }]}>
                  {item.duration}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default withTranslation()(ItemMyCourse);
