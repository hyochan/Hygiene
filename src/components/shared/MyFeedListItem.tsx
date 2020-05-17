import { Image, Text, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';

import { Activity } from '../../types';
import styled from 'styled-components/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const FeedRow = styled.View`
  width: 332px;
  height: 112px;
  background-color: ${({ theme }): string => theme.card};
  margin-top: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: 0 20px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

interface Props {
  feed: Activity;
  onPress?: () => void;
}

const MyFeedListItem: FC<Props> = ({
  feed,
  onPress,
}) => {
  const { theme } = useThemeContext();

  return <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
  >
    <FeedRow key={feed.id}>
      <Column>
        <Text style={{
          color: theme.font,
          fontSize: 14,
          marginBottom: 6,
          width: 180,
        }}>{feed.message}</Text>
      </Column>
      <Image
        resizeMethod="resize"
        style={{
          width: 80,
          height: 80,
          borderRadius: 16,
        }}
        source={{
          uri: feed.urls[0],
        }}
      />
    </FeedRow>
  </TouchableOpacity>;
};

export default MyFeedListItem;
