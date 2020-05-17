import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        asdf123: {
          displayName: 'user1',
          email: 'email@email.com',
        },
      },
    },
  },
};

const onAuthStateChanged = jest.fn();

const getRedirectResult = jest.fn(() => {
  return Promise.resolve({
    user: {
      displayName: 'redirectResultTestDisplayName',
      email: 'redirectTest@test.com',
      emailVerified: true,
    },
  });
});

const sendEmailVerification = jest.fn(() => {
  return Promise.resolve('result of sendEmailVerification');
});

const sendPasswordResetEmail = jest.fn(() => Promise.resolve());

const createUserWithEmailAndPassword = jest.fn(() => {
  return Promise.resolve('result of createUserWithEmailAndPassword');
});

const signInWithEmailAndPassword = jest.fn(() => {
  return Promise.resolve('result of signInWithEmailAndPassword');
});

const signInWithRedirect = jest.fn(() => {
  return Promise.resolve('result of signInWithRedirect');
});

const firebase = new MockFirebase(fixtureData);
const auth = (): object => {
  return {
    onAuthStateChanged,
    currentUser: {
      displayName: 'testDisplayName',
      email: 'test@test.com',
      emailVerified: true,
    },
    getRedirectResult,
    sendPasswordResetEmail,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect,
    FacebookAuthProvider: jest.fn(() => {}),
    GoogleAuthProvider: jest.fn(() => {}),
  };
};
// @ts-ignore
firebase.auth = auth;

export default firebase;
