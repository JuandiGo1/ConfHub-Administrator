import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSpeaker } from "../../services/speakerService";
import UserCard4Delete from "../../components/UserCard4Delete";

export default function DeleteAccountsScreen() {
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

        <TextInput
          style={{padding: 20, borderWidth: 1, borderColor: "black", width: 300, borderRadius: 10 }}
          placeholderTextColor="black"
          value={searched}
          onChangeText={setSearch}
          placeholder="ingresa el correo a eliminar"
        />
       <Ionicons
            style={{ borderRadius: 30 }}
            size={30}
            name="search-sharp"
            onPress={handleSearch}
          />
      </View>

      {user2Delete ? <UserCard4Delete user={user2Delete.speaker} /> : null}
    </View>
  );
}

