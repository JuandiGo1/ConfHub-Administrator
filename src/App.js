import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./pages/Home";
import EventLine from "./pages/EventLine";
import CreateEvent from "./pages/CreateEvent";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "home";
            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Events":
                iconName = "calendar-outline";
                break;
              case "NewEvent":
                iconName = "add-circle-outline";
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="NewEvent"
          component={CreateEvent}
          options={{
            title: "Crear Evento",
            headerStyle: {
              backgroundColor: "#f2f2f2",
            },
            headerTintColor: "#333", // color del texto y botones del header
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
          }}
        />
        <Tab.Screen name="Events" component={EventLine} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
