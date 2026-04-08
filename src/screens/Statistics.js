// src/screens/Statistics.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Trocado para Feather

import theme from '../theme';
import { mealsGetAll } from '../storage/mealStorage';

// --- Estilos ---
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GREEN_LIGHT};
`;

const Header = styled.View`
  padding: 48px 24px 32px 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 24px;
  top: 48px;
  padding: 8px; /* Área de clique mais amigável para o dedo */
  z-index: 10; /* Traz o botão para a frente */
  elevation: 10; /* Faz o mesmo no Android */
`;

const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXXL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  text-align: center;
`;

const HeaderSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  text-align: center;
`;

const Content = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
`;

const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  margin-bottom: 24px;
  text-align: center;
`;

const StatCard = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_6};
  border-radius: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

const StatCardStatus = styled.View`
  flex: 1;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  background-color: ${({ theme, type }) => type === 'DIET' ? theme.COLORS.GREEN_LIGHT : theme.COLORS.RED_LIGHT};
  margin-right: ${({ isFirst }) => isFirst ? '12px' : '0px'};
`;

const StatText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

const StatSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  text-align: center;
`;

const StatRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

// --- Componente ---
export function Statistics() {
  const [inDietCount, setInDietCount] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const navigation = useNavigation();

  // useFocusEffect recarrega os dados sempre que a tela é aberta
  useFocusEffect(
    useCallback(() => {
      async function fetchStats() {
        const storedMeals = await mealsGetAll();
        const count = storedMeals.filter(meal => meal.inDiet).length;
        setInDietCount(count);
        setTotalMeals(storedMeals.length);
      }
      fetchStats();
    }, [])
  );

  const outOfDietCount = totalMeals - inDietCount;
  // Calcula a porcentagem e troca o ponto por vírgula
  const percentage = totalMeals > 0 ? ((inDietCount / totalMeals) * 100).toFixed(2).replace('.', ',') : '0,00';

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.navigate('Home')}>
          <Feather name="arrow-left" size={24} color={theme.COLORS.GRAY_2} />
        </BackButton>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <HeaderTitle>{percentage}%</HeaderTitle>
          <HeaderSubtitle>das refeições dentro da dieta</HeaderSubtitle>
        </View>
      </Header>

      <Content>
        <SectionTitle>Estatísticas gerais</SectionTitle>
        
        <StatCard>
          <StatText>1</StatText>
          <StatSubtitle>melhor sequência de pratos dentro da dieta</StatSubtitle>
        </StatCard>

        <StatCard>
          <StatText>{totalMeals}</StatText>
          <StatSubtitle>refeições registradas</StatSubtitle>
        </StatCard>

        <StatRow>
          <StatCardStatus isFirst type="DIET">
            <StatText>{inDietCount}</StatText>
            <StatSubtitle>refeições dentro da dieta</StatSubtitle>
          </StatCardStatus>

          <StatCardStatus type="NON_DIET">
            <StatText>{outOfDietCount}</StatText>
            <StatSubtitle>refeições fora da dieta</StatSubtitle>
          </StatCardStatus>
        </StatRow>
      </Content>
    </Container>
  );
}