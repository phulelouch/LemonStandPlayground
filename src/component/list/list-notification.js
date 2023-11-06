import React, { useReducer, useRef, forwardRef, memo } from 'react';

import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';

const ListNotifications = memo(
  forwardRef((props, ref) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const flatList = useRef();
    const {
      data,
      style,
      showFooter,
      refreshing,
      refreshScreen,
      contentContainerStyle,
      scrollEnabled,
      ListEmptyComponent,
      nextPage,
      extraData,
      renderItem,
    } = props;

    const keyExtractor = (item) => String(item.id);

    const onEndReached = () => {
      if (!data) return;
      if (data.length === 0) return;
      if (nextPage) nextPage();
    };

    const ListFooter = () => {
      return (
        <View
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color="#000" />
        </View>
      );
    };

    const onRefresh = () => {
      if (refreshScreen) refreshScreen();
    };

    return (
      <FlatList
        ref={flatList}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={showFooter ? ListFooter : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
          />
        }
        scrollEnabled={scrollEnabled}
        ListEmptyComponent={ListEmptyComponent}
        extraData={extraData}
      />
    );
  })
);

export default ListNotifications;
