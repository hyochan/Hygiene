import React, { ReactElement, useEffect, useState } from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { ThemeType, useThemeContext } from '../../providers/ThemeProvider';

import AnimatedVirus from '../shared/AnimatedVirus';
import Intro from '../screen/Intro';
import LoadingIndicator from '../shared/LoadingIndicator';
import Main from './MainStackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import StatusBar from '../shared/StatusBar';
import Temp from '../screen/Temp';
import { User } from '../../types';
import WebView from '../screen/WebView';
import firebase from 'firebase/app';
import { useAppContext } from '../../providers/AppProvider';

export type RootStackParamList = {
  default: undefined;
  Main: undefined;
  Intro: undefined;
  Temp: { param: string };
  WebView: { uri: string };
}

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'default'
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): React.ReactElement {
  const db = firebase.firestore();
  const { theme, themeType } = useThemeContext();

  const {
    resetUser,
    setUser,
    state: { user, appLoading },
  } = useAppContext();

  const [authInitiated, setAuthInitiated] = useState<boolean>(false);

  useEffect(() => {
    if (authInitiated) {
      return;
    }

    setAuthInitiated(true);

    firebase.auth().onAuthStateChanged(function(fireUser) {
      if (!fireUser) {
        resetUser();

        return;
      }

      db.collection('users').doc(fireUser.uid).get().then((snap) => {
        const data = snap.data();

        if (data) {
          data.uid = fireUser.uid;
          setUser(data as User);
        }
      });
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: { color: theme.font },
          headerTintColor: theme.tint,
        }}
        headerMode={
          themeType === ThemeType.DARK ? 'screen' : 'float'
        }
      >
        {
          user
            ? <Stack.Screen name="Main" component={Main} />
            : <Stack.Screen name="Intro" component={Intro} />
        }
        <Stack.Screen name="Temp" component={Temp} />
        <Stack.Screen name="WebView" component={WebView}
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: '',
          }}
        />
      </Stack.Navigator>
      {
        appLoading
          ? <LoadingIndicator
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            renderCustomElement={(): ReactElement => {
              return <AnimatedVirus
                animDuration={800}
              />;
            }}
          />
          : null
      }
    </NavigationContainer>
  );
}

export default RootNavigator;
