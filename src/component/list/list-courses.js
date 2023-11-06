/* eslint-disable no-param-reassign */
import React, { useReducer, useRef, forwardRef, memo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ItemCourse } from 'app-component';

const { width } = Dimensions.get('window');

const ListCourses = memo(
  forwardRef((props, ref) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const flatList = useRef();
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
      extraData,
    } = props;

    const renderItem = ({ item }) => {
      return <ItemCourse item={item} navigation={navigation} />;
    };

    const keyExtractor = (item) => String(item.id);

    const onEndReached = () => {
      if (!data) return;
      if (data.length === 0) return;
      if (nextPage) nextPage();
    };

    const ListFooter = () => {
      if (horizontal)
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
      if (showFooter) return <ActivityIndicator size="small" />;
      return null;
    };

    return (
      <FlatList
        ref={flatList}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={contentContainerStyle}
        style={style}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshScreen}
        refreshing={refreshing}
        data={data}
        extraData={extraData}
        renderItem={renderItem}
        onEndReached={onEndReached}
        keyExtractor={keyExtractor} // Performance purpose
        removeClippedSubviews
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={1}
        numColumns={width > 600 ? 2 : 1}
      />
    );
  }),
  () => false
);
export default ListCourses;
