import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';

import { Alert, Linking, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { IC_BOTTLE, SvgApple, SvgFacebook, SvgGoogle } from '../../utils/Icons';
import React, { ReactElement, useState } from 'react';
import { facebookAppId, facebookSecret, googleClientId, googleSecret } from '../../../config';

import Button from '../shared/Button';
import { SocialAuthProvider } from '../../types';
import SocialSignInButton from '../shared/SocialSignInButton';
import { createUser } from '../../services/firebaseService';
import firebase from 'firebase/app';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useAppContext } from '../../providers/AppProvider';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  background: ${({ theme }): string => theme.background};
`;

const Wrapper = styled.View`
  margin: 20px 40px;
`;

const LogoWrapper = styled.View`
  margin-top: 200px;
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
  const { setUser } = useAppContext();

  const [signingInApple, setSigningInApple] = useState<boolean>(false);

  WebBrowser.maybeCompleteAuthSession();

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
        const user = await createUser(authResult);

        if (user) {
          // ensure update to navigate when this is new user
          setUser(user);
        }
      }
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        if (Platform.OS === 'web') {
          // @ts-ignore
          alert(`Apple Login Error: ${e.code} - ${e.message}`);

          return;
        }

        Alert.alert(`Apple Login Error: ${e.code} - ${e.message}`);
      }
    } finally {
      setSigningInApple(false);
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
                  leftElement={
                    <View style={{ marginRight: 6 }}>
                      <SvgApple width={18} height={18} fill={theme.appleIcon}/>
                    </View>
                  }
                  isLoading={signingInApple}
                  indicatorColor={theme.primary}
                  onPress={appleLogin}
                  text={getString('SIGN_IN_WITH_APPLE')}
                  textStyle={{ fontWeight: '700', color: theme.appleText }}
                />,
              })
            }
            <SocialSignInButton
              clientId={facebookAppId}
              clientSecret={facebookSecret}
              svgIcon={<SvgFacebook width={18} height={18} fill={theme.facebookIcon}/>}
              onUserCreated={(user): void => {
                if (user) setUser(user);
              }}
              socialProvider={SocialAuthProvider.Facebook}
            />
            <SocialSignInButton
              clientId={googleClientId}
              clientSecret={googleSecret}
              svgIcon={<SvgGoogle width={20} height={20} fill={theme.googleIcon}/>}
              onUserCreated={(user): void => {
                if (user) setUser(user);
              }}
              socialProvider={SocialAuthProvider.Google}
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
