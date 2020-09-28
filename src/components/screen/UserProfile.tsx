import { IC_CAMERA, IC_NO_IMAGE } from '../../utils/Icons';
import {
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { SelectImageActionType, User } from '../../types';
import { StackNavigationProps, StackParamList } from '../navigation/MainStackNavigator';
import { THUMBNAIL_SIZES, launchCameraAsync, launchImageLibraryAsync, resizeImage } from '../../utils/imagePicker';

import EditText from '../shared/EditText';
import { RouteProp } from '@react-navigation/core';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { uploadProfile } from '../../services/firebaseService';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAppContext } from '../../providers/AppProvider';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  background-color: ${({ theme }): string => theme.background};
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

interface Props {
  navigation: StackNavigationProps<'UserProfile'>;
  route: RouteProp<StackParamList, 'UserProfile'>;
}

const Page: FC<Props> = ({
  navigation,
  route,
}) => {
  const currentUser = firebase.auth().currentUser;
  const { state: { user: appUser }, setAppLoading, setUser } = useAppContext();

  const {
    params: {
      updateUser,
      peerUserId,
    },
  } = route;

  const { theme } = useThemeContext();
  const { showActionSheetWithOptions } = useActionSheet();
  const [displayName, setDisplayName] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [localImage, setLocalImage] = useState<string>();

  let imageUri: string;
  let thumbUri: string;

  useEffect(() => {
    const db = firebase.firestore();

    if (peerUserId) {
      db.collection('users').doc(peerUserId).get().then((snap) => {
        const data = snap.data();

        setDisplayName(data?.displayName || '');
        setIntroduction(data?.introduction || '');
        setLocalImage(data?.photoURL || '');
      });
    } else {
      setDisplayName(appUser?.displayName || '');
      setIntroduction(appUser?.introduction || '');
    }
  }, []);

  const updateProfile = async (user: firebase.User): Promise<void> => {
    user.updateProfile({
      displayName,
    });

    await firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        displayName,
        introduction,
      }, {
        merge: true,
      });

    const updateUser = {
      ...appUser,
      ...{
        displayName,
        introduction,
      },
    };

    setUser(updateUser as User);
  };

  useLayoutEffect(() => {
    if (!peerUserId) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 4,
            }}
            onPress={async (): Promise<void> => {
              if (currentUser) {
                setAppLoading(true);

                if (imageUri) await uploadProfile(imageUri, thumbUri);

                if (displayName) await updateProfile(currentUser);

                updateUser(thumbUri, displayName);
                setAppLoading(false);
                navigation.pop();
              }
            }}>
            <Text
              style={{
                fontSize: 16,
                color: theme.btnPrimary,
              }}
            >{getString('DONE')}</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, theme, displayName, introduction]);

  const getUserImage = (): ImageSourcePropType => {
    if (peerUserId) {
      return { uri: localImage };
    }

    return localImage
      ? { uri: localImage }
      : !firebase.auth().currentUser?.photoURL
        ? IC_NO_IMAGE
        : { uri: `${firebase.auth().currentUser?.photoURL}` };
  };

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

          imageUri = image.uri;
          thumbUri = thumbImage.uri;
          setLocalImage(thumbImage.uri);
        }
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: theme.background }}
      behavior="padding" enabled keyboardVerticalOffset={100}
    >
      <ScrollView>
        <Container>
          <TouchableOpacity
            style={{ marginTop: 40 }}
            activeOpacity={peerUserId ? 1.0 : 0.7}
            onPress={!peerUserId ? pressImage : undefined}
          >
            <View>
              <Image
                source={getUserImage()}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                }}
              />
              {
                !peerUserId
                  ? <Image
                    source={IC_CAMERA}
                    style={{
                      position: 'absolute',
                      width: 26,
                      height: 26,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  : null
              }

            </View>
          </TouchableOpacity>
          <EditText
            textInputProps={{
              editable: !peerUserId,
            }}
            label={getString('DISPLAY_NAME')}
            placeholder={getString('DISPLAY_NAME_HINT')}
            labelTextStyle={{
              color: theme.font,
              fontSize: 14,
              fontWeight: 'bold',
            }}
            focusColor={theme.font}
            style={{
              marginTop: 40,
              marginHorizontal: 22,
            }}
            textStyle={{
              color: theme.font,
              fontSize: 16,
            }}
            placeholderTextColor={theme.placeholder}
            value={displayName}
            onChangeText={(text: string): void => setDisplayName(text)}
          />
          <EditText
            textInputProps={{
              editable: !peerUserId,
            }}
            label={getString('SELF_INTRODUCTION')}
            placeholder={getString('SELF_INTRODUCTION_HINT')}
            labelTextStyle={{
              color: theme.font,
              fontSize: 14,
              fontWeight: 'bold',
            }}
            focusColor={theme.font}
            style={{
              marginTop: 28,
              marginBottom: 40,
              marginHorizontal: 22,
            }}
            numberOfLines={5}
            textStyle={{
              color: theme.font,
              fontSize: 16,
              height: 200,
            }}
            multiline
            placeholderTextColor={theme.placeholder}
            value={introduction}
            onChangeText={(text: string): void => setIntroduction(text)}
          />
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Page;
