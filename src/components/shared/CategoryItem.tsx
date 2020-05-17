import { Category, CategoryType } from '../../types';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useThemeContext } from '../../providers/ThemeProvider';

const Container = styled.TouchableOpacity`
  height: 136px;
  width: 96px;
  margin-left: 20px;

  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  height: 120px;
  width: 96px;
  border: 1px solid;
  border-color: ${({ theme }): string => theme.border};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.06);
  border-radius: 16px;

  justify-content: center;
  align-items: center;
`;

const Badge = styled.View`
  min-width: 57px;
  min-height: 30px;
  border-radius: 16px;
  position: absolute;
  bottom: 0;
  padding: 0 8px;
`;

interface Props {
  category: Category;
  onPress: () => void;
  isEtc?: boolean;
}

const CategoryItem: FC<Props> = ({
  category,
  onPress,
  isEtc,
}) => {
  const { theme } = useThemeContext();

  return <Container
    activeOpacity={0.75}
    onPress={onPress}
  >
    <Card>
      {
        category.svgIcon
          ? <category.svgIcon
            width={48}
            height={48}
            fill={theme.font}
          />
          : <View/>
      }
      <Text
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          fontSize: 18,
          color: category.color,
        }}
      >+{category.point}</Text>
    </Card>
    <Badge
      style={{
        backgroundColor: category.color,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
        }}
        numberOfLines={2}
      >{category.text}</Text>
    </Badge>
  </Container>;
};

export default CategoryItem;
