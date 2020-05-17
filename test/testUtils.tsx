import 'react-native';

import React, { ReactElement } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import RootProvider from '../src/providers';
import { ThemeType } from '../src/providers/ThemeProvider';

export const createTestElement = (
  child: ReactElement,
  themeType?: ThemeType,
): ReactElement => (
  <NavigationContainer>
    <RootProvider initialThemeType={themeType}>{child}</RootProvider>
  </NavigationContainer>
);

export const createTestProps = (
  obj?: object,
  moreScreenProps?: object,
): object | unknown | any => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  },
  screenProps: {
    changeThemeType: jest.fn(),
    ...moreScreenProps,
  },
  ...obj,
});
