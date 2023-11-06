import React, { Component } from 'react';
import { TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { RenderDataHTML } from 'app-component';

import styles from './styles/learn-today-horizontal';

const COLORS = [
  '#FFF1E1',
  '#E9FFE1',
  '#E1F3FF',
  '#E1E2FF',
  '#E1FFFD',
  '#F5E1FF',
  '#FFE1EC',
  '#FFF7E1',
];

export default class LearnTodayHorizontal extends Component {
  onNavigateDetail = () => {
    const { navigation, item } = this.props;
    navigation.navigate('Courses');
    DeviceEventEmitter.emit('refresh_with_category', item.id);
  };

  generateColor = () => {
    return `${COLORS[Math.floor(Math.random() * COLORS.length)]}`;
  };

  render() {
    const { item } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onNavigateDetail}
        style={[styles.container, { backgroundColor: this.generateColor() }]}
      >
        <RenderDataHTML html={item.name} style={styles.title} />
      </TouchableOpacity>
    );
  }
}
