import { ThemeProvider, ThemeType } from '../providers/ThemeProvider';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AppProvider } from './AppProvider';
import { FeedProvider } from './FeedProvider';
import React from 'react';
import { useColorScheme } from 'react-native-appearance';

interface Props {
  initialThemeType?: ThemeType;
  children?: React.ReactElement;
}

// Add providers here
const RootProvider = ({
  initialThemeType = ThemeType.LIGHT,
  children,
}: Props): React.ReactElement => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      initialThemeType={
        colorScheme === 'dark'
          ? ThemeType.DARK
          : colorScheme === 'light'
            ? ThemeType.LIGHT : initialThemeType}
    >
      <ActionSheetProvider>
        <AppProvider>
          <FeedProvider>
            {children}
          </FeedProvider>
        </AppProvider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
