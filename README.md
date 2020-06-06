# Hygiene

[![CircleCI](https://circleci.com/gh/hyochan/Hygiene.svg?style=shield)](https://circleci.com/gh/hyochan/Hygiene)
[![codecov](https://codecov.io/gh/hyochan/hygiene/branch/master/graph/badge.svg)](https://codecov.io/gh/hyochan/hygiene)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

> Hygiene is an app built in univeral [expo](https://expo.io) app that supports `ios`, `android` and `web`. Hygiene aims to lead people the right behaviors to fight such virus when we are in trouble like today. This is a concept application to provide ideas for all organizations.

![ScreenShot](https://cdn-images-1.medium.com/max/1440/1*U8gvjmBk0j8QI5dyiDtxKQ.png)

### Introduction

`Hygiene` was built to contribute my skill to be somewhat helpful to `Covid-19` pandemic. However, `Apple` rejected my contribution so this app won't appear in `iOS`.

### Universl app

* App

  <a href=""><img src="https://user-images.githubusercontent.com/27461460/77502559-8c8a8d80-6e9e-11ea-9f8e-0f58c704eed6.png" width="200"/></a> <a href="https://play.google.com/store/apps/details?id=dev.hygiene"><img src="https://user-images.githubusercontent.com/27461460/77502571-90b6ab00-6e9e-11ea-9e93-235a319ebb41.png" width="200"/></a>

* Web

  [https://hygiene.dooboolab.com](https://hygiene.dooboolab.com)


### Community

* [Medium](https://medium.com/@dooboolab/use-universal-expo-ios-android-web-to-create-your-app-5388d4594a9b)
* [Twitter](https://twitter.com/dooboolab/status/1264895733083172865)
  

### Project spectification 

- [react-native](https://github.com/facebook/react-native)
- [expo](https://github.com/expo/expo)
- [react-navigation](https://github.com/react-navigation/react-navigation)
- [typescript](https://github.com/Microsoft/TypeScript)
- [expo-localizatian](https://docs.expo.io/versions/latest/sdk/localization)
- [styled-components](https://github.com/styled-components/styled-components)
- [ts-jest](https://github.com/kulshekhar/ts-jest)
- [@testing-library/react-native](https://github.com/testing-library/native-testing-library)
- [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)
- [react-hook](https://reactjs.org/docs/hooks-intro.html)
- [prettier](https://prettier.io)

### INSTALL

```
npm install && npm start
// or
yarn && yarn start
```

### Structures

```text
app/
├─ .doobooo // necessary if using dooboo-cli
├─ .expo
├─ assets
│  └─ icons // app icons
│  └─ images // app images like background images
├─ node_modules/
├─ src/
│  └─ apis
│  └─ components
│     └─ navigations
│     └─ screen
│     └─ shared
│  └─ contexts
│  └─ utils
│  └─ App.tsx
├─ test/
├─ .buckconfig
├─ .flowconfig
├─ .gitattributes
├─ .gitignore
├─ .watchmanconfig
├─ app.json
├─ babel.config.js
├─ index.js
├─ jest.config.js
├─ package.json
├─ README.md
├─ STRINGS.js
├─ tsconfig.json
└─ tslint.json
```

### Setup environment variable

Hygiene uses [firebase](https://firebase.google.com) as a backend. Therefore you should paste the `firebase` env variables in `config.ts`. Currently, this this file is ignored in `.gitignore`. Therefore you should copy `config.sample.ts` to `config.ts` and replace the variables.

```sh
cp config.sample.ts config.ts
```

Also, you should replace the `facebookAppId` and `facebookSecret` for [facebook login](https://developers.facebook.com/docs/facebook-login) feature.

### Running the project

Running the project is as simple as running

```sh
yarn start
```

This runs the `start` script specified in our `package.json`, and will spawn off a server which reloads the page as we save our files.
Typically the server runs at `http://localhost:8080`, but should be automatically opened for you.

### Testing the project

Testing is also just a command away:

```sh
yarn test
```

> Result

```
> jest -u

 PASS  src/components/shared/__tests__/Button.test.tsx
 PASS  src/components/screen/__tests__/Intro.test.tsx
 › 2 snapshots written.

Snapshot Summary
 › 2 snapshots written in 1 test suite.

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   2 added, 4 passed, 6 total
Time:        3.055s, estimated 6s
Ran all test suites
```

### Writing tests with Jest

We've created test examples with jest-ts in `src/components/screen/__tests__` and `src/components/shared/__tests__`. Since react is component oriented, we've designed to focus on writing test in same level of directory with component. You can simply run `npm test` to test if it succeeds and look more closer opening the source.

### Localization

We've defined Localization strings in `STRINGS.ts` which is in root dir.
We used [i18n-js](https://github.com/fnando/i18n-js) pacakage for this one.

```
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const en = {
  HELLO: 'Hello',
  LOGIN: 'Login',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  SIGNUP: 'SIGN UP',
  FORGOT_PW: 'Forgot password?',
  NAVIGATE: 'Navigate',
  CHANGE_THEME: 'Change theme',
};

const ko = {
  HELLO: '안녕하세요',
  LOGIN: '로그인',
  EMAIL: '이메일',
  PASSWORD: '패스워드',
  SIGNUP: '회원가입',
  FORGOT_PW: '비밀번호를 잊어버리셨나요?',
  NAVIGATE: '이동하기',
  CHANGE_THEME: '테마변경',
};

i18n.fallbacks = true;
i18n.translations = { en, ko };
i18n.locale = Localization.locale;

export const getString = (param: string, mapObj?: object) => {
  if (mapObj) {
    i18n.t(param, mapObj);
  }
  return i18n.t(param);
};
```

Fixed jest setup by adding following in jestSetup.

```
import { NativeModules } from 'react-native';

/**
 * monkey patching the locale to avoid the error:
 * Something went wrong initializing the native ReactLocalization module
 * https://gist.github.com/MoOx/08b465c3eac9e36e683929532472d1e0
 */

NativeModules.ReactLocalization = {
  language: 'en_US',
};
```
