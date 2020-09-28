import { Animated, Image, ViewStyle } from 'react-native';
import React, { FC, useEffect } from 'react';

import { IC_VIRUS } from '../../utils/Icons';
import styled from 'styled-components/native';

interface Props {
  width?: number;
  maxValue?: number;
  minValue?: number;
  margin?: number;
  animDuration?: number;
  style?: ViewStyle;
}

const AnimatedVirus: FC<Props> = ({
  width = 114,
  maxValue = 20,
  minValue = 20,
  animDuration = 750,
  style,
}) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: -1,
          duration: animDuration,
        }),
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: animDuration,
        }),
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 0,
          duration: animDuration,
        }),
      ]),
    ).start();
  });

  return <Animated.View
    style={{
      transform: [{
        translateY: fadeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-maxValue, minValue],
        }),
      }],
      ...style,
    }}
  >
    <Image
      source={IC_VIRUS}
      style={{
        width,
        height: width,
      }}
    />
  </Animated.View>;
};

export default AnimatedVirus;
