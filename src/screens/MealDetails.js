// src/screens/MealDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, PencilSimple, Trash } from 'phosphor-react-native';

import theme from '../theme';
import { Button } from '../components/Button';
import { mealsGetAll, mealRemove } from '../storage/mealStorage';

// --- Estilos ---
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

const Content = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
`;

const FieldTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  margin-bottom: 8px;
`;

const FieldDescription = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  margin-bottom: 24px;
`;

const FieldTime = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  margin-bottom: 8px;
`;

const FieldTimeText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  margin-bottom: 24px;
`;

// Bolinha de status (dentro/fora da dieta)
const StatusIndicator = styled.View`
  width: 144px;
  height: 34px;
  border-radius: 17px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_6};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: auto;
`;

const StatusDot = styled.View`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${({ theme, inDiet }) => inDiet ? theme.COLORS.GREEN_MID : theme.COLORS.RED_MID};
  margin-right: 8px;
`;

const StatusText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

const Footer = styled.View`
  padding: 24px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
`;

// Estilos para o Modal de confirmação
const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ModalContent = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.GRAY_7};
  border-radius: 8px;
  padding: 24px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
  text-align: center;
  margin-bottom: 24px;
`;

const ModalFooter = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const ModalButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  border-width: ${({ type }) => type === 'SECONDARY' ? '1px' : '0'};
  border-color: ${({ theme }) => theme.COLORS.GRAY_1};
  background-color: ${({ theme, type }) => type === 'SECONDARY' ? theme.COLORS.WHITE : theme.COLORS.GRAY_2};
  margin-right: ${({ isFirst }) => isFirst ? '12px' : '0px'};
`;

const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme, type }) => type === 'SECONDARY' ? theme.COLORS.GRAY_1 : theme.COLORS.WHITE};
`;

// --- Componente ---
export function MealDetails() {
  const [meal, setMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { mealId } = route.params; // Recebe o ID da refeição via navegação

  useEffect(() => {
    async function fetchMeal() {
      const storedMeals = await mealsGetAll();
      const foundMeal = storedMeals.find(item => item.id === mealId);
      setMeal(foundMeal);
    }
    fetchMeal();
  }, [mealId]);

  async function handleDeleteMeal() {
    try {
      await mealRemove(mealId);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Refeição excluída!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a refeição.');
    }
  }

  if (!meal) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando refeição...</Text>
      </View>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.COLORS.GRAY_2} />
        </BackButton>
        <HeaderTitle>Refeição</HeaderTitle>
      </Header>

      <Content>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FieldTitle>{meal.name}</FieldTitle>
          <FieldDescription>{meal.description}</FieldDescription>

          <FieldTime>Data e hora</FieldTime>
          <FieldTimeText>{meal.date} às {meal.time}</FieldTimeText>

          <StatusIndicator>
            <StatusDot inDiet={meal.inDiet} />
            <StatusText>{meal.inDiet ? 'dentro da dieta' : 'fora da dieta'}</StatusText>
          </StatusIndicator>
        </ScrollView>
      </Content>

      <Footer>
        <Button 
          title="Editar refeição" 
          icon={<PencilSimple size={18} color={theme.COLORS.WHITE} />}
          onPress={() => navigation.navigate('MealForm', { mealId: meal.id })} // Navega para edição
          style={{ marginBottom: 12 }}
        />

        <Button 
          title="Excluir refeição" 
          icon={<Trash size={18} color={theme.COLORS.GRAY_1} />}
          type="SECONDARY"
          onPress={() => setModalVisible(true)} // Abre o modal
        />
      </Footer>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Deseja realmente excluir o registro da refeição?</ModalTitle>
            
            <ModalFooter>
              <ModalButton isFirst type="SECONDARY" onPress={() => setModalVisible(false)}>
                <ModalButtonText type="SECONDARY">Cancelar</ModalButtonText>
              </ModalButton>

              <ModalButton onPress={handleDeleteMeal}>
                <ModalButtonText>Sim, excluir</ModalButtonText>
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}