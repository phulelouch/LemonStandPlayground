/* eslint-disable no-param-reassign */
import React, {
  useImperativeHandle,
  useReducer,
  useRef,
  forwardRef,
  memo,
} from 'react';
import { ActivityIndicator, FlatList, Animated } from 'react-native';
import { LearnTodayHorizontal, LearnTodayVertical } from 'app-component';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const LearnToday = memo(
  forwardRef((props, ref) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const flatList = useRef();
    const onEndReachedCalledDuringMomentum = true;
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
        return <LearnTodayHorizontal item={item} navigation={navigation} />;
      }

      return <LearnTodayVertical item />;
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

    return (
      <FlatListAnimated
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
        keyExtractor={keyExtractor} // Performance purpose
        removeClippedSubviews={false}
        onEndReachedThreshold={0.5}
        ListFooterComponent={showFooter && <ActivityIndicator size="large" />}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={1}
      />
    );
  }),
  () => false
);
export default LearnToday;
