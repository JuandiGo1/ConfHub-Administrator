import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CreateAccountScreenAdmin from "./CreateAccountScreenAdmin";
import DeleteAccountsScreen from "./DeleteAccountsScreen";
import EditAccountDataScreen from "./EditAccountDataScreen";

const Tab = createMaterialTopTabNavigator();

export default function AccountScreen({ route, navigation }) {
  const { user, refresh, setRefresh } = route.params;
  return (
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
      <Tab.Screen
        name="Datos"
        component={EditAccountDataScreen}
        initialParams={{ user, refresh, setRefresh }}
      />

      {user.rol != null ? (
        <>
          <Tab.Screen
            name="Crear usuarios"
            component={CreateAccountScreenAdmin}
          />
          <Tab.Screen name="Eliminar usuarios" component={DeleteAccountsScreen} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}
