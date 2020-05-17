import { CategoryType, Throphy } from '../types';
import {
  SvgCatEtc,
  SvgCatGoodConsumption,
  SvgCatHandWash,
  SvgCatHomeStay,
  SvgCatMask,
} from '../utils/Icons';

import { getString } from '../../STRINGS';

export const categoryMap = {
  HandWash: {
    type: CategoryType.HandWash,
    point: 3,
    text: getString('HAND_WASH'),
    svgIcon: SvgCatHandWash,
    color: '#02C7D3',
  },
  WearMask: {
    type: CategoryType.WearMask,
    point: 5,
    text: getString('WEAR_MASK'),
    svgIcon: SvgCatMask,
    color: '#00A8F0',
  },
  StayHome: {
    type: CategoryType.StayHome,
    point: 10,
    text: getString('STAY_HOME'),
    svgIcon: SvgCatHomeStay,
    color: '#1C77FF',
  },
  GoodConsumption: {
    type: CategoryType.GoodConsumption,
    point: 15,
    text: getString('GOOD_CONSUMPTION'),
    svgIcon: SvgCatGoodConsumption,
    color: '#1363DB',
  },
  Etc: {
    type: CategoryType.Etc,
    point: 1,
    text: getString('ETC'),
    svgIcon: SvgCatEtc,
    color: '#444444',
  },
};

export const trophyMap = {
  HAND_WASH_10: {
    type: 'HAND_WASH_10',
    count: 10,
    text: getString('HAND_WASH'),
  } as Throphy,
  WEAR_MASK_10: {
    type: 'WEAR_MASK_10',
    count: 10,
    text: getString('WEAR_MASK'),
  } as Throphy,
  STAY_HOME_10: {
    type: 'STAY_HOME_10',
    count: 10,
    text: getString('STAY_HOME'),
  } as Throphy,
  GOOD_CONSUMPTION_10: {
    type: 'GOOD_CONSUMPTION_10',
    count: 10,
    text: getString('GOOD_CONSUMPTION'),
  } as Throphy,
  ETC_10: {
    type: 'ETC_10',
    count: 10,
    text: getString('ETC'),
  } as Throphy,
  HAND_WASH_50: {
    type: 'HAND_WASH_50',
    count: 50,
    text: getString('HAND_WASH'),
  } as Throphy,
  WEAR_MASK_50: {
    type: 'WEAR_MASK_50',
    count: 50,
    text: getString('WEAR_MASK'),
  } as Throphy,
  STAY_HOME_50: {
    type: 'STAY_HOME_50',
    count: 50,
    text: getString('STAY_HOME'),
  } as Throphy,
  GOOD_CONSUMPTION_50: {
    type: 'GOOD_CONSUMPTION_50',
    count: 50,
    text: getString('GOOD_CONSUMPTION'),
  } as Throphy,
  ETC_50: {
    type: 'ETC_50',
    count: 50,
    text: getString('ETC'),
  } as Throphy,
  HAND_WASH_100: {
    type: 'HAND_WASH_100',
    count: 100,
    text: getString('HAND_WASH'),
  } as Throphy,
  WEAR_MASK_100: {
    type: 'WEAR_MASK_100',
    count: 100,
    text: getString('WEAR_MASK'),
  } as Throphy,
  STAY_HOME_100: {
    type: 'STAY_HOME_100',
    count: 100,
    text: getString('STAY_HOME'),
  } as Throphy,
  GOOD_CONSUMPTION_100: {
    type: 'GOOD_CONSUMPTION_100',
    count: 100,
    text: getString('GOOD_CONSUMPTION'),
  } as Throphy,
  ETC_100: {
    type: 'ETC_100',
    count: 100,
    text: getString('ETC'),
  } as Throphy,
  HAND_WASH_500: {
    type: 'HAND_WASH_500',
    count: 500,
    text: getString('HAND_WASH'),
  } as Throphy,
  WEAR_MASK_500: {
    type: 'WEAR_MASK_500',
    count: 500,
    text: getString('WEAR_MASK'),
  } as Throphy,
  STAY_HOME_500: {
    type: 'STAY_HOME_500',
    count: 500,
    text: getString('STAY_HOME'),
  } as Throphy,
  GOOD_CONSUMPTION_500: {
    type: 'GOOD_CONSUMPTION_500',
    count: 500,
    text: getString('GOOD_CONSUMPTION'),
  } as Throphy,
  ETC_500: {
    type: 'ETC_500',
    count: 500,
    text: getString('ETC'),
  } as Throphy,
  LIKES_10: {
    type: 'LIKES_10',
    count: 10,
    text: getString('LIKES'),
  } as Throphy,
  LIKES_50: {
    type: 'LIKES_50',
    count: 50,
    text: getString('LIKES'),
  } as Throphy,
  LIKES_100: {
    type: 'LIKES_100',
    count: 100,
    text: getString('LIKES'),
  } as Throphy,
  LIKES_500: {
    type: 'LIKES_500',
    count: 500,
    text: getString('LIKES'),
  } as Throphy,
  SHARE_10: {
    type: 'SHARE_10',
    count: 10,
    text: getString('SHARE'),
  } as Throphy,
  SHARE_50: {
    type: 'SHARE_50',
    count: 50,
    text: getString('SHARE'),
  } as Throphy,
  SHARE_100: {
    type: 'SHARE_100',
    count: 100,
    text: getString('SHARE'),
  } as Throphy,
  SHARE_500: {
    type: 'SHARE_500',
    count: 500,
    text: getString('SHARE'),
  } as Throphy,
};
