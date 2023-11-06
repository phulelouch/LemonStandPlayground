import React, { memo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Images } from 'app-assets';
import styles from './styles/learn-today-vertical';

const LearnTodayVertical = memo(
  forwardRef((props, ref) => {
    const onNavigateDetail = () => {
      onPress(productId);
    };

    return (
      <TouchableOpacity onPress={onNavigateDetail} style={styles.container}>

      </TouchableOpacity>
    );
  }),
  () => true
);
export default LearnTodayVertical;
