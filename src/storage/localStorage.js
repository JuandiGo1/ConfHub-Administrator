import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar un valor
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error al guardar en AsyncStorage:', e);
  }
};

// Leer un valor
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error('Error al leer de AsyncStorage:', e);
  }
};

export const removeData = async (key) => {
  try {
    const value = await AsyncStorage.removeItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error('Error al eliminar de AsyncStorage:', e);
  }
};