import { Image, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';

import { Photo } from '../../types';
import { SvgPlus } from '../../utils/Icons';
import styled from 'styled-components/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.View`
  padding: 0 8px;

  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

interface Props {
  picture: Photo[];
  onAddPhoto?: () => void;
}

const PictureUploadBox: FC<Props> = ({
  picture,
  onAddPhoto,
}) => {
  const { theme } = useThemeContext();

  return <Container>
    {
      picture.map((photo: Photo, i: number) => {
        return <Image
          key={i}
          style={{
            height: 80,
            width: 80,
            borderRadius: 10,
            marginRight: 8,
            borderWidth: 1,
            borderColor: theme.border,
          }}
          resizeMethod="resize"
          source={{
            uri: photo.uri,
          }}
        />;
      })
    }
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onAddPhoto}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 10,

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SvgPlus
          // width={40}
          stroke={theme.fontSecondary}
        />
      </View>
    </TouchableOpacity>
  </Container>;
};

export default PictureUploadBox;
