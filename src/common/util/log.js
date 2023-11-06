/* eslint-disable no-undef */
import ReactoTron from 'reactotron-react-native';

export function consoleLog(...args: any[]) {
  if (__DEV__) {
    console.log(...args);
  }
}

export function consoleDebug(...args: any[]) {
  if (__DEV__) {
    console.debug(args);
  }
}

export function tronLog(...args: any[]) {
  if (__DEV__) {
    ReactoTron.log(args);
  }
}
