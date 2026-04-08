import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';

import theme from './src/theme';
import { Home } from './src/screens/Home';
import { MealForm } from './src/screens/MealForm';
import { MealDetails } from './src/screens/MealDetails';
import { Statistics } from './src/screens/Statistics';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Statistics" component={Statistics} />
          <Stack.Screen name="MealForm" component={MealForm} />
          <Stack.Screen name="MealDetails" component={MealDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}