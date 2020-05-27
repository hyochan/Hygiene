import * as AuthSession from 'expo-auth-session';

import { Alert, Platform, View } from 'react-native';
import React, { FC, ReactElement, useState } from 'react';
import { SocialAuthProvider, User } from '../../types';

import Button from './Button';
import { createUser } from '../../services/firebaseService';
import firebase from 'firebase';
import { getString } from '../../../STRINGS';
import { useThemeContext } from '../../providers/ThemeProvider';

interface Props {
  svgIcon: ReactElement;
  clientId: string;
  clientSecret: string;
  socialProvider: SocialAuthProvider;
  onUserCreated?: (user?: User) => void;
}

const SocialSignInButton: FC<Props> = ({
  svgIcon,
  clientId,
  clientSecret,
  socialProvider,
  onUserCreated,
}) => {
  const { makeRedirectUri, useAuthRequest, ResponseType, Prompt, useAutoDiscovery } = AuthSession;
  const { theme } = useThemeContext();
  const [signingIn, setSigningIn] = useState<boolean>(false);

  const discovery = socialProvider === SocialAuthProvider.Google
    ? useAutoDiscovery('https://accounts.google.com')
    : {
      authorizationEndpoint: 'https://www.facebook.com/v6.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v6.0/oauth/access_token',
    };

  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = makeRedirectUri(
    socialProvider === SocialAuthProvider.Google
      ? {
        // native: 'dev.hygiene',
        useProxy,
      }
      : { useProxy },
  );

  const [request, response, promptAsync] = useAuthRequest(
    socialProvider === SocialAuthProvider.Google
      ? {
        clientId,
        redirectUri,
        prompt: Prompt.SelectAccount,
        scopes: ['openid', 'profile'],
        responseType: ResponseType.Token,
        usePKCE: false,
      }
      : {
        clientId,
        clientSecret,
        scopes: ['public_profile, email'],
        redirectUri,
        prompt: Prompt.SelectAccount,
        extraParams: {
          display: Platform.select({ web: 'popup' }) as string,
          // eslint-disable-next-line @typescript-eslint/camelcase
          auth_type: 'rerequest',
        },
        responseType: ResponseType.Token,
      }
    ,
    discovery,
  );

  const signIn = async (): Promise<void> => {
    setSigningIn(true);

    try {
      const result = await promptAsync({ useProxy });
      if (result.type !== 'success') {
        if (Platform.OS === 'web') {
          // @ts-ignore
          alert(getString('ERROR_UNKNOWN'));
          return;
        }
        Alert.alert(getString('ERROR'), getString('ERROR_UNKNOWN'));
        return;
      }

      if (socialProvider === SocialAuthProvider.Google) {
        const accessToken = result.params.access_token;
        const credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
        const authResult = await firebase.auth().signInWithCredential(credential);

        const user = await createUser(authResult);

        if (onUserCreated) onUserCreated(user);
        return;
      }

      const accessToken = result.params.access_token;
      const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
      const authResult = await firebase.auth().signInWithCredential(credential);

      const user = await createUser(authResult);

      if (onUserCreated) onUserCreated(user);
    } catch (err) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert(`Login Error: ${err.message}`);
        return;
      }
      Alert.alert(`Login Error: ${err.message}`);
    } finally {
      setSigningIn(false);
    }
  };

  if (socialProvider === SocialAuthProvider.Google) {
    return <Button
      testID="btn-google"
      style={{
        backgroundColor: theme.googleBackground,
        borderColor: theme.googleBackground,
        borderWidth: 1,
        width: '100%',
        height: 48,
        marginBottom: 12,
        borderRadius: 100,
      }}
      leftElement={
        <View style={{ marginRight: 6 }}>{svgIcon}</View>
      }
      isLoading={signingIn}
      indicatorColor={theme.primary}
      onPress={signIn}
      text={getString('SIGN_IN_WITH_GOOGLE')}
      textStyle={{ fontWeight: '700', color: theme.googleText }}
    />;
  }
  return <Button
    testID="btn-facebook"
    style={{
      backgroundColor: theme.facebookBackground,
      borderColor: theme.facebookBackground,
      borderWidth: 1,
      width: '100%',
      height: 48,
      marginBottom: 12,
      borderRadius: 100,
    }}
    leftElement={
      <View style={{ marginRight: 6 }}>{svgIcon}</View>
    }
    isLoading={signingIn}
    indicatorColor={theme.primary}
    onPress={signIn}
    text={getString('SIGN_IN_WITH_FACEBOOK')}
    textStyle={{ fontWeight: '700', color: theme.facebookText }}
  />;
};

export default SocialSignInButton;
