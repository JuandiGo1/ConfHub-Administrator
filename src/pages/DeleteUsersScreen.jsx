import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteSpeaker, getSpeaker } from "../services/speakerService";
import Toast from "react-native-toast-message";
import { IconButton, MD3Colors } from "react-native-paper";

export default function DeleteUsersScreen() {
  const [user2Delete, setUser2Delete] = useState(null);
  const [searched, setSearch] = useState("");

  const handleSearch = async () => {
    console.log(searched);
    if (searched) {
      setUser2Delete(await getSpeaker(searched));
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons size={30} name="search-outline" />
        <TextInput
          value={searched}
          onChangeText={setSearch}
          placeholder="ingresa el correo a eliminar"
        />
        <Button
          style={{ borderRadius: 30, fontSize: 10 }}
          title="Buscar"
          onPress={handleSearch}
        />
      </View>

      {user2Delete ? <UserCard user={user2Delete.speaker} /> : ""}
    </View>
  );
}

function UserCard({ user }) {
  console.log(user);
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
