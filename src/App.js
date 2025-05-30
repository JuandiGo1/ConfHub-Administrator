import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./pages/Home";
import EventsScreen from "./pages/Event/EventsScreen";
import CreateEvent from "./pages/Event/CreateEvent";
import EventDetailPage from "./pages/Event/EventDetail";
import TrackListingPage from "./pages/Track/TrackListingPage";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./pages/LoginScreen";
import CreateAccountScreen from "./pages/Account/CreateAccountScreen";
import Toast from "react-native-toast-message";
import AccountScreen from "./pages/Account/AccountScreen";
import DashboardScreen from "./pages/Dashboard/DashboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Registrar"
            component={CreateAccountScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetailPage}
            options={{ title: "Detalle del Evento" }}
          />
          <Stack.Screen
            name="Tracks"
            component={TrackListingPage}
            options={{ headerShown: true }}
          />

          <Stack.Screen
            name="Cuenta"
            component={AccountScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Eventos":
              iconName = "calendar-outline";
              break;
            case "Nuevo evento":
              iconName = "add-circle-outline";
              break;
            case "Tracks":
              iconName = "albums-outline";
              break;
            case "Dashboard":
              iconName = "stats-chart";
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
        name="Nuevo evento"
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
      <Tab.Screen name="Eventos" component={EventsScreen} />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Estadísticas",
          headerStyle: {
            backgroundColor: "#f2f2f2",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Tracks"
        component={TrackListingPage}
        options={{ tabBarLabel: "Tracks" }}
      />
    </Tab.Navigator>
  );
}
