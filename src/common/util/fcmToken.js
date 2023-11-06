import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Client from '../../api/client';
import { setFCMToken } from '../../actions/user';
import { store } from '../../index';

export async function registerFCMToken() {
  const { user } = store.getState();

  try {
    // Check user is login
    if (!user?.token) return;

    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    // Check token in store and token device is same
    if (user?.fcmToken === token) return;

    store.dispatch(setFCMToken(token));

    // Save token to server
    await Client.registerFCMToken({
      device_token: token,
      device_type: Platform.OS === 'ios' ? 'ios' : 'android',
    });
  } catch (error) {
    console.log('registerFCMTokenError', error);
  }
}

export async function deleteFCMToken() {
  const { user } = store.getState();

  try {
    // Check user is login
    if (!user?.token) {
      throw new Error('User is null');
    }

    if (!user?.fcmToken) {
      throw new Error('FCMToken is null');
    }

    // Delete the device with FCM
    await messaging().unregisterDeviceForRemoteMessages();

    await Client.deleteFCMToken({
      device_token: user?.fcmToken,
    });

    store.dispatch(setFCMToken(null));
  } catch (error) {
    console.log('deleteFCMTokenError', error);
  }
}
