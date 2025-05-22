import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from 'react-native';
import styles from '../../styles/styles';
import Events from './Events';
import MyEvents from './MyEvents';

const Tab = createMaterialTopTabNavigator();

export default function EventsScreen() {
  return (
    <View style={styles.container}>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 50, // ajusta el alto
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#000",
          },
        }}  >
          <Tab.Screen name='Buscar'
          component={Events}/>

          <Tab.Screen name='Mis Eventos'
          component={MyEvents}/>

        </Tab.Navigator>
      <StatusBar style="auto" />
    </View>
  );
}