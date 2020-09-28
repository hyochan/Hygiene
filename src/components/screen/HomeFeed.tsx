import { Activity, SelectMyFeedMoreActionType, SelectPeerFeedMoreActionType } from '../../types';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import FeedListItem from '../shared/FeedListItem';
import { FlatList } from 'react-native';
import { HomeBottomTabNavigationProps } from '../navigation/HomeTabNavigator';
import NoFeedView from '../shared/NoFeedView';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import produce from 'immer';
import styled from 'styled-components/native';
import { updateUserPoint } from '../../services/firebaseService';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAppContext } from '../../providers/AppProvider';
import { useFeedContext } from '../../providers/FeedProvider';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

interface Props {
  navigation: HomeBottomTabNavigationProps<'HomeFeed'>;
}

const Page: FC<Props> = ({
  navigation,
}) => {
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();
  const { feeds, setFeeds } = useFeedContext();
  const { showActionSheetWithOptions } = useActionSheet();
  const { state: { user }, setAppLoading, setUserPoint } = useAppContext();

  const [loading, setLoading] = useState<boolean>(true);

  const PAGE_SIZE = 10;

  const fetchFeeds = async (): Promise<void> => {
    setLoading(true);

    const feedCollection = await db.collection('feeds')
      .limit(PAGE_SIZE)
      .orderBy('createdAt', 'desc')
      .get();

    const data: Activity[] = [];

    feedCollection.docs.forEach((doc) => {
      const feed = doc.data();

      feed.id = doc.id;
      feed.createdAt = feed.createdAt.toDate();
      feed.updatedAt = feed.updatedAt.toDate();

      data.push(feed as Activity);
    });

    setFeeds(data);
    setLoading(false);
  };

  const onRefresh = (): void => {
    setFeeds([]);
    fetchFeeds();
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const onEndReached = async (): Promise<void> => {
    if (loading === true) return;

    setLoading(true);

    const feedCollection = await db.collection('feeds')
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .startAfter(feeds[feeds.length - 1].createdAt)
      .get();

    const data: Activity[] = feeds;

    feedCollection.docs.forEach((doc) => {
      const feed = doc.data();

      feed.id = doc.id;
      feed.createdAt = feed.createdAt.toDate();
      feed.updatedAt = feed.updatedAt.toDate();

      data.push(feed as Activity);
    });

    setFeeds(data);
    setLoading(false);
  };

  return (
    <Container>
      <FlatList
        keyExtractor={(item, i: number): string => i.toString()}
        style={{ width: '100%' }}
        contentContainerStyle={
          feeds.length === 0
            ? {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 36,
            }
            : null
        }
        data={feeds}
        refreshing={loading}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        scrollEventThrottle={30}
        renderItem={({ item }): ReactElement =>
          <FeedListItem
            activity={item}
            onMessagePressed={(): void => {
              navigation.navigate('FeedReply', {
                feed: item,
              });
            }}
            onMorePressed={(): void => {
              if (user?.uid === item.writerId) {
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
                        .doc(item.id)
                        .collection('likes')
                        .doc(item.writerId)
                        .delete();

                      await db.collection('replies')
                        .doc(item.id)
                        .collection('likes')
                        .doc(item.writerId)
                        .delete();

                      await db.collection('feeds')
                        .doc(item.id)
                        .delete();

                      if (currentUser) {
                        const point = updateUserPoint(item.category, currentUser, false);

                        if (user) {
                          const updatedPoint = (user.point || 0) + point;

                          setUserPoint(updatedPoint);
                        }
                      }

                      setAppLoading(false);

                      const index = feeds.findIndex((el) => {
                        return el.id === item.id;
                      });

                      const update = produce(feeds, (draftState): void => {
                        if (draftState) draftState.splice(index, 1);
                      });

                      setFeeds(update);
                    }
                  },
                );
              } else {
                const options = [
                  getString('CANCEL'),
                ];

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex: SelectPeerFeedMoreActionType.CANCEL,
                  }, async (choice: number) => {

                  },
                );
              }
            }}
          />
        }
        ListEmptyComponent={NoFeedView}
      />
    </Container>
  );
};

export default Page;
