import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, FlatList } from 'react-native';

// Skeleton FlatList opacity animation.
const SkeletonFlatList = ({ items = 3, itemStyles }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  // Return horizontal FlatList with animated opacity.
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={Array(items).fill('')}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <Animated.View
          style={[{ ...styles.item, ...itemStyles }, { opacity }]}
        />
      )}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    width: 220,
    height: 134,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default SkeletonFlatList;
