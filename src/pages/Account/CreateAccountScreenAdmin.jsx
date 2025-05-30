import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Image } from "react-native";
import { Platform } from "react-native";
import { makeAdmin } from "../../services/adminService";

export default function CreateAccountScreenAdmin({ navigation }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validatepassword, setValidatePassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [validatePasswordError, setValidatePasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [image, setImage] = useState(null);

  const handleRegister = async () => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexName = /^[a-zA-Z._%+-]{2,}$/;
    const regexLastName = /^[a-zA-Z._%+-]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (email && !regexEmail.test(email)) {
      setEmailError("El correo no es valido");
    } else {
      setEmailError("");
    }

    if (password && !regexPassword.test(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una letra y un número"
      );
    } else {
      setPasswordError("");
    }

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

    if (!email) {
      setEmailError("El correo es requerido");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
    } else {
      setPasswordError("");
    }

    if (validatepassword !== password) {
      setValidatePasswordError("Las contraseñas deben coincidir");
    } else {
      setValidatePasswordError("");
    }

    if (
      emailError ||
      passwordError ||
      nameError ||
      lastNameError ||
      validatePasswordError
    ) {
      return;
    }
    let photo;

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
        const blob = new Blob([byteArray], { type: "image/jpeg" });
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

    const admin = new FormData();

    admin.append("firstName", name);
    admin.append("lastName", lastName);
    admin.append("email", email);
    admin.append("password", password);
    if (image && Platform.OS === "web") {
      admin.append("image", file);
    } else {
      admin.append("image", photo);
    }

    const isRegistered = await makeAdmin(admin);

    if (isRegistered) {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Usuario administrador creado",
        position: "bottom",
        visibilityTime: 2000,
      });
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
      mediaTypes: "Images",
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
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500 }}>
            Registrar un administrador
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
            {!image && <Ionicons name="camera" size={100} color="#2196f3" />}

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
          <View style={{ flexDirection: "column", width: "100%", padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: nameError ? 0 : 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Nombre:</Text>
              <TextInput
                placeholder="Ingresa el nombre"
                value={name}
                onChangeText={setName}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius:10,
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
                marginBottom: lastNameError ? 0 : 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Apellido:</Text>
              <TextInput
                placeholder="Ingresa el apellido"
                value={lastName}
                onChangeText={setLastName}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius:10,
                  borderRadius:10,
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
                width: "100%",
                marginBottom: emailError ? 0 : 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Correo:</Text>

              <TextInput
                placeholder="Ingresa el correo"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius:10,
                  borderColor: emailError ? "red" : "#ccc",
                }}
              />
            </View>

            {emailError ? (
              <Text
                style={{
                  fontSize: 10,
                  display: "flex",
                  marginLeft: 100,
                  color: "red",
                  marginBottom: 20,
                }}
              >
                {emailError}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: passwordError ? 0 : 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>Contraseña:</Text>
              <TextInput
                placeholder="Ingresa la contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius:10,
                  borderColor: passwordError ? "red" : "#ccc",
                }}
              />
            </View>
            {passwordError ? (
              <Text
                style={{
                  display: "flex",
                  fontSize: 10,
                  marginLeft: 100,
                  color: "red",
                  marginBottom: 20,
                }}
              >
                {passwordError}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: validatePasswordError ? 0 : 20,
              }}
            >
              <Text style={{ minWidth: 100, flexShrink: 1 }}>
                Confirmar contraseña:
              </Text>
              <TextInput
                placeholder="Repite la contraseña"
                value={validatepassword}
                onChangeText={setValidatePassword}
                secureTextEntry
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius:10,
                  borderColor: validatePasswordError ? "red" : "#ccc",
                }}
              />
            </View>
            {validatePasswordError ? (
              <Text
                style={{
                  display: "flex",
                  fontSize: 10,
                  marginLeft: 140,
                  marginBottom: 20,
                  color: "red",
                }}
              >
                {validatePasswordError}
              </Text>
            ) : null}
          </View>

          <Button
            style={{ marginTop: 20, borderRadius: 30 }}
            title="Registrar"
            onPress={handleRegister}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
