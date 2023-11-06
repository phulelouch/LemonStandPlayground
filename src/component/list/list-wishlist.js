/* eslint-disable no-param-reassign */
import React, { useReducer, useRef, forwardRef, memo } from 'react';
import { FlatList, Animated, Dimensions } from 'react-native';
import { ItemWishlist } from 'app-component';

const { width } = Dimensions.get('window');

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const ListWishlist = memo(
  forwardRef((props, ref) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const flatList = useRef();
    let onEndReachedCalledDuringMomentum = true;
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
      return <ItemWishlist item={item} navigation={navigation} />;
    };

    const keyExtractor = (item) => String(item?.id);

    const onEndReached = () => {
      if (!onEndReachedCalledDuringMomentum) {
        if (!data) return;
        if (data.length === 0) return;
        if (nextPage) nextPage();
        onEndReachedCalledDuringMomentum = true;
      }
    };

    const ListFooter = () => {
      // if (horizontal) return (
      //   <TouchableOpacity style={{ width: 100, height: 134, justifyContent: 'center', alignItems: 'center' }}>
      //     <Text style={{
      //       fontFamily: "Poppins",
      //       fontWeight: "500",
      //       fontSize: 12,
      //       lineHeight: 18
      //     }}>All source</Text>
      //   </TouchableOpacity>)
      // if (showFooter) return (<ActivityIndicator size="large" />)
      return null;
    };

    return (
      <FlatListAnimated
        ref={flatList}
        removeClippedSubviews={false}
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
        numColumns={width > 600 ? 2 : 1}
      />
    );
  }),
  () => false
);
export default ListWishlist;
