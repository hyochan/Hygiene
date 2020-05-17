import { IC_FIRST_RANK, IC_NO_IMAGE, IC_SECOND_RANK, IC_THIRD_RANK } from '../../utils/Icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { User } from '../../types';
import { getString } from '../../../STRINGS';
import { getUserById } from '../../services/firebaseService';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  height: 80px;
  align-self: stretch;
  padding: 0 16px;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const StyledText = styled.Text`
  font-size: 14px;
  color: ${({ theme }): string => theme.font};
`;

interface TextPoint {
  index: number;
}

const StyledTextPoint = styled.Text.attrs<TextPoint>(
  ({ index }) => ({
    index,
  }))<TextPoint>`
  color: ${({ theme, index }): string => index === 0
    ? theme.firstRank
    : index === 1
      ? theme.secondRank
      : index === 2
        ? theme.thirdRank
        : theme.font
  };
`;

interface Props {
  index: number;
  rank: User;
}

const RankListItem: FC<Props> = ({
  index,
  rank,
}) => {
  const [user, setUser] = useState<User>();
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const pressUser = async (): Promise<void> => {
    if (user) {
      navigation.navigate('UserProfile', {
        peerUserId: user.uid,
      });
    }
  };

  const getData = async (): Promise<void> => {
    const user = await getUserById(rank.uid);
    setUser(user as User);
  };

  useEffect(() => {
    getData();
  }, []);

  return <Container>
    <View
      style={{
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {
        index < 3
          ? <Image
            source={
              index === 0
                ? IC_FIRST_RANK
                : index === 1
                  ? IC_SECOND_RANK
                  : index === 2
                    ? IC_THIRD_RANK
                    : null
            }
            style={{
              height: 24,
              width: 24,
            }}
          />
          : <Text style={{
            fontSize: 14,
            color: theme.font,
          }}>{index + 1}</Text>
      }
    </View>
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        marginLeft: 7,
      }}
      onPress={pressUser}
    >
      <Image
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
        }}
        source={
          user && user.thumbURL
            ? { uri: user.thumbURL }
            : user && user.photoURL
              ? { uri: user.photoURL }
              : IC_NO_IMAGE
        }
      />
    </TouchableOpacity>
    <StyledText style={{
      fontWeight: 'bold',
      marginLeft: 7,
    }}>{user?.displayName || getString('UNNAMED')}</StyledText>
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        right: 24,
        alignItems: 'flex-end',
      }}
    >
      <StyledTextPoint
        index={index}
        style={{ fontSize: 24 }}
      >{rank.point ?? 0}</StyledTextPoint><StyledTextPoint
        index={index}
        style={{ fontSize: 18 }}
      >P</StyledTextPoint>
    </View>
  </Container>;
};

export default RankListItem;
