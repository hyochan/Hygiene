import { Activity, Throphy } from '../../types';
import { Image, ScrollView, Text, View } from 'react-native';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import ButtonGroup from '../shared/ButtonGroup';
import { HomeBottomTabNavigationProps } from '../navigation/HomeTabNavigator';
import { IC_TROPHY } from '../../utils/Icons';
import MyFeedListItem from '../shared/MyFeedListItem';
import ProfileCard from '../shared/ProfileCard';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useAppContext } from '../../providers/AppProvider';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.SafeAreaView`
  background-color: ${({ theme }): string => theme.background};
  box-shadow: 4px 4px 12px rgba(34, 34, 34, 0.14);

  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const FeedsContainer = styled.View`
  padding-top: 18px;
  padding-bottom: 40px;
  width: 100%;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BadgesContainer = styled.View`
  padding-top: 18px;
  padding-bottom: 40px;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const BadgeCard = styled.View`
  height: 158px;
  width: 152px;
  margin: 8px;
  border: 1px solid;
  border-color: ${({ theme }): string => theme.border};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background-color: ${({ theme }): string => theme.card};

  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface Props {
  navigation: HomeBottomTabNavigationProps<'HomeProfile'>;
}

enum ViewType {
  FEEDS = 0,
  BADGES = 1,
}

let unsubscribe;

const Page: FC<Props> = ({
  navigation,
}) => {
  const currentUser = firebase.auth().currentUser;
  const { theme } = useThemeContext();
  const data = [getString('FEEDS'), getString('BADGES')];

  const [option, setOption] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>(currentUser?.displayName || getString('UNNAMED'));
  const [photoURL, setPhotoURL] = useState<string | undefined>(currentUser?.photoURL || undefined);
  const [rank, setRank] = useState<number>(0);
  const [feedCnt, setFeedCnt] = useState<number>(0);
  const [myTrophies, setMyThrophies] = useState<Throphy[]>([]);

  const renderTrophyItem = (throphy: Throphy, i: number): ReactElement => {
    const { type, count } = throphy;
    return <BadgeCard
      key={i}
    >
      <Image
        source={IC_TROPHY}
        style={{
          width: 62,
          height: 62,
        }}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          color: theme.font,
        }}
      >{type} <Text
          style={{
            color: theme.accent,
          }}>x{count}</Text>
      </Text>
    </BadgeCard>;
  };

  const renderNestedView = (): ReactElement => {
    const db = firebase.firestore();
    const { state: { user } } = useAppContext();
    const [myFeeds, setMyFeeds] = useState<Activity[]>([]);

    useEffect(() => {
      unsubscribe = db.collection('feeds')
        .where('writerId', '==', user?.uid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .onSnapshot((snapshot) => {
          let updates: Activity[] = myFeeds;

          snapshot.docChanges().forEach(function(change) {
            const feed = change.doc.data();
            feed.id = change.doc.id;
            feed.createdAt = feed.createdAt.toDate();
            feed.updatedAt = feed.updatedAt.toDate();

            if (change.type === 'added') {
              updates = [
                ...updates,
                feed as Activity,
              ];
            }
            if (change.type === 'modified') {
              const index = feed.findIndex((el) => {
                return el.id === change.doc.id;
              });

              if (index === -1) return;

              updates[index] = feed as Activity;
            }
            if (change.type === 'removed') {
              const index = updates.findIndex((el) => {
                return el.id === change.doc.id;
              });

              if (index === -1) return;

              updates.splice(index, 1);
            }
          });

          setFeedCnt(updates.length);
          setMyFeeds(updates);
        });

      if (user && user.point) {
        if (user.point) {
          db
            .collection('users')
            .where('point', '>', user.point)
            .orderBy('point', 'asc')
            .get().then((snap) => {
              setRank(snap.docs.length + 1);
            });
          return;
        }

        return setRank(0);
      }

      return function cleanup(): void {
        if (unsubscribe) unsubscribe();
      };
    }, []);

    switch (option) {
      case ViewType.FEEDS:
        return <FeedsContainer>
          {
            myFeeds.map((feed, i) => {
              return <MyFeedListItem
                key={i}
                feed={feed}
                onPress={(): void => navigation.navigate('MyFeeds')}
              />;
            })
          }
        </FeedsContainer>;
      case ViewType.BADGES:
        return <BadgesContainer>
          {
            myTrophies.map((throphy, i) => {
              renderTrophyItem(throphy, i);
            })
          }
        </BadgesContainer>;
    }
    return <View/>;
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        style={{
          width: '100%',
        }}
      >
        <ProfileCard
          style={{
            marginTop: 34,
          }}
          displayName={displayName}
          photoURL={photoURL}
          onEdit={(): void => navigation.navigate(
            'UserProfile',
            {
              updateUser: (photoURL: string, displayName: string) => {
                if (photoURL) setPhotoURL(photoURL);
                if (displayName) setDisplayName(displayName);
              },
            },
          )}
          onLogout={(): void => {
            if (unsubscribe) unsubscribe();
            firebase.auth().signOut();
          }}
          missionScore={myTrophies.length}
          ranking={rank}
          feeds={feedCnt}
        />
        <View style={{
          width: '100%',
          marginTop: 8,
        }}>
          <ButtonGroup
            borderRadius={8}
            selectedViewStyle={{
              backgroundColor: theme.fontSecondary,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 40,
            }}
            selectedTextStyle={{
              color: theme.background,
              alignSelf: 'center',
            }}
            viewStyle={{
              borderColor: theme.border,
              borderWidth: 1,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 40,
            }}
            style={{
              marginTop: 32,
              marginHorizontal: 40,
              borderColor: theme.border,
              borderWidth: 0,
            }}
            textStyle={{
              color: theme.placeholder,
            }}
            onPress={(index: number): void => setOption(index)}
            data={data}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderNestedView()}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default Page;
