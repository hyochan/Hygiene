import { Activity, SelectMyFeedMoreActionType } from '../../types';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { StackNavigationProps, StackParamList } from '../navigation/MainStackNavigator';

import FeedListItem from '../shared/FeedListItem';
import { FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/core';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import produce from 'immer';
import styled from 'styled-components/native';
import { updateUserPoint } from '../../services/firebaseService';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAppContext } from '../../providers/AppProvider';

const Container = styled.SafeAreaView`
  background-color: ${({ theme }): string => theme.background};

  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

interface Props {
  navigation: StackNavigationProps<'MyFeeds'>;
  route: RouteProp<StackParamList, 'MyFeeds'>;
}

const Page: FC<Props> = () => {
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const { showActionSheetWithOptions } = useActionSheet();
  const { state: { user }, setAppLoading, setUserPoint } = useAppContext();
  const [myFeeds, setMyFeeds] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const PAGE_SIZE = 10;

  const fetchMyFeeds = (): void => {
    if (loading) return;

    setLoading(true);

    db.collection('feeds')
      .where('writerId', '==', user?.uid)
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .get()
      .then((snap) => {
        const feeds: Activity[] = [];

        for (const doc of snap.docs) {
          const feed = doc.data();

          feed.id = doc.id;
          feed.createdAt = feed.createdAt.toDate();
          feed.updatedAt = feed.updatedAt.toDate();

          feeds.push(feed as Activity);
        }

        setMyFeeds(feeds);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMyFeeds();
  }, []);

  const onRefresh = (): void => {
    setMyFeeds([]);
    fetchMyFeeds();
  };

  const onEndReached = (): void => {
    if (loading) return;

    setLoading(true);

    db.collection('feeds')
      .where('writerId', '==', user?.uid)
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .startAfter(myFeeds[myFeeds.length - 1].createdAt)
      .get()
      .then((snap) => {
        const feeds: Activity[] = myFeeds;

        for (const doc of snap.docs) {
          const feed = doc.data();

          feed.id = doc.id;
          feed.createdAt = feed.createdAt.toDate();
          feed.updatedAt = feed.updatedAt.toDate();

          feeds.push(feed as Activity);
        }

        setMyFeeds(feeds);
        setLoading(false);
      });
  };

  return (
    <Container>
      <FlatList
        keyExtractor={(item, i: number): string => i.toString()}
        style={{ width: '100%' }}
        data={myFeeds}
        refreshing={loading}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        scrollEventThrottle={30}
        renderItem={({ item, index }): ReactElement =>
          <FeedListItem
            key={index}
            activity={item}
            onMorePressed={(): void => {
              const feed = item;

              const options = [
                getString('DELETE'),
                getString('CANCEL'),
              ];

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex: SelectMyFeedMoreActionType.CANCEL,
                }, async (choice: number) => {
                  if (choice === SelectMyFeedMoreActionType.DELETE) {
                    setAppLoading(true);

                    await db.collection('feeds')
                      .doc(feed.id)
                      .collection('likes')
                      .doc(feed.writerId)
                      .delete();

                    await db.collection('replies')
                      .doc(feed.id)
                      .collection('likes')
                      .doc(feed.writerId)
                      .delete();

                    await db.collection('feeds')
                      .doc(feed.id)
                      .delete();

                    if (currentUser) {
                      const point = updateUserPoint(item.category, currentUser, false);

                      if (user) {
                        const updatedPoint = (user.point || 0) + point;

                        setUserPoint(updatedPoint);
                      }
                    }

                    setAppLoading(false);

                    const index = myFeeds.findIndex((el) => {
                      return el.id === feed.id;
                    });

                    const update = produce(myFeeds, (draftState): void => {
                      if (draftState) draftState.splice(index, 1);
                    });

                    setMyFeeds(update);
                  }
                },
              );
            }}
          />
        }
      />
    </Container>
  );
};

export default Page;
