import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

import { AppLoading, Asset } from 'expo';
import React, { useState } from 'react';

import { AppearanceProvider } from 'react-native-appearance';
import Base64 from 'Base64';
import Icons from './utils/Icons';
import { Image } from 'react-native';
import RootNavigator from './components/navigation/RootStackNavigator';
import RootProvider from './providers';
import firebase from 'firebase/app';
import { firebaseConfig } from '../config';

!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

// @ts-ignore
global.btoa = Base64.btoa;
// @ts-ignore
global.atob = Base64.atob;

function cacheImages(images: Image[]): Image[] {
  return images.map((image: Image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const loadAssetsAsync = async (): Promise<void> => {
  const imageAssets = cacheImages(Icons);

  await Promise.all([...imageAssets]);
};

function App(): React.ReactElement {
  return <RootNavigator />;
}

function ProviderWrapper(): React.ReactElement {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <AppLoading
        startAsync={loadAssetsAsync}
        onFinish={(): void => setLoading(true)}
        // onError={console.warn}
      />
    );
  }

  return (
    <AppearanceProvider>
      <RootProvider>
        <App />
      </RootProvider>
    </AppearanceProvider>
  );
}

export default ProviderWrapper;
