// src/components/Input.js
import React, { useState } from 'react';
import styled from 'styled-components/native';

// --- Estilos ---
const Container = styled.View`
  margin-bottom: 24px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_2};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  margin-bottom: 4px;
`;

// Estilização dinâmica da borda no foco
const TextInput = styled.TextInput`
  min-height: 48px;
  border-width: 1px;
  border-color: ${({ theme, isFocused }) => isFocused ? theme.COLORS.GREEN_DARK : theme.COLORS.GRAY_5};
  border-radius: 6px;
  padding: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_1};
`;

// --- Componente ---
export function Input({ label, ...rest }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container>
      <Label>{label}</Label>
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
        {...rest}
      />
    </Container>
  );
}