import React, {useEffect} from 'react';
import {TextInput, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedText = Animated.createAnimatedComponent(TextInput);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const ProgressCircle = ({
  widthX = 100,
  strokeWidth = 10,
  progress = 0,
  progressColor = '#000',
  backgroundColor = '#fff',
  duration = 1000,
  easing = Easing.linear,
  style,
  textStyle,
}) => {
  const radius = (widthX - strokeWidth) / 2;

  const circumference = radius * 2 * Math.PI;

  const progressRef = useSharedValue(0);

  useEffect(() => {
    progressRef.value = withTiming(progress, {
      duration,
      easing,
    });
  }, [duration, easing, progress, progressRef]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - progressRef.value * circumference;

    return {
      strokeDashoffset,
    };
  });

  const textValue = useDerivedValue(() => {
    return `${Math.round(progressRef.value * 100)}%`;
  }, [progressRef]);

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: textValue.value,
      value: textValue.value,
    };
  });

  return (
    <View style={style}>
      <AnimatedSvg
        width={widthX}
        height={widthX}
        viewBox={`0 0 ${widthX} ${widthX}`}
        style={{
          transform: [{rotateZ: '-90deg'}],
        }}>
        <Circle
          cx={widthX / 2}
          cy={widthX / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="transparent"
        />
        <AnimatedCircle
          cx={widthX / 2}
          cy={widthX / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap={'round'}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="transparent"
        />
      </AnimatedSvg>
      <View
        style={{
          position: 'absolute',
          width: widthX,
          height: widthX,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
        <AnimatedText
          textAnchor="middle"
          underlineColorAndroid="transparent"
          editable={false}
          multiline={false}
          numberOfLines={1}
          animatedProps={animatedTextProps}
          style={[
            {
              fontFamily: 'Poppins-Medium',
              fontWeight: '500',
              fontSize: 12,
              color: '#000',
            },
            textStyle,
          ]}
        />
      </View>
    </View>
  );
};
export default ProgressCircle;
