import { StyleProp, TextStyle } from 'react-native';

import { SFC } from 'react';
import firebase from 'firebase/app';

export type FirebaseUser = firebase.User;

export type User = {
  uid: string;
  displayName: string | null;
  email: string;
  introduction: string | null;
  point: number;
  photoURL: string | null;
  thumbURL?: string;
}

export type Reply = {
  id: string;
  text: string;
  writerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IconProps {
  style?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  children?: never;
}

export type IconType = SFC<IconProps>;

export interface Activity {
  id: string;
  writerId: string;
  message: string;
  urls: string[];
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Photo {
  uri: string;
  thumbUri?: string;
  added?: boolean;
  deleted?: boolean;
}

export enum CategoryType {
  HandWash = 'HandWash',
  WearMask = 'WearMask',
  StayHome = 'StayHome',
  GoodConsumption = 'GoodConsumption',
  Etc = 'Etc',
}

export interface Category {
  type: string;
  point: number;
  text: string;
  svgIcon: any;
  color: string;
}

export enum SelectImageActionType {
  LAUNCH_CAMERA = 0,
  LAUNCH_GALLERY = 1,
  CANCEL = 2,
}

export enum SelectMyFeedMoreActionType {
  DELETE = 0,
  CANCEL = 1,
}

export enum SelectPeerFeedMoreActionType {
  CANCEL = 0,
}

export interface Throphy {
  type: string;
  text: string;
  count: number;
}
