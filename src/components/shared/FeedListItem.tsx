import { Activity, CategoryType, User } from '../../types';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IC_ANGER,
  IC_LIKE,
  IC_MESSAGE,
  IC_MORE,
  IC_NO_IMAGE,
  IC_SHARE,
  SvgCatEtc,
  SvgCatGoodConsumption,
  SvgCatHandWash,
  SvgCatHomeStay,
  SvgCatMask,
} from '../../utils/Icons';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import firebase from 'firebase/app';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { getString } from '../../../STRINGS';
import { getUserById } from '../../services/firebaseService';
import styled from 'styled-components/native';
import { useAppContext } from '../../providers/AppProvider';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  min-height: 360px;
  padding: 0 22px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }): string => theme.border};

  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Header = styled.View`
  width: 100%;
  height: 68px;
  
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 14px;
  color: ${({ theme }): string => theme.font};
`;

const RoundedView = styled.View`
  border-radius: 100px;
  border: 1px solid;
  border-color: ${({ theme }): string => theme.border};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.06);
  padding: 11px;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface LikeData {
  like?: boolean;
}

interface Props {
  activity: Activity;
  hideMoreIcon?: boolean;
  hideTools?: boolean;
  onMessagePressed?: () => void;
  onMorePressed?: () => void;
  width?: number;
}

let replyUnsubscribe;
let shareUnsubscribe;

const FeedListItem: FC<Props> = ({
  activity,
  hideMoreIcon = false,
  hideTools = false,
  onMessagePressed,
  onMorePressed,
  width = 24,
}) => {
  const db = firebase.firestore();
  const { theme } = useThemeContext();
  const [user, setUser] = useState<User>();
  const [likeCnt, setLikeCnt] = useState<number>(0);
  const [dislikeCnt, setDislikeCnt] = useState<number>(0);
  const [likeItem, setLikeItem] = useState<boolean | undefined>(undefined);
  const [replyCnt, setReplyCnt] = useState<number>(0);
  const [shareCnt, setShareCnt] = useState<number>(0);
  const { state: { user: appUser } } = useAppContext();
  const navigation = useNavigation();

  const pressUser = async (): Promise<void> => {
    navigation.navigate('UserProfile', {
      peerUserId: activity.writerId,
    });
  };

  const getData = async (): Promise<void> => {
    const user = await getUserById(activity.writerId);
    setUser(user as User);

    if (user) {
      replyUnsubscribe = db.collection('feeds')
        .doc(activity.id)
        .collection('replies')
        .onSnapshot((snap) => {
          setReplyCnt(snap.size);
        });

      shareUnsubscribe = db.collection('feeds')
        .doc(activity.id)
        .collection('shares')
        .onSnapshot((snap) => {
          setShareCnt(snap.size);
        });
    }

    const likes = await db
      .collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .where('like', '==', true)
      .get();

    setLikeCnt(likes.docs.length);

    const dislikes = await db
      .collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .where('like', '==', false)
      .get();

    setDislikeCnt(dislikes.docs.length);

    const likeDoc = await db
      .collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .doc(activity.writerId)
      .get();

    const likeData = likeDoc.data();
    setLikeItem(likeData?.like);
  };

  const like = async (): Promise<void> => {
    const prevResult = await db.collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .doc(activity.writerId)
      .get();

    const prevData = prevResult.data() as LikeData;

    if (prevData?.like || undefined) {
      await db.collection('feeds')
        .doc(activity.id)
        .collection('likes')
        .doc(activity.writerId)
        .delete();

      setLikeItem(undefined);
      setLikeCnt(likeCnt - 1);
      return;
    }

    if (prevData?.like === false || undefined) {
      setDislikeCnt(dislikeCnt - 1);
    }

    await db.collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .doc(activity.writerId)
      .set(
        { like: true },
        { merge: true },
      );

    setLikeItem(true);
    setLikeCnt(likeCnt + 1);
  };

  const dislike = async (): Promise<void> => {
    const prevResult = await db.collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .doc(activity.writerId)
      .get();

    const prevData = prevResult.data() as LikeData;

    if (prevData?.like === false || undefined) {
      await db.collection('feeds')
        .doc(activity.id)
        .collection('likes')
        .doc(activity.writerId)
        .delete();

      setLikeItem(undefined);
      setDislikeCnt(dislikeCnt - 1);
      return;
    }

    if (prevData?.like === true || undefined) {
      setLikeCnt(likeCnt - 1);
    }

    await db.collection('feeds')
      .doc(activity.id)
      .collection('likes')
      .doc(activity.writerId)
      .set({ like: false }, { merge: true });

    setLikeItem(false);
    setDislikeCnt(dislikeCnt + 1);
  };

  const share = async (): Promise<void> => {
    try {
      const result = await Share.share({
        url: activity.urls[0],
        message: getString('SHARE_FEED', {
          imgUrl: activity.urls[0],
          user: user?.displayName,
          message: activity.message,
          iosUrl: '',
          androidUrl: '',
        }),
        title: getString('APP_NAME'),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          await db.collection('feeds')
            .doc(activity.id)
            .collection('shares')
            .add({
              userId: appUser?.uid,
              activityType: result.activityType,
            });
        } else {
          await db.collection('feeds')
            .doc(activity.id)
            .collection('shares')
            .add({
              userId: appUser?.uid,
            });
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert(error.message);
        return;
      }
      Alert.alert(getString('ERROR'), error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [activity.writerId]);

  useEffect(() => {
    getData();

    return function cleanup(): void {
      if (replyUnsubscribe) replyUnsubscribe();
      if (shareUnsubscribe) shareUnsubscribe();
    };
  }, []);

  const renderCategory = (): ReactElement => {
    const defaultStyle = !hideMoreIcon
      ? {
        right: 36,
      }
      : {
        right: 0,
      };
    return activity.category === CategoryType.HandWash
      ? <SvgCatHandWash
        width={width}
        height={width}
        fill={theme.link}
        style={{
          ...defaultStyle,
          position: 'absolute',
        }}
      />
      : activity.category === CategoryType.WearMask
        ? <SvgCatMask
          width={width}
          height={width}
          fill={theme.link}
          style={{
            ...defaultStyle,
            position: 'absolute',
          }}/>
        : activity.category === CategoryType.StayHome
          ? <SvgCatHomeStay
            width={width}
            height={width}
            fill={theme.link}
            style={{
              ...defaultStyle,
              position: 'absolute',
            }}/>
          : activity.category === CategoryType.GoodConsumption
            ? <SvgCatGoodConsumption
              width={width}
              height={width}
              fill={theme.link}
              style={{
                ...defaultStyle,
                position: 'absolute',
              }}/>
            : <SvgCatEtc
              width={width}
              height={width}
              fill={theme.link}
              style={{
                ...defaultStyle,
                position: 'absolute',
              }}
            />;
  };

  return <Container>
    <Header>
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
              activity.createdAt
                ? formatDistanceToNow(activity.createdAt)
                : ''
            }</StyledText>
        </Column>
      </TouchableOpacity>
      { renderCategory() }
      {
        !hideMoreIcon
          ? <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMorePressed}
            style={{
              position: 'absolute',
              right: 0,
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
    </Header>
    <StyledText
      numberOfLines={5}
    >{activity.message}</StyledText>
    <View style={{ width: '100%' }}>
      <ScrollView
        horizontal
        style={{ marginVertical: 10 }}
      >
        {
          activity.urls.map((photo, i) => {
            return <Image
              key={i}
              style={{
                height: 240,
                width: 331,
                marginRight: 10,
                borderRadius: 16,
              }}
              source={{
                uri: photo,
              }}
            />;
          })
        }
      </ScrollView>
    </View>
    {
      !hideTools
        ? <Row style={{
          marginTop: 12,
          marginBottom: 16,
          alignSelf: 'stretch',

          justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              activeOpacity={0.7}
              onPress={like}
            >
              <RoundedView
                style={
                  likeItem === true
                    ? { backgroundColor: '#00111111' }
                    : null
                }
              >
                <Image
                  source={ IC_LIKE }
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
                <StyledText style={{ marginLeft: 3 }}>
                  {likeCnt}
                </StyledText>
              </RoundedView>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              activeOpacity={0.7}
              onPress={dislike}
            >
              <RoundedView
                style={
                  likeItem === false
                    ? { backgroundColor: '#00111111' }
                    : null
                }
              >
                <Image
                  source={ IC_ANGER }
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
                <StyledText style={{ marginLeft: 3 }}>
                  {dislikeCnt}
                </StyledText>
              </RoundedView>
            </TouchableOpacity>
          </View>
          <View/>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              activeOpacity={0.7}
              onPress={onMessagePressed}
            >
              <RoundedView>
                <Image
                  source={ IC_MESSAGE }
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
                <StyledText style={{ marginLeft: 3 }}>
                  {replyCnt}
                </StyledText>
              </RoundedView>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={share}
            >
              <RoundedView>
                <Image
                  source={ IC_SHARE }
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
                <StyledText style={{ marginLeft: 3 }}>
                  {shareCnt}
                </StyledText>
              </RoundedView>
            </TouchableOpacity>
          </View>
        </Row>
        : null
    }
  </Container>;
};

export default FeedListItem;
