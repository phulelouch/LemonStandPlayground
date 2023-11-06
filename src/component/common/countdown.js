import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const CountDown = React.memo(function CountDown({
  duration,
  callBack,
  textStyle = {},
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(interval);
      setTimeLeft(0);

      if (callBack) {
        callBack();
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  const formattedTime = useMemo(() => {
    // Format to hh:mm:ss or mm:ss
    let h = String(Math.floor(timeLeft / 3600));
    let m = String(Math.floor(timeLeft / 60) % 60);
    let s = String(timeLeft % 60);

    if (Number(h) < 10) {
      h = `0${h}`;
    }
    if (Number(m) < 10) {
      m = `0${m}`;
    }
    if (Number(s) < 10) {
      s = `0${s}`;
    }

    let formatted = '';

    if (h === '00') {
      formatted = `${m}:${s}`;
    } else {
      formatted = `${h}:${m}:${s}`;
    }

    return formatted;
  }, [timeLeft]);

  return (
    <View>
      <Text numberOfLines={1} style={{...styles.txtCountDown, ...textStyle}}>
        {formattedTime}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  txtCountDown: {
    color: 'red',
    fontFamily: 'Poppins',
    fontSize: 12,
  },
});
export default CountDown;
