// src/screens/Home.js
import React, { useState, useCallback, useMemo } from 'react';
import { SectionList, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import theme from '../theme';
import { Button } from '../components/Button';
import { mealsGetAll } from '../storage/mealStorage';

// --- Estilos ---
const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const PercentContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  /* Muda a cor de fundo dependendo de ter mais refeições boas ou ruins (opcional, deixei verde por padrão) */
  background-color: ${({ theme }) => theme.COLORS.GREEN_LIGHT};
  align-items: center;
  margin-bottom: 32px;
`;

const PercentText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXXL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

const PercentSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
`;

const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  margin-bottom: 12px;
`;

const MealCard = styled.TouchableOpacity`
  width: 100%;
  height: 49px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.GRAY_5};
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
`;

const MealTime = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  margin-right: 12px;
`;

const Separator = styled.View`
  height: 14px;
  width: 1px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_4};
  margin-right: 12px;
`;

const MealName = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
`;

const StatusIndicator = styled.View`
  height: 14px;
  width: 14px;
  border-radius: 7px;
  background-color: ${({ theme, inDiet }) => inDiet ? theme.COLORS.GREEN_MID : theme.COLORS.RED_MID};
`;

// --- Componente ---
export function Home() {
  const [meals, setMeals] = useState([]);
  // Adicionado estados para calcular a porcentagem
  const [percentage, setPercentage] = useState('0,00'); 
  const navigation = useNavigation();

  const mealsByDate = useMemo(() => {
    if (!meals.length) return [];
    const grouped = {};
    meals.forEach(meal => {
      if (!grouped[meal.date]) grouped[meal.date] = [];
      grouped[meal.date].push(meal);
    });
    return Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date]
    }));
  }, [meals]);

  useFocusEffect(
    useCallback(() => {
      async function fetchMeals() {
        try {
          const data = await mealsGetAll();
          setMeals(data);
          
          // Lógica do cálculo da porcentagem adicionada aqui
          const total = data.length;
          const inDietCount = data.filter(meal => meal.inDiet).length;
          const calcPercentage = total > 0 ? ((inDietCount / total) * 100).toFixed(2).replace('.', ',') : '0,00';
          
          setPercentage(calcPercentage);
        } catch (error) {
          console.log(error);
        }
      }
      fetchMeals();
    }, [])
  );

  return (
    <Container>
      <Header>
        <PercentSubtitle>Ignite Diet</PercentSubtitle> 
        <Text>Perfil</Text>
      </Header>

      <PercentContainer onPress={() => navigation.navigate('Statistics')}>
        {/* Agora é dinâmico! */}
        <PercentText>{percentage}%</PercentText>
        <PercentSubtitle>das refeições dentro da dieta</PercentSubtitle>
      </PercentContainer>

      <SectionTitle>Refeições</SectionTitle>
      
      <Button
        title="Nova refeição"
        icon={<Feather name="plus" color={theme.COLORS.WHITE} size={18} />}
        onPress={() => navigation.navigate('MealForm')}
      />

      <SectionList
        sections={mealsByDate}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MealCard onPress={() => navigation.navigate('MealDetails', { mealId: item.id })}>
            <MealTime>{item.time}</MealTime>
            <Separator />
            <MealName>{item.name}</MealName>
            <StatusIndicator inDiet={item.inDiet} />
          </MealCard>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontFamily: theme.FONT_FAMILY.BOLD, fontSize: theme.FONT_SIZE.XXL, color: theme.COLORS.GRAY_1, marginTop: 16, marginBottom: 8 }}>
            {title}
          </Text>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 24, fontStyle: 'italic', color: theme.COLORS.GRAY_3 }}>Nenhuma refeição cadastrada.</Text>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Container>
  );
}