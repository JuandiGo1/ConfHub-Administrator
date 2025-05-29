import { StatusBar } from "expo-status-bar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "react-native";
import styles from "../../styles/styles";
import Events from "../../components/Events";
import MyEvents from "../../components/MyEvents";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

export default function EventsScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
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
            }}
          >
            <Tab.Screen name="Buscar" component={Events} />

            <Tab.Screen name="Mis Eventos" component={MyEvents} />
          </Tab.Navigator>
          <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
