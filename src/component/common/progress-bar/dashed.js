import React from 'react';
import { View } from 'react-native';
import { Colors } from 'app-assets';
import styles from './styles/dashed';

const { background } = Colors;
export default ({ progress, total, style, itemStyle }) => {
  const views = [];
  for (let i = 1; i <= total; i += 1)
    views.push(
      <View
        key={i}
        style={[
          styles.item,
          itemStyle,
          {
            backgroundColor:
              i <= progress ? background.bluePrimary : background.greyLight,
          },
        ]}
      />
    );

  return <View style={[styles.container, style]}>{views}</View>;
};
