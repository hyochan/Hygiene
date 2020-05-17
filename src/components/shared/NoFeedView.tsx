import { IC_NO_VIRUS_D, IC_NO_VIRUS_L } from '../../utils/Icons';
import { Image, Text } from 'react-native';
import React, { FC } from 'react';
import { ThemeType, useThemeContext } from '../../providers/ThemeProvider';

import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;

  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NoFeedView: FC = ({
  children,
}) => {
  const { theme, themeType } = useThemeContext();

  return <Container>
    <Image
      source={
        themeType === ThemeType.LIGHT
          ? IC_NO_VIRUS_L
          : IC_NO_VIRUS_D
      }
      style={{
        height: 140,
        width: 140,
      }}
    />
    <Text
      style={{
        marginTop: 40,
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.font,
        textAlign: 'center',
      }}
    >{getString('NO_FEED')}</Text>
    <Text
      style={{
        marginTop: 5,
        fontSize: 14,
        color: theme.placeholder,
        textAlign: 'center',
        marginBottom: 40,
      }}
    >{getString('NO_FEED_DESCRIPTION')}</Text>
  </Container>;
};

export default NoFeedView;
