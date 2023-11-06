/* eslint-disable no-param-reassign */
import React, { useReducer, useRef, forwardRef, memo } from 'react';
import { ActivityIndicator, FlatList, Animated } from 'react-native';
import { ItemMyCourse } from 'app-component';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const ListMyCourse = memo(
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
      onRefresh,
    } = props;

    const renderItem = ({ item }) => {
      return <ItemMyCourse item={item} navigation={navigation} />;
    };

    const keyExtractor = (item) => String(item?.id);

    const onEndReached = () => {
      if (!data) return;
      if (data.length === 0) return;
      if (nextPage) nextPage();
    };

    const ListFooter = () => {
      if (showFooter) return <ActivityIndicator size="small" />;
      return null;
    };

    return (
      <FlatListAnimated
        removeClippedSubviews={false}
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
        renderItem={renderItem}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        keyExtractor={keyExtractor} // Performance purpose
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={1}
      />
    );
  }),
  () => false
);
export default ListMyCourse;
