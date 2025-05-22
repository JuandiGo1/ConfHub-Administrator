import Toast from "react-native-toast-message";
import { IconButton, MD3Colors } from "react-native-paper";
import { deleteSpeaker} from "../services/speakerService";
import { View, Text } from "react-native";

export default function UserCard4Delete({ user }) {

  const handleDelete = async () => {
    const deleted = await deleteSpeaker(user.email);

    if (deleted) {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Usuario eliminado",
        position: "bottom",
        visibilityTime: 2000,
      });

    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Usuario no eliminado",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        flex:1,
        alignItems: "center",
        justifyContent:"center",
        padding: 20,
        backgroundColor: "purple",
        borderRadius: 15,
        marginTop:100,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, color: "blue" }}> {user.email} </Text>

        <Text style={{ fontSize: 15, marginTop:10 }}> {"Nombre: " + user.firstName} </Text>
        <Text style={{ fontSize: 15 }}> {"Apellido: " + user.lastName} </Text>
        <Text style={{ fontSize: 15 }}>
          {"Cantidad de eventos: " + (user.events.length
            ? user.events.length
            : "0")}
        </Text>
      </View>

      <IconButton
        icon="trash-can"
        iconColor={MD3Colors.error60}
        size={40}
        onPress={handleDelete}
      />
    </View>
  );
}
