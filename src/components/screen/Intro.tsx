import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';

import { Alert, Linking, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { IC_BOTTLE, SvgApple, SvgFacebook } from '../../utils/Icons';
import React, { ReactElement, useState } from 'react';
import { facebookAppId, facebookSecret } from '../../../config';

import Button from '../shared/Button';
import { createUser } from '../../services/firebaseService';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  background: ${({ theme }): string => theme.background};
`;

const Wrapper = styled.View`
  margin: 40px;
`;

const LogoWrapper = styled.View`
  margin-top: 224px;
  margin-bottom: 72px;
  align-self: center;
`;

const StyledLogoImage = styled.Image`
  width: 124px;
  height: 170px;
`;

const SocialButtonWrapper = styled.View`
  margin-bottom: 24px;
`;

const StyledAgreementTextWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 0 40px 0;
`;

const StyledAgreementText = styled.Text`
  line-height: 22px;
  color: #777;
`;

const StyledAgreementLinedText = styled.Text`
  line-height: 22px;
  color: ${({ theme }): string => theme.link};
  text-decoration-line: underline;
`;

export default function Intro({ navigation }): ReactElement {
  const { theme, changeThemeType } = useThemeContext();

  const [signingInFacebook, setSigningInFacebook] = useState<boolean>(false);
  const [signingInApple, setSigningInApple] = useState<boolean>(false);

  WebBrowser.maybeCompleteAuthSession();

  // Endpoint
  const discovery = {
    authorizationEndpoint: 'https://www.facebook.com/v6.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v6.0/oauth/access_token',
  };

  const useProxy = Platform.select({ web: false, default: true });

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy,
    // For usage in bare and standalone
    // Use your FBID here. The path MUST be `authorize`.
    native: `fb${facebookAppId}://authorize`,
  });

  // Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: facebookAppId,
      clientSecret: facebookSecret,
      scopes: ['public_profile, email'],
      // For usage in managed apps using the proxy
      redirectUri,
      extraParams: {
      // Use `popup` on web for a better experience
        display: Platform.select({ web: 'popup' }) as string,
        // Optionally you can use this to rerequest declined permissions
        // eslint-disable-next-line
        auth_type: 'rerequest',
      },
      // NOTICE: Please do not actually request the token on the client (see:
      // response_type=token in the authUrl), it is not secure. Request a code
      // instead, and use this flow:
      // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
      // The code here is simplified for the sake of demonstration. If you are
      // just prototyping then you don't need to concern yourself with this and
      // can copy this example, but be aware that this is not safe in production.
      responseType: AuthSession.ResponseType.Token,
    },
    discovery,
  );

  const goToWebView = (uri: string): void => {
    navigation.navigate('WebView', { uri });
  };

  const appleLogin = async (): Promise<void> => {
    setSigningInApple(true);
    try {
      const csrf = Math.random().toString(36).substring(2, 15);
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256, nonce);
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        state: csrf,
        nonce: hashedNonce,
      });
      const { identityToken, email, state } = appleCredential;

      if (identityToken) {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        const credential = provider.credential({
          idToken: identityToken,
          rawNonce: nonce, // nonce value from above
        });
        const authResult = await firebase.auth().signInWithCredential(credential);
        createUser(authResult);
      }
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        Alert.alert(`Apple Login Error: ${e.code} - ${e.message}`);
      }
    } finally {
      setSigningInApple(false);
    }
  };

  const facebookLogin = async (): Promise<void> => {
    setSigningInFacebook(true);

    try {
      const result = await promptAsync({ useProxy });
      if (result.type !== 'success') {
        Alert.alert(getString('ERROR'), getString('ERROR_UNKNOWN'));
        return;
      }

      const accessToken = result.params.access_token;
      // const userInfoResponse = await fetch(
      //   `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,picture.type(large)`,
      // );
      // const userInfo = await userInfoResponse.json();

      const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
      // Sign in with credential from the Facebook user.
      const authResult = await firebase.auth().signInWithCredential(credential);
      createUser(authResult);
    } catch (err) {
      Alert.alert(`Facebook Login Error: ${err.message}`);
    } finally {
      setSigningInFacebook(false);
    }
  };

  return (
    <Container>
      <ScrollView style={{ alignSelf: 'stretch' }}>
        <Wrapper>
          <LogoWrapper>
            <TouchableOpacity
              style={{
                width: 124,
              }}
              testID="theme-test"
              onPress={(): void => changeThemeType()}
            ><StyledLogoImage source={IC_BOTTLE} /></TouchableOpacity>
          </LogoWrapper>
          <SocialButtonWrapper>
            {
              Platform.select({
                ios: <Button
                  testID="btn-apple"
                  style={{
                    backgroundColor: theme.appleBackground,
                    borderColor: theme.appleText,
                    width: '100%',
                    height: 48,
                    borderWidth: 1,
                    marginBottom: 12,
                    borderRadius: 100,
                  }}
                  // leftElement={
                  //   <View style={{ marginRight: 6 }}>
                  //     <SvgApple width={24} fill={theme.appleIcon}/>
                  //   </View>
                  // }
                  isLoading={signingInApple}
                  indicatorColor={theme.primary}
                  onPress={appleLogin}
                  text={getString('SIGN_IN_WITH_APPLE')}
                  textStyle={{ fontWeight: '700', color: theme.appleText }}
                />,
              })
            }
            <Button
              testID="btn-facebook"
              style={{
                backgroundColor: theme.facebookBackground,
                borderColor: theme.facebookBackground,
                borderWidth: 1,
                width: '100%',
                height: 48,
                marginBottom: 6,
                borderRadius: 100,
              }}
              // leftElement={
              //   <View style={{ marginRight: 6 }}>
              //     <SvgFacebook width={24} fill={theme.facebookIcon}/>
              //   </View>
              // }
              isLoading={signingInFacebook}
              indicatorColor={theme.primary}
              onPress={facebookLogin}
              text={getString('SIGN_IN_WITH_FACEBOOK')}
              textStyle={{ fontWeight: '700', color: theme.facebookText }}
            />
          </SocialButtonWrapper>
          <StyledAgreementTextWrapper>
            <StyledAgreementText>{getString('AGREEMENT1')}</StyledAgreementText>
            <StyledAgreementLinedText
              testID="btn-terms"
              onPress={(): void => {
                const url = 'https://dooboolab.com/termsofservice';
                if (Platform.OS === 'web') {
                  Linking.openURL(url);
                  return;
                }
                goToWebView(url);
              }}
            >
              {getString('AGREEMENT2')}
            </StyledAgreementLinedText>
            <StyledAgreementText>{getString('AGREEMENT3')}</StyledAgreementText>
            <StyledAgreementLinedText
              testID="btn-privacy"
              onPress={(): void => {
                const url = 'https://dooboolab.com/privacyandpolicy';
                if (Platform.OS === 'web') {
                  Linking.openURL(url);
                  return;
                }
                goToWebView(url);
              }}
            >
              {getString('AGREEMENT4')}
            </StyledAgreementLinedText>
            <StyledAgreementText>{getString('AGREEMENT5')}</StyledAgreementText>
          </StyledAgreementTextWrapper>
        </Wrapper>
      </ScrollView>
    </Container>
  );
}
