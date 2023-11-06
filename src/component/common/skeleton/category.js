import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, FlatList } from 'react-native';

// Skeleton FlatList opacity animation.
const SkeletonCategory = ({ items = 6 }) => {
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
        <View style={styles.container}>
          <Animated.View style={[styles.item, { opacity }]} />
        </View>
      )}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 50,
    paddingVertical: 8,
    marginVertical: 4,
    marginRight: 16,
  },
  item: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
});

export default SkeletonCategory;
