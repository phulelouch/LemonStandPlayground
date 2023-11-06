import * as React from 'react';
import {View, Image, Dimensions, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Images} from 'app-assets';
import i18next from '../config/translations';

import Home from '../screens/home';
import Courses from '../screens/courses';
import MyCourse from '../screens/my-course';
import Wishlist from '../screens/wishlist';
import Profile from '../screens/profile';
import Settings from '../screens/settings/index';
import YourOrder from '../screens/your-order';
import YourCourses from '../screens/your-courses';

const deviceWidth = Dimensions.get('window').width;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_SCREENS = [
  {
    name: 'HomeScreen',
    component: Home,
    icon: Images.iconTabHome,
    label: i18next.t('bottomNavigation.home'),
  },
  {
    name: 'Courses',
    component: Courses,
    icon: Images.iconTabCoures,
    label: i18next.t('bottomNavigation.courses'),
  },
  {
    name: 'MyCourse',
    component: MyCourse,
    icon: Images.iconTabMyCourse,
    label: i18next.t('bottomNavigation.myCourse'),
  },
  {
    name: 'Wishlist',
    component: Wishlist,
    icon: Images.iconWishlist,
    label: i18next.t('bottomNavigation.wishlist'),
  },
  {
    name: 'ProfileStackScreen',
    component: ProfileStack,
    icon: Images.iconTabProfile,
    label: i18next.t('bottomNavigation.profile'),
  },
];

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000',
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderColor: 'transparent',
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 10,
        },
      }}>
      {TAB_SCREENS.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={{
            tabBarLabel: ({focused, color, position}) => (
              <TabBarLabel
                focused={focused}
                color={color}
                label={item.label}
                position={position}
              />
            ),
            tabBarIcon: ({focused, color}) => (
              <TabBarIcon focused={focused} icon={item.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      presentation="card"
      screenOptions={{
        gesturesEnabled: true,
        headerTintColor: '#000',
        headerBackTitle: '',
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="SettingsScreen" component={Settings} />
      <Stack.Screen name="YourOrderScreen" component={YourOrder} />
      <Stack.Screen name="YourCoursesScreen" component={YourCourses} />
    </Stack.Navigator>
  );
}

function TabBarLabel({focused, color, label, position}) {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
        color: color || '#D1D1D1',
        zIndex: 100,
        marginLeft: position === 'beside-icon' ? 15 : 0,
      }}>
      {label}
    </Text>
  );
}

function TabBarIcon({focused, icon, color}) {
  return (
    <View>
      {deviceWidth < 600 && focused && (
        <Image
          source={Images.iconTabActive}
          style={{
            width: deviceWidth / 8,
            height: 3,
            position: 'absolute',
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={icon}
          style={{
            width: 20,
            height: 18,
            resizeMode: 'contain',
            position: 'relative',
            tintColor: color || '#D1D1D1',
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
