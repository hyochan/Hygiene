import React, { ReactElement } from 'react';
import { ThemeType, useThemeContext } from '../../providers/ThemeProvider';

import { StatusBar } from 'react-native';

export default function Shared(): ReactElement {
  const { themeType, theme } = useThemeContext();

  const statusColor =
    themeType === ThemeType.LIGHT ? 'dark-content' : 'light-content';

  return <StatusBar
    barStyle={statusColor}
    backgroundColor={theme.backgroundDark}
  />;
}
