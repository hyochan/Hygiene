import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FlatList } from 'react-native';
import { HomeBottomTabNavigationProps } from '../navigation/HomeTabNavigator';
import RankListItem from '../shared/RankListItem';
import { User } from '../../types';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Head = styled.View`
  margin: 22px;
  flex-direction: row;
  align-items: flex-end;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }): string => theme.font};
`;

const Description = styled.Text`
  font-size: 12px;
  color: ${({ theme }): string => theme.fontSecondary};
  margin-left: 8px;
  margin-bottom: 2px;
`;

interface Props {
  navigation: HomeBottomTabNavigationProps<'HomeRank'>;
}

const Page: FC<Props> = ({
  navigation,
}) => {
  const db = firebase.firestore();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    db
      .collection('users')
      .where('point', '>', 0)
      .orderBy('point', 'desc')
      .limit(20)
      .get().then((snap) => {
        const updates: User[] = [];
        snap.docs.forEach((doc) => {
          const user = doc.data() as User;
          user.uid = doc.id;
          updates.push(user);
        });
        setUsers(updates);
      });
  }, []);

  return (
    <Container>
      <FlatList
        style={{ width: '100%' }}
        keyExtractor={(item, i: number): string => i.toString()}
        ListHeaderComponent={
          <Head>
            <Title>{getString('RANK')}</Title>
            <Description>{getString('RANK_DESCRIPTION')}</Description>
          </Head>
        }
        data={users}
        renderItem={({ item, index }): ReactElement =>
          <RankListItem key={index} rank={item} index={index}/>
        }
      />
    </Container>
  );
};

export default Page;
