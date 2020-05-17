import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC, ReactElement } from 'react';
import { StackNavigationProps, StackParamList } from './MainStackNavigator';
import { SvgCheckSquare, SvgFeed, SvgMedal, SvgProfile } from '../../utils/Icons';

import { CompositeNavigationProp } from '@react-navigation/native';
import { DefaultTheme } from 'styled-components';
import HomeFeed from '../screen/HomeFeed';
import HomeMission from '../screen/HomeMission';
import HomeProfile from '../screen/HomeProfile';
import HomeRank from '../screen/HomeRank';
import { RouteProp } from '@react-navigation/core';
import { getString } from '../../../STRINGS';
import { useThemeContext } from '../../providers/ThemeProvider';

export type BottomTabParamList = {
  default: undefined;
  HomeMission: undefined;
  HomeFeed: undefined;
  HomeRank: undefined;
  HomeProfile: undefined;
};

type NavigationProps<
  T extends keyof BottomTabParamList = 'default'
> = BottomTabNavigationProp<BottomTabParamList, T>;

export type HomeBottomTabNavigationProps<
  T extends keyof BottomTabParamList = 'default'
> = CompositeNavigationProp<
NavigationProps<T>,
StackNavigationProps<'HomeTab'>
>;

const Tab = createBottomTabNavigator<BottomTabParamList>();

enum TabScreenType {
  feed = 'Feed',
  mission = 'Mission',
  profile = 'Profile',
  rank = 'Rank',
}

const TabBarIcon = (
  focused: boolean,
  theme: DefaultTheme,
  routeName: TabScreenType,
): ReactElement => {
  switch (routeName) {
    case TabScreenType.mission:
      return (
        <SvgCheckSquare
          size={20}
          stroke={focused ? theme.btnPrimary : theme.placeholder}
        />
      );
    case TabScreenType.feed:
      return (
        <SvgFeed
          size={20}
          stroke={focused ? theme.btnPrimary : theme.placeholder}
        />
      );
    case TabScreenType.rank:
      return (
        <SvgMedal
          size={20}
          stroke={focused ? theme.btnPrimary : theme.placeholder}
        />
      );
    case TabScreenType.profile:
      return (
        <SvgProfile
          size={20}
          stroke={focused ? theme.btnPrimary : theme.placeholder}
        />
      );
  }
};

interface Props {
  navigation: StackNavigationProps<'HomeTab'>;
  route: RouteProp<StackParamList, 'HomeTab'>;
}

const MaterialBottomTabNavigator: FC<Props> = () => {
  const { theme } = useThemeContext();

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: theme.btnPrimary,
        tabStyle: {
          backgroundColor: theme.tabBackground,
        },
        style: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Tab.Screen
        name="HomeMission"
        component={HomeMission}
        options={{
          tabBarLabel: getString('MISSION'),
          tabBarIcon: ({ focused }): ReactElement =>
            TabBarIcon(focused, theme, TabScreenType.mission),
        }}
      />
      <Tab.Screen
        name="HomeFeed"
        component={HomeFeed}
        options={{
          tabBarLabel: getString('FEED'),
          tabBarIcon: ({ focused }): ReactElement =>
            TabBarIcon(focused, theme, TabScreenType.feed),
        }}
      />
      <Tab.Screen
        name="HomeRank"
        component={HomeRank}
        options={{
          tabBarLabel: getString('RANK'),
          tabBarIcon: ({ focused }): ReactElement =>
            TabBarIcon(focused, theme, TabScreenType.rank),
        }}
      />
      <Tab.Screen
        name="HomeProfile"
        component={HomeProfile}
        options={{
          tabBarLabel: getString('PROFILE'),
          tabBarIcon: ({ focused }): ReactElement =>
            TabBarIcon(focused, theme, TabScreenType.profile),
        }}
      />
    </Tab.Navigator>
  );
};

export default MaterialBottomTabNavigator;
