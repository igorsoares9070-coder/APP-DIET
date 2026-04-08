// src/screens/MealForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Usando Feather para funcionar no Snack

import theme from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { mealCreate, mealUpdate, mealsGetAll } from '../storage/mealStorage';

// --- Estilos (Mantidos iguais) ---
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_5};
`;

const Header = styled.View`
  padding: 48px 24px 24px 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 24px;
  top: 48px;
`;

const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

const Form = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Col = styled.View`
  flex: 1;
  margin-right: ${({ isFirst }) => isFirst ? '16px' : '0px'};
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  margin-bottom: 8px;
`;

const SelectContainer = styled.View`
  flex-direction: row;
  margin-bottom: 24px;
`;

const SelectButton = styled(TouchableOpacity)`
  flex: 1;
  min-height: 50px;
  max-height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border-width: 1px;
  margin-right: ${({ isFirst }) => isFirst ? '16px' : '0px'};
  
  background-color: ${({ theme, isActive, type }) => {
    if (!isActive) return theme.COLORS.GRAY_6;
    return type === 'DIET' ? theme.COLORS.GREEN_LIGHT : theme.COLORS.RED_LIGHT;
  }};
  
  border-color: ${({ theme, isActive, type }) => {
    if (!isActive) return 'transparent';
    return type === 'DIET' ? theme.COLORS.GREEN_DARK : theme.COLORS.RED_DARK;
  }};
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 8px;
  background-color: ${({ theme, type }) => 
    type === 'DIET' ? theme.COLORS.GREEN_DARK : theme.COLORS.RED_DARK};
`;

const SelectText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

const Footer = styled.View`
  padding: 24px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
`;

// --- Componente ---
export function MealForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [inDiet, setInDiet] = useState(null); 
  
  const navigation = useNavigation();
  const route = useRoute();

  // 1. Recebendo o ID (se existir)
  const mealId = route.params?.mealId;
  const isEditing = !!mealId; // Transforma em booleano (true se tiver ID)

  // 2. Buscando os dados se for edição
  useEffect(() => {
    if (isEditing) {
      async function loadMeal() {
        const storedMeals = await mealsGetAll();
        const mealToEdit = storedMeals.find(meal => meal.id === mealId);
        
        if (mealToEdit) {
          setName(mealToEdit.name);
          setDescription(mealToEdit.description);
          setDate(mealToEdit.date);
          setTime(mealToEdit.time);
          setInDiet(mealToEdit.inDiet);
        }
      }
      loadMeal();
    }
  }, [isEditing, mealId]);

  async function handleSaveMeal() {
    if (!name || !description || !date || !time || inDiet === null) {
      return Alert.alert('Atenção', 'Por favor, preencha todos os campos e selecione se está na dieta.');
    }

    const mealData = {
      id: isEditing ? mealId : new Date().getTime().toString(), // Mantém o ID se for edição
      name,
      description,
      date,
      time,
      inDiet
    };

    try {
      if (isEditing) {
        // 3. Se for edição, atualiza
        await mealUpdate(mealData);
        Alert.alert('Sucesso', 'Refeição atualizada!');
        navigation.navigate('Home'); // Volta pra Home para ver a lista atualizada
      } else {
        // Se for criação, cadastra novo
        await mealCreate(mealData);
        Alert.alert('Sucesso', 'Refeição cadastrada!');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a refeição.');
    }
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={theme.COLORS.GRAY_2} />
          </BackButton>
          {/* Muda o título dependendo do modo */}
          <HeaderTitle>{isEditing ? 'Editar refeição' : 'Nova refeição'}</HeaderTitle>
        </Header>

        <Form showsVerticalScrollIndicator={false}>
          <Input 
            label="Nome" 
            value={name} 
            onChangeText={setName} 
          />
          
          <Input 
            label="Descrição" 
            value={description} 
            onChangeText={setDescription} 
            multiline 
            style={{ minHeight: 120, textAlignVertical: 'top' }}
          />

          <Row>
            <Col isFirst>
              <Input 
                label="Data" 
                value={date} 
                onChangeText={setDate} 
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <Input 
                label="Hora" 
                value={time} 
                onChangeText={setTime} 
                placeholder="HH:MM"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Label>Está dentro da dieta?</Label>
          <SelectContainer>
            <SelectButton 
              isFirst 
              type="DIET" 
              isActive={inDiet === true}
              onPress={() => setInDiet(true)}
            >
              <StatusDot type="DIET" />
              <SelectText>Sim</SelectText>
            </SelectButton>

            <SelectButton 
              type="NON_DIET" 
              isActive={inDiet === false}
              onPress={() => setInDiet(false)}
            >
              <StatusDot type="NON_DIET" />
              <SelectText>Não</SelectText>
            </SelectButton>
          </SelectContainer>
        </Form>

        <Footer>
          {/* Muda o texto do botão dependendo do modo */}
          <Button 
            title={isEditing ? 'Salvar alterações' : 'Cadastrar refeição'} 
            onPress={handleSaveMeal} 
          />
        </Footer>
      </Container>
    </KeyboardAvoidingView>
  );
}