// src/components/Button.js
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

// --- Estilos ---
const Container = styled(TouchableOpacity)`
  min-height: 50px;
  max-height: 50px;
  background-color: ${({ theme, type }) => type === 'PRIMARY' ? theme.COLORS.GRAY_2 : theme.COLORS.WHITE};
  border-width: ${({ type }) => type === 'PRIMARY' ? '0' : '1px'};
  border-color: ${({ theme, type }) => type === 'PRIMARY' ? 'transparent' : theme.COLORS.GRAY_1};
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 16px;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  color: ${({ theme, type }) => type === 'PRIMARY' ? theme.COLORS.WHITE : theme.COLORS.GRAY_1};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
`;

// Estilo para o ícone (se houver)
const IconContainer = styled.View`
  margin-right: 12px;
`;

// --- Componente ---
export function Button({ title, type = 'PRIMARY', icon, isLoading = false, ...rest }) {
  return (
    <Container type={type} activeOpacity={0.7} disabled={isLoading} {...rest}>
      {isLoading ? (
        <ActivityIndicator color={type === 'PRIMARY' ? 'white' : 'black'} />
      ) : (
        <>
          {icon && <IconContainer>{icon}</IconContainer>}
          <Title type={type}>{title}</Title>
        </>
      )}
    </Container>
  );
}