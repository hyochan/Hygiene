import { Activity, Category } from '../../types';
import React, { ReactElement } from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity } from 'react-native';

import FeedReply from '../screen/FeedReply';
import HomeTab from './HomeTabNavigator';
import MyFeeds from '../screen/MyFeeds';
import PostActivity from '../screen/PostActivity';
import UserProfile from '../screen/UserProfile';
import { getString } from '../../../STRINGS';
import { useThemeContext } from '../../providers/ThemeProvider';

export type StackParamList = {
  default: undefined;
  HomeTab: undefined;
  UserProfile: {
    updateUser: (photoURL: string, displayName: string) => void;
    peerUserId?: string;
  };
  PostActivity: {
    category: Category;
  };
  FeedReply: {
    feed: Activity;
  };
  MyFeeds: undefined;
};

export type StackNavigationProps<
  T extends keyof StackParamList = 'default'
> = StackNavigationProp<StackParamList, T>;

const Stack = createStackNavigator<StackParamList>();

function MainNavigator(): React.ReactElement {
  const { theme, changeThemeType } = useThemeContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: { color: theme.font },
        headerTintColor: theme.tint,
        headerBackTitle: getString('BACK'),
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          headerTitle: (): ReactElement => (
            <TouchableOpacity onPress={changeThemeType}>
              <Text
                style={{
                  color: theme.font,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >{getString('APP_NAME')}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: getString('PROFILE'),
        }}
      />
      <Stack.Screen
        name="PostActivity"
        component={PostActivity}
        options={{
          title: getString('POST_ACTIVITY'),
        }}
      />
      <Stack.Screen
        name="FeedReply"
        component={FeedReply}
        options={{
          title: getString('REPLY'),
        }}
      />
      <Stack.Screen
        name="MyFeeds"
        component={MyFeeds}
        options={{
          title: getString('MY_FEEDS'),
        }}
      />
    </Stack.Navigator>
  );
}

export default MainNavigator;
