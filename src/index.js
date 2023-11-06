import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import codePush from 'react-native-code-push';
import notifee, {EventType, AuthorizationStatus} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import './config/translations';
import RootScreen from './screens/root';
import configStore from './store/index';
import {setToken} from './api/config';
import {saveStatusNetwork} from './actions/network';
import {CODE_PUSH} from './config';
import {registerFCMToken} from './common/util/fcmToken';
import {navigationRef, navigate} from './navigations/navigations';

const {store, persistor} = configStore();

export {store};

const MyApp = () => {
  useEffect(() => {
    async function setup() {
      try {
        await codePush.sync({
          deploymentKey:
            Platform.OS === 'ios' ? CODE_PUSH.ios : CODE_PUSH.android,
          installMode: codePush.InstallMode.IMMEDIATE,
        });
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      } catch (e) {
        console.log(e);
      }

      await onNotification();
    }

    setup();
  }, []);

  async function onNotification() {
    // Request permissions (required for iOS)
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      // TODO: Add setting to enable/disable notifications in store.
    }

    await registerFCMToken();

    messaging().onMessage(remoteMessage => {
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
        },
      });
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigate('NotificationsScreen');
    });

    notifee.onForegroundEvent(({type}) => {
      switch (type) {
        case EventType.PRESS:
          navigate('NotificationsScreen');
          break;
      }
    });
  }

  const onBeforeLift = async () => {
    NetInfo.addEventListener(async state => {
      try {
        await store.dispatch(saveStatusNetwork(state.isConnected));
      } catch (e) {
        console.log(e);
      }
    });

    const {user} = store.getState();

    if (user?.token) {
      setToken(user?.token);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={onBeforeLift}
        loading={null}
        persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar
            translucent
            backgroundColor="rgba(255,255,255,0.1)"
            barStyle="dark-content"
          />
          <RootScreen />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default codePush(MyApp);
