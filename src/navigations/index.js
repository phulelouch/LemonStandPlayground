import React from 'react';
import {PixelRatio, Platform, Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from './bottom-tab';

import Login from '../screens/login/index';
import Register from '../screens/register';
import Forgot from '../screens/forgot';
import Settings from '../screens/settings/index';
import YourOrder from '../screens/your-order';
import YourCourses from '../screens/your-courses';
import CoursesSearch from '../screens/courses-search';
import CoursesDetails from '../screens/courses-details';
import Learning from '../screens/learning';
import FinishLearning from '../screens/finish-learning';
import instructor from '../screens/instructor';
import notifications from '../screens/notifications';
import Reviews from '../screens/reviews';

const {width} = Dimensions.get('window');

const extraHeaderConfig =
  PixelRatio.get() <= 2 && Platform.OS === 'ios' ? {minWidth: 800} : {};

const headerStyle = {
  backgroundColor: '#000',
  borderWidth: 0,
  borderBottomColor: 'transparent',
  shadowColor: 'transparent',
  elevation: 0,
  shadowRadius: 0,
  shadowOffset: {
    height: 0,
  },
};

const headerTitleStyle = {
  alignSelf: 'center',
  width: width * 0.86,
  textAlign: 'center',
  fontSize: 19,
  ...extraHeaderConfig,
};

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabScreen"
      presentation="card"
      screenOptions={{
        gesturesEnabled: true,
        headerTintColor: '#000',
        headerBackTitle: '',
        headerStyle,
        headerTitleStyle,
        headerShown: false,
      }}>
      <Stack.Screen name="HomeTabScreen" component={BottomTabNavigator} />
      <Stack.Screen name="LoginScreen" component={Login} />
      <Stack.Screen name="RegisterScreen" component={Register} />
      <Stack.Screen name="SettingsScreen" component={Settings} />
      <Stack.Screen name="ForgotScreen" component={Forgot} />
      <Stack.Screen name="YourOrderScreen" component={YourOrder} />
      <Stack.Screen name="YourCoursesScreen" component={YourCourses} />
      <Stack.Screen name="CoursesSearchScreen" component={CoursesSearch} />
      <Stack.Screen name="CoursesDetailsScreen" component={CoursesDetails} />
      <Stack.Screen name="LearningScreen" component={Learning} />
      <Stack.Screen name="FinishLearningScreen" component={FinishLearning} />
      <Stack.Screen name="InstructorScreen" component={instructor} />
      <Stack.Screen name="NotificationsScreen" component={notifications} />
      <Stack.Screen name="ReviewsScreen" component={Reviews} />
    </Stack.Navigator>
  );
}
