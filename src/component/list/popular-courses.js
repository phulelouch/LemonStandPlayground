/* eslint-disable no-param-reassign */
import React, { useReducer, useRef, forwardRef, memo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  PopularCoursesHorizontal,
  PopularCoursesVertical,
} from 'app-component';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const PopularCourses = memo(
  forwardRef((props, ref) => {
    const {
      data,
      style,
      horizontal,
      showFooter,
      refreshing,
      refreshScreen,
      contentContainerStyle,
      scrollEnabled,
      ListEmptyComponent,
      navigation,
      nextPage,
      onRefresh,
    } = props;

    const renderItem = ({ item }) => {
      if (horizontal) {
        return (
          <PopularCoursesHorizontal
            item={item}
            onNavigateDetails={onNavigateDetails}
          />
        );
      }

      return <PopularCoursesVertical item />;
    };

    const onNavigateDetails = (item) => {
      navigation.navigate('CoursesDetailsScreen', { id: item.id });
    };

    const keyExtractor = (item) => String(item.id);

    const onEndReached = () => {
      // if (!onEndReachedCalledDuringMomentum) {
      //   if (!data) return;
      //   if (data.length === 0) return;
      //   if (nextPage) nextPage();
      //   onEndReachedCalledDuringMomentum = true;
      // }
    };

    const ListFooter = () => {
      if (horizontal) {
        return (
          <TouchableOpacity
            style={{
              width: 100,
              height: 134,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              All source
            </Text>
          </TouchableOpacity>
        );
      }
      if (showFooter) {
        return <ActivityIndicator size="large" />;
      }
      return null;
    };

    return (
      <FlatListAnimated
        scrollEnabled={scrollEnabled}
        contentContainerStyle={contentContainerStyle}
        style={style}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshScreen}
        refreshing={refreshing}
        data={data}
        renderItem={renderItem}
        onEndReached={onEndReached}
        keyExtractor={keyExtractor} // Performance purpose
        removeClippedSubviews={false}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={1}
      />
    );
  }),
  () => false
);
export default PopularCourses;
