import { IC_NO_IMAGE, SvgPencil } from '../../utils/Icons';
import React, { FC } from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';

import { StackNavigationProps } from '../navigation/MainStackNavigator';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  width: 329px;
  height: 212px;
  background-color: ${({ theme }): string => theme.card};
  padding: 24px 30px;
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }): string => theme.border};

  flex-direction: column;
`;

const ProfileRow = styled.View`
  flex-direction: row;
`;

const ProfileImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

const ScoreRow = styled.View`
  margin-top: 18px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ScoreColumn = styled.View`
  width: 82px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ScoreTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }): string => theme.fontSecondary};
`;

const ScoreText = styled.Text`
  margin-top: 8px;
  font-size: 24px;
  color: ${({ theme }): string => theme.fontSecondary};
`;

const ScoreDivider = styled.View`
  width: 1px;
  height: 32px;
  background-color: ${({ theme }): string => theme.border};
`;

const Column = styled.View`
  flex-direction:column;
  justify-content: center;
  align-items: flex-start;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  color: ${({ theme }): string => theme.font};
`;

interface Props {
  style?: ViewStyle;
  displayName: string;
  photoURL?: string;
  onEdit?: () => void;
  onLogout?: () => void;
  missionScore: number;
  ranking: number;
  feeds: number;
}

const ProfileCard: FC<Props> = ({
  style,
  displayName,
  photoURL,
  onEdit,
  onLogout,
  missionScore,
  ranking,
  feeds,
}) => {
  const { theme } = useThemeContext();

  return <Container style={style}>
    <ProfileRow>
      <ProfileImage
        source={photoURL
          ? { uri: photoURL }
          : IC_NO_IMAGE
        }
        resizeMethod="resize"
      />
      <Column style={{
        marginLeft: 15,
      }}>
        <TouchableOpacity
          onPress={onEdit}
        >
          <Row>
            <Title style={{ marginRight: 4.5 }}>{displayName}</Title>
            <SvgPencil fill={theme.font}/>
          </Row>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogout}
          style={{
            marginTop: 2,
          }}
        >
          <Text style={{
            fontSize: 12,
            color: theme.placeholder,
          }}>{getString('LOGOUT')}</Text>
        </TouchableOpacity>
      </Column>
    </ProfileRow>
    <ScoreRow>
      <ScoreColumn>
        <ScoreTitle
          numberOfLines={1}
        >{getString('MISSION')}</ScoreTitle>
        <ScoreText
          numberOfLines={1}
        >{missionScore}</ScoreText>
      </ScoreColumn>
      <ScoreDivider/>
      <ScoreColumn>
        <ScoreTitle
          numberOfLines={1}
        >{getString('RANK')}</ScoreTitle>
        <ScoreText
          numberOfLines={1}
        >{ranking}</ScoreText>
      </ScoreColumn>
      <ScoreDivider/>
      <ScoreColumn>
        <ScoreTitle
          numberOfLines={1}
        >{getString('FEED')}</ScoreTitle>
        <ScoreText
          numberOfLines={1}
        >{feeds}</ScoreText>
      </ScoreColumn>
    </ScoreRow>
  </Container>;
};

export default ProfileCard;
