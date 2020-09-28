import { Category, CategoryType, Photo, User } from '../types';

import firebase from 'firebase/app';
import shortid from 'shortid';

export const createUser = async (credential: firebase.auth.UserCredential): Promise<User | undefined> => {
  const db = firebase.firestore();
  const user = credential.user;

  if (user) {
    const prevDoc = await db.collection('users').doc(user.uid).get();

    if (!prevDoc.exists) {
      const newUser: User = {
        uid: user.uid,
        email: user.email as string,
        displayName: user.displayName,
        photoURL: user.photoURL,
        signInMethod: credential.credential?.signInMethod,
        point: 0,
      };

      await db.collection('users')
        .doc(user.uid)
        .set(newUser, { merge: true });

      return newUser;
    }
  }
};

export const getUserById = async (userId: string): Promise<User | undefined> => {
  if (!userId) return;

  const db = firebase.firestore();

  const userDoc = await db.collection('users')
    .doc(userId).get();

  return userDoc.data() as User;
};

export const uploadProfile = async (
  imageUri: string,
  thumbUri?: string,
): Promise<void> => {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser) return;

  if (thumbUri) {
    const thumbRes = await fetch(thumbUri);
    const thumbBlob = await thumbRes.blob();
    const thumbRef = firebase.storage().ref().child(`profile/${currentUser.uid}_thumb`).put(thumbBlob);

    thumbRef.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        console.log(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        firebase.storage().ref().child(`profile/${currentUser.uid}_thumb`).getDownloadURL().then((url) => {
          firebase.firestore().collection('users')
            .doc(currentUser.uid)
            .update({
              thumbURL: url,
            });

          currentUser.updateProfile({
            photoURL: url,
          });
        });
      },
    );
  }

  const picRes = await fetch(imageUri);
  const picBlob = await picRes.blob();
  const picRef = firebase.storage().ref(`profile/${currentUser.uid}`).put(picBlob);

  picRef.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      console.log(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      firebase.storage().ref(`profile/${currentUser.uid}`).getDownloadURL().then((url) => {
        firebase.firestore().collection('users')
          .doc(currentUser.uid)
          .update({
            photoURL: url,
          });
      });
    },
  );
};

export const uploadOrRemovePhoto = async (
  photo: Photo,
  dir: string,
  refId: string,
): Promise<string | undefined> => {
  const currentUser = firebase.auth().currentUser;
  const id = `${shortid.generate()}_${new Date()}`;

  const getUrl = (picRef: firebase.storage.UploadTask): Promise<string> => {
    return new Promise(function(resolve, reject) {
      picRef.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          console.log(progress);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          firebase.storage().ref()
            .child(`${dir}/${refId}`)
            .child(id)
            .getDownloadURL().then((url) => {
              resolve(url);
            });
        },
      );
    });
  };

  if (!currentUser) return;

  const { deleted, added, uri } = photo;

  if (deleted) {

  } else if (added) {
    const picRes = await fetch(uri);
    const picBlob = await picRes.blob();

    const picRef = firebase.storage().ref()
      .child(`${dir}/${refId}`)
      .child(id)
      .put(picBlob);

    return getUrl(picRef);
  }
};

export const updateUserPoint = (
  categoryType: string,
  currentUser: firebase.User,
  shouldAdd: boolean): number => {
  let point = categoryType === CategoryType.HandWash
    ? 3
    : categoryType === CategoryType.WearMask
      ? 5
      : categoryType === CategoryType.StayHome
        ? 10
        : categoryType === CategoryType.GoodConsumption
          ? 15
          : 1;

  if (!shouldAdd) {
    point = -point;
  }

  const userRef = firebase.firestore().collection('users').doc(currentUser.uid);

  userRef.update('point', firebase.firestore.FieldValue.increment(point));

  return point;
};
