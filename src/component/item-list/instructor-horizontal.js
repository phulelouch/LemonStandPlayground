import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import IconF from 'react-native-vector-icons/Feather';
import styles from './styles/instructor-horizontal';

class InstructorHorizontal extends PureComponent {
  onNavigateDetail = () => {
    const {navigation, item} = this.props;
    navigation.navigate('InstructorScreen', {instructor: item});
  };

  render() {
    const {t, item} = this.props;

    return (
      <TouchableOpacity
        onPress={this.onNavigateDetail}
        style={styles.container}>
        <Image
          source={{
            uri:
              item.avatar_url ||
              'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
          }}
          style={styles.avatar}
        />
        <View style={{marginLeft: 10, flex: 1}}>
          <Text style={styles.title} numberOfLines={1}>
            {item.nickname}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Text style={styles.childTitle}>
              {t('home.countCourse', {
                count: item.instructor_data?.total_courses || 0,
              })}
            </Text>
            <Text style={styles.childTitle}>
              {t('home.countStudent', {
                count: item.instructor_data?.total_users || 0,
              })}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <IconF name="send" size={12} color="#D2D2D2" />
            <IconF name="phone-call" size={12} color="#D2D2D2" />
            <IconF name="instagram" size={12} color="#D2D2D2" />
            <IconF name="twitter" size={12} color="#D2D2D2" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTranslation()(InstructorHorizontal);
