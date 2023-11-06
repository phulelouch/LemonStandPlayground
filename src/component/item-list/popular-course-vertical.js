import React, { memo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Images } from 'app-assets';
import styles from './styles/popular-course-vertical';

const PopularCoursesVertical = memo(
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
export default PopularCoursesVertical;
