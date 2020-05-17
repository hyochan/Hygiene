import {
  IC_MORE,
  IC_NO_IMAGE,
} from '../../utils/Icons';
import { Image, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { Reply, User } from '../../types';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { getString } from '../../../STRINGS';
import { getUserById } from '../../services/firebaseService';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  align-self: stretch;
  border-bottom-width: 1px;
  border-color: ${({ theme }): string => theme.border};

  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const StyledText = styled.Text`
  font-size: 14px;
  color: ${({ theme }): string => theme.font};
`;

const Head = styled.View`
  align-self: stretch;
  padding: 0 20px;
  margin-top: 20px;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Message = styled.Text`
  font-size: 14px;
  color: ${({ theme }): string => theme.font};
  padding: 20px;
`;

interface Props {
  reply: Reply;
  onMorePressed?: () => void;
}

const ReplyListItem: FC<Props> = ({
  reply,
  onMorePressed,
}) => {
  const [user, setUser] = useState<User>();
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const getData = async (): Promise<void> => {
    const user = await getUserById(reply.writerId);
    setUser(user as User);
  };

  const pressUser = async (): Promise<void> => {
    if (user) {
      navigation.navigate('UserProfile', {
        peerUserId: user.uid,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <Container>
    <Head>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flexDirection: 'row' }}
        onPress={pressUser}
      >
        <Image
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
          }}
          source={
            user && user.thumbURL
              ? { uri: user.thumbURL }
              : user && user.photoURL
                ? { uri: user.photoURL }
                : IC_NO_IMAGE
          }
        />
        <Column style={{ marginLeft: 6 }}>
          <StyledText style={{
            fontWeight: 'bold',
          }}>{user?.displayName || getString('UNNAMED')}</StyledText>
          <StyledText style={{
            fontSize: 12,
            marginTop: 6,
            color: theme.placeholder,
          }}>{
              reply.createdAt
                ? formatDistanceToNow(reply.createdAt)
                : ''
            }</StyledText>
        </Column>
      </TouchableOpacity>
      {
        onMorePressed
          ? <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMorePressed}
            style={{
              position: 'absolute',
              right: 20,
            }}
          >
            <Image
              source={IC_MORE}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
          : null
      }
    </Head>
    <Message>{reply.text}</Message>
  </Container>;
};

export default ReplyListItem;
