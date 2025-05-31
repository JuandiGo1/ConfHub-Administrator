import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { deleteAdmin, updateAdmin } from "../../services/adminService";
import styles from "../../styles/styles";
import Toast from "react-native-toast-message";
import { deleteSpeaker, updateSpeaker } from "../../services/speakerService";
import { getData, removeData, storeData } from "../../storage/localStorage";
import * as ImagePicker from "expo-image-picker";
import { Platform, Pressable, TouchableOpacity, Image } from "react-native";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function EditAccountDataScreen({ route }) {
  const { user, refresh } = route.params;
  const navigation = useNavigation();
  const [name, setName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const logOut = async () => {
    await removeData("token");
    await removeData("email");
    await removeData("user");

    navigation.navigate("Login");
  };
  const deleteThisAccount = async () => {
    let deleted = false;
    if (!user.rol) {
      deleted = await deleteSpeaker(user.email);
    } else {
      deleted = await deleteAdmin(user.email);
    }

    if (deleted) {
      setModalVisible(false);
      logOut();
    }
  };
  const handleEdit = async () => {
    const regexName = /^[a-zA-Z._%+-]{2,}$/;
    const regexLastName = /^[a-zA-Z._%+-]{2,}$/;

    if (name && (name.length > 15 || !regexName.test(name))) {
      setNameError("Nombre menor a 15 caracteres y solo letras");
    } else {
      setNameError("");
    }
    if (lastName && (lastName.length > 15 || !regexLastName.test(lastName))) {
      setLastNameError("Apellido menor a 15 caracteres y solo letras");
    } else {
      setLastNameError("");
    }

    if (nameError || lastNameError) {
      return;
    }
    let photo;
    let blob;
    let file;
    if (image) {
      if (Platform.OS === "web") {
        // 🔹 Convert Base64 to Blob for Web
        const base64Data = image.split(",")[1]; // Remove "data:image/png;base64,"
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/jpeg" });
        file = new File([blob], "mi_imagen.jpeg", { type: "image/jpeg" });
      } else {
        const fileType = image.split(".").pop(); // extensión, ej: jpg, png
        const fileName = image.split("/").pop() || "photo.jpg";
        photo = {
          uri: image.startsWith("file://") ? image : "file://" + image,
          name: fileName,
          type: `image/${fileType}`,
        };
      }
    } else {
      photo = {
        uri: "file://",
        name: "photo.jpg",
        type: "image/jpeg",
      };
    }

    let isUpdated = false;

    if (user && user.rol) {
      const admin = new FormData();

      admin.append("firstName", name);
      admin.append("lastName", lastName);
      admin.append("email", email);
      if (image && Platform.OS === "web") {
        admin.append("image", file);
      } else {
        admin.append("image", photo);
      }

      isUpdated = await updateAdmin(user.email, admin);
    } else if (user && !user.rol) {
      const speaker = new FormData();
      speaker.append("firstName", name);
      speaker.append("lastName", lastName);
      speaker.append("email", email);
      if (image && Platform.OS === "web") {
        speaker.append("image", file);
      } else {
        speaker.append("image", photo);
      }

      isUpdated = await updateSpeaker(user.email, speaker);
    }

    if (isUpdated) {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Datos actualizados",
        position: "bottom",
        visibilityTime: 2000,
      });
      // Actualizar datos del usuario
      navigation.navigate("Main");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Revisa los datos ingresados",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500 }}>
            Datos de cuenta
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
            {!image && (
              <Image
                source={
                  user.image
                    ? { uri: user.image + `?${new Date().getTime()}` }
                    : require("../../../assets/defaultpfp.png")
                }
                style={styles.avatar}
              />
            )}

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            )}
            <Text style={{ marginVertical: 10 }}>
              {image ? "Cambia la imagen" : "Selecciona una imagen"}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "column", width: "100%", padding:10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: nameError ? 0 : 20
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Nombre:</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius:10,
                  padding: 10,
                  borderColor: nameError ? "red" : "#ccc",
                }}
              />
            </View>
            {nameError ? (
              <Text
                style={{
                  display: "flex",
                  fontSize: 10,
                  marginLeft: 100,
                  color: "red",
                  marginBottom: 20,
                }}
              >
                {nameError}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: lastNameError ? 0 : 20
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Apellido:</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius:10,
                  padding: 10,
                  borderColor: lastNameError ? "red" : "#ccc",
                }}
              />
            </View>
            {lastNameError ? (
              <Text
                style={{
                  display: "flex",
                  fontSize: 10,
                  marginLeft: 100,
                  color: "red",
                  marginBottom: 20,
                }}
              >
                {lastNameError}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Correo:</Text>

              <TextInput
                editable={false}
                keyboardType="email-address"
                value={email}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius:10,
                  padding: 10,
                }}
              />
            </View>
          </View>

          <Button
            style={{ marginTop: 30, borderRadius: 30 }}
            title="Actualizar"
            onPress={handleEdit}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <FAB
            icon="trash-can"
            onPress={() => setModalVisible(true)}
            style={styles.fab}
            label="Eliminar cuenta"
          />
          <FAB
            icon="replay"
            onPress={logOut}
            style={styles.fab2}
            label="Log out"
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                ¿Estás seguro que deseas eliminar tu cuenta?
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "red", marginRight: 10 },
                  ]}
                  onPress={deleteThisAccount}
                >
                  <Text style={styles.textStyle}>Eliminar cuenta</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Salir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
