import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CreateAccountScreenAdmin from "./CreateAccountScreenAdmin";
import DeleteUsersScreen from "./DeleteUsersScreen";
import EditAccountData from "./EditAccountData";

const Tab = createMaterialTopTabNavigator();

export default function AccountScreen({ route, navigation }) {
  const { user } = route.params;
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
        component={EditAccountData}
        initialParams={{ user }}
      />

      {user.rol != null ? (
        <>
          <Tab.Screen
            name="Crear usuarios"
            component={CreateAccountScreenAdmin}
          />
          <Tab.Screen name="Eliminar usuarios" component={DeleteUsersScreen} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}
