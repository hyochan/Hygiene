import { Activity, CategoryType, Photo, SelectImageActionType, User } from '../../types';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useLayoutEffect, useState } from 'react';
import { StackNavigationProps, StackParamList } from '../navigation/MainStackNavigator';
import { THUMBNAIL_SIZES, launchCameraAsync, launchImageLibraryAsync, resizeImage } from '../../utils/imagePicker';

import EditText from '../shared/EditText';
import PictureUploadBox from '../shared/PictureUploadBox';
import { RouteProp } from '@react-navigation/core';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { uploadOrRemovePhoto } from '../../services/firebaseService';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAppContext } from '../../providers/AppProvider';
import { useFeedContext } from '../../providers/FeedProvider';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};

  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Head = styled.View`
  padding: 0 20px;
  margin-top: 16px;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Line = styled.View`
  background-color: ${({ theme }): string => theme.border};
  height: 1px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const WarningText = styled.Text`
  font-size: 14px;
  margin-top: 18px;
  color: ${({ theme }): string => theme.font};
`;

interface Props {
  navigation: StackNavigationProps<'PostActivity'>;
  route: RouteProp<StackParamList, 'PostActivity'>;
}

const Page: FC<Props> = ({
  navigation,
  route,
}) => {
  const { feeds, setFeeds } = useFeedContext();
  const currentUser = firebase.auth().currentUser;
  const category = route.params.category;

  const { theme } = useThemeContext();
  const { showActionSheetWithOptions } = useActionSheet();
  const { state: { user: appUser }, setAppLoading, setUserPoint } = useAppContext();

  const [message, setMessage] = useState<string>('');
  const [picture, setPicture] = useState<Photo[]>([]);

  const postActivity = async (): Promise<void | undefined> => {
    if (!currentUser) return;

    if (!message) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert(getString('PLZ_WRITE_MESSAGE'));
        return;
      }

      Alert.alert(
        getString('ERROR_INPUT'),
        getString('PLZ_WRITE_MESSAGE'),
      );
      return;
    }

    if (picture.length === 0) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert(getString('PLZ_ADD_PHOTO'));
        return;
      }
      Alert.alert(
        getString('ERROR_INPUT'),
        getString('PLZ_ADD_PHOTO'),
      );
      return;
    }

    setAppLoading(true);

    const db = firebase.firestore();
    const ref = db.collection('feeds').doc();

    try {
      const urls = await Promise.all(
        picture.map(async (photo: Photo) => {
          return uploadOrRemovePhoto(photo, 'feeds', ref.id);
        }),
      ) as string[];

      const data = {
        category: category.type,
        message,
        urls,
        writerId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firebase.firestore().collection('feeds').doc(ref.id).set(data);

      const point = category.type === CategoryType.HandWash
        ? 3
        : CategoryType.WearMask
          ? 5
          : CategoryType.StayHome
            ? 10
            : CategoryType.GoodConsumption
              ? 15
              : 1;

      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
      userRef.update('point', firebase.firestore.FieldValue.increment(point));

      if (appUser) {
        const updatedPoint = (appUser.point || 0) + point;
        setUserPoint(updatedPoint);
      }

      const feed: Activity = {
        ...data,
        id: ref.id,
      };

      const update = [
        feed,
        ...feeds,
      ];

      setFeeds(update);

      navigation.pop();
    } catch (err) {
      console.log('err', err);
    } finally {
      setAppLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 4,
          }}
          onPress={postActivity}>
          <Text
            style={{
              fontSize: 16,
              color: theme.btnPrimary,
            }}
          >{getString('DONE')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, postActivity]);

  const pressImage = async (): Promise<void> => {
    const options = [
      getString('TAKE_A_PICTURE'),
      getString('SELECT_FROM_ALBUM'),
      getString('CANCEL'),
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: SelectImageActionType.CANCEL,
      },
      async (choice: number) => {
        const image = choice === SelectImageActionType.LAUNCH_CAMERA
          ? await launchCameraAsync()
          : choice === SelectImageActionType.LAUNCH_GALLERY
            ? await launchImageLibraryAsync()
            : undefined;

        if (image && !image.cancelled) {
          const thumbImage = await resizeImage({
            imageUri: image.uri,
            maxWidth: THUMBNAIL_SIZES.MAX_WIDTH,
            maxHeight: THUMBNAIL_SIZES.MAX_HEIGHT,
          });

          const photo: Photo = {
            uri: image.uri,
            thumbUri: thumbImage.uri,
            added: true,
          };

          setPicture([...picture, photo]);
        }
      },
    );
  };

  return (
    <Container>
      <Head>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.font,
            marginBottom: 8,
          }}
        >{category.text}</Text>
      </Head>
      <EditText
        borderWidth={0}
        style={{
          height: 187,
        }}
        textStyle={{
          padding: 12,
          fontSize: 14,
          height: 187,
          backgroundColor: theme.backgroundDark,
          color: theme.font,
        }}
        placeholderTextColor={theme.placeholder}
        multiline
        onChangeText={(text): void => setMessage(text)}
        placeholder={getString('POST_MESSAGE_HINT')}
        value={message}
      />
      <Line/>
      <View style={{
        marginTop: 12,
        paddingHorizontal: 22,
      }}>
        <PictureUploadBox
          picture={picture}
          onAddPhoto={pressImage}
        />
        <WarningText>{getString('ACTIVITY_CONTENT_WARNING')}</WarningText>
      </View>
    </Container>
  );
};

export default Page;
