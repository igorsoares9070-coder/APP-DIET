// src/storage/mealStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEAL_COLLECTION = '@ignite-diet:meals';

export async function mealsGetAll() {
  try {
    const storage = await AsyncStorage.getItem(MEAL_COLLECTION);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    throw error;
  }
}

export async function mealCreate(newMeal) {
  try {
    const storedMeals = await mealsGetAll();
    const storage = JSON.stringify([...storedMeals, newMeal]);
    await AsyncStorage.setItem(MEAL_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

export async function mealRemove(id) {
  try {
    const storedMeals = await mealsGetAll();
    const filteredMeals = storedMeals.filter(meal => meal.id !== id);
    await AsyncStorage.setItem(MEAL_COLLECTION, JSON.stringify(filteredMeals));
  } catch (error) {
    throw error;
  }
}

// NOVA FUNÇÃO DE EDIÇÃO
export async function mealUpdate(updatedMeal) {
  try {
    const storedMeals = await mealsGetAll();
    
    // Mapeia as refeições. Se encontrar a que tem o mesmo ID, substitui pela nova.
    // Se não, mantém a refeição como estava.
    const updatedStorage = storedMeals.map(meal => 
      meal.id === updatedMeal.id ? updatedMeal : meal
    );

    await AsyncStorage.setItem(MEAL_COLLECTION, JSON.stringify(updatedStorage));
  } catch (error) {
    throw error;
  }
}