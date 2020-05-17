import { Category, CategoryType } from '../../types';
import { Image, ScrollView, Text, View } from 'react-native';
import React, { FC } from 'react';

import AnimatedVirus from '../shared/AnimatedVirus';
import CategoryItem from '../shared/CategoryItem';
import { HomeBottomTabNavigationProps } from '../navigation/HomeTabNavigator';
import { IC_VIRUS_SHADOW } from '../../utils/Icons';
import { categoryMap } from '../../utils/constants';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useAppContext } from '../../providers/AppProvider';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Head = styled.View`
  margin: 22px;

  flex-direction: row;
  align-items: flex-end;
  flex-direction: row;
`;

const CategoryContainer = styled.View`
  height: 150px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }): string => theme.font};
`;

const Description = styled.Text`
  font-size: 12px;
  color: ${({ theme }): string => theme.fontSecondary};
  margin-left: 8px;
  margin-bottom: 2px;
`;

const Content = styled.View`
  width: 100%;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ScoreView = styled.View`
  width: 80%;
  margin-top: 60px;
  border-radius: 100px;
  height: 78px;
  border: 1px solid;
  border-color: ${({ theme }): string => theme.border};

  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ScoreTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }): string => theme.font};
`;

const ScoreText = styled.Text`
  font-size: 42px;
  color: ${({ theme }): string => theme.accent};
`;

interface Props {
  navigation: HomeBottomTabNavigationProps<'HomeMission'>;
}

const categories: Category[] = [
  categoryMap[CategoryType.HandWash],
  categoryMap[CategoryType.WearMask],
  categoryMap[CategoryType.StayHome],
  categoryMap[CategoryType.GoodConsumption],
  categoryMap[CategoryType.Etc],
];

const Page: FC<Props> = ({
  navigation,
}) => {
  const { state: { user } } = useAppContext();

  return (
    <Container>
      <Head>
        <Title>{getString('MISSION')}</Title>
        <Description>{getString('MISSION_DESCRIPTION')}</Description>
      </Head>
      <ScrollView
        style={{
          width: '100%',
        }}
      >
        <CategoryContainer>
          <ScrollView horizontal>
            {
              categories.map((category: Category, i: number) => {
                return <CategoryItem
                  key={i}
                  category={category}
                  onPress={(): void => navigation.navigate(
                    'PostActivity',
                    {
                      category,
                    },
                  )}
                  isEtc={category.point === 0}
                />;
              })
            }
            <View style={{ width: 36 }} />
          </ScrollView>
        </CategoryContainer>
        <Content>
          <AnimatedVirus
            style={{
              marginTop: 114,
              marginBottom: 48,
              alignSelf: 'center',
            }}
          />
          <Image
            source={IC_VIRUS_SHADOW}
            style={{
              width: 131,
              height: 24,
            }}
          />
          <ScoreView>
            <ScoreTitle>{getString('CURRENT_SCORE')}</ScoreTitle>
            <ScoreText>
              {user?.point || 0}
              <Text style={{
                fontSize: 20,
              }}>  {getString('POINT')}</Text>
            </ScoreText>
          </ScoreView>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default Page;
