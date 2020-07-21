import { FlatList, Platform, TouchableOpacity } from 'react-native';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { StackNavigationProps, StackParamList } from '../navigation/MainStackNavigator';

import Constants from 'expo-constants';
import FeedListItem from '../shared/FeedListItem';
import { Reply } from '../../types';
import ReplyListItem from '../shared/ReplyListItem';
import { RouteProp } from '@react-navigation/core';
import { SvgMessage } from '../../utils/Icons';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import { isIphoneX } from '../../utils/Styles';
import styled from 'styled-components/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAppContext } from '../../providers/AppProvider';
import { useThemeContext } from '../../providers/ThemeProvider';

const StyledSafeArea = styled.SafeAreaView`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }): string => theme.background};
`;

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  align-self: stretch;

  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StyledViewChat = styled.View`
  width: 100%;
  align-self: stretch;

  flex-direction: row;
  align-items: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.12);
`;

const StyledInputChat = styled.TextInput`
  width: 100%;
  align-self: stretch;
  font-size: 14px;
  padding: 16px 20px;
  color: ${({ theme }): string => theme.font};

  flex-direction: row;
  align-items: center;
`;

interface Props {
  navigation: StackNavigationProps<'FeedReply'>;
  route: RouteProp<StackParamList, 'FeedReply'>;
}

let unsubscribe;

const Page: FC<Props> = ({
  navigation,
  route,
}) => {
  const db = firebase.firestore();
  const { feed } = route.params;
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState('');
  const { theme } = useThemeContext();
  const { state: { user } } = useAppContext();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    unsubscribe = db.collection('feeds')
      .doc(feed.id)
      .collection('replies')
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        const updates: Reply[] = [];
        snapshot.docChanges().forEach(function(change) {
          const reply = change.doc.data();
          reply.id = change.doc.id;
          reply.createdAt = reply.createdAt.toDate();
          reply.updatedAt = reply.updatedAt.toDate();

          if (change.type === 'added') {
            updates.unshift(reply as Reply);
          }
          if (change.type === 'modified') {
            const index = replies.findIndex((el) => {
              return el.id === change.doc.id;
            });

            if (index === -1) return;

            updates[index] = reply as Reply;
          }
          if (change.type === 'removed') {
            const index = replies.findIndex((el) => {
              return el.id === change.doc.id;
            });

            if (index === -1) return;

            updates.splice(index, 1);
          }
        });
        setReplies(updates);
      });

    return function cleanup(): void {
      if (unsubscribe) unsubscribe();
    };
  }, [replies]);

  const deleteReply = (item: Reply): void => {
    enum ActionType {
      DELETE = 0,
      CANCEL = 1,
    }

    const options = [
      getString('DELETE'),
      getString('CANCEL'),
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: ActionType.CANCEL,
      }, async (choice: number) => {
        if (choice === ActionType.DELETE) {
          await db.collection('feeds')
            .doc(feed.id)
            .collection('replies')
            .doc(item.id)
            .delete();
        }
      },
    );
  };

  const sendMessage = (): void => {
    db.collection('feeds').doc(feed.id).collection('replies').add({
      text: message,
      writerId: feed.writerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <StyledSafeArea>
      <StyledKeyboardAvoidingView
        // keyboardVerticalOffset={92}
        keyboardVerticalOffset={Platform.select({
          ios: isIphoneX()
            ? Constants.statusBarHeight + 48
            : Constants.statusBarHeight,
          android: Constants.statusBarHeight + 52,
        })}
        behavior={Platform.select({
          ios: 'padding',
          default: undefined,
        })}
      >
        <FlatList
          keyExtractor={(item, i: number): string => i.toString()}
          data={replies}
          style={{ width: '100%' }}
          ListHeaderComponent={<FeedListItem
            activity={feed}
            hideMoreIcon={true}
            hideTools={true}
          />}
          renderItem={({ item }): ReactElement => {
            return <ReplyListItem
              reply={item}
              onMorePressed={
                feed.writerId === user?.uid
                  ? (): void => deleteReply(item)
                  : undefined
              }
            />;
          }}
        />
        <StyledViewChat>
          <StyledInputChat
            style={{
              color: theme.font,
              backgroundColor: theme.background,
            }}
            multiline={true}
            placeholder={getString('REPLY_HINT')}
            placeholderTextColor={theme.placeholder}
            value={message}
            onChangeText={(text): void => setMessage(text)}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              right: 4,
              position: 'absolute',
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <SvgMessage
              width={26}
              fill={theme.btnPrimary}
            />
          </TouchableOpacity>
        </StyledViewChat>
      </StyledKeyboardAvoidingView>
    </StyledSafeArea>
  );
};

export default Page;
