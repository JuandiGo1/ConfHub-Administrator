import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Toast from "react-native-toast-message";
import { makeSpeaker } from "../../services/speakerService";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Image } from "react-native";
import { Platform } from "react-native";

export default function CreateAccountScreen({ navigation }) {
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

    const speaker = new FormData();

    speaker.append("firstName", name);
    speaker.append("lastName", lastName);
    speaker.append("email", email);
    speaker.append("password", password);
    if (image && Platform.OS === "web") {
      speaker.append("image", file);
    } else {
      speaker.append("image", photo);
    }

    const isRegistered = await makeSpeaker(speaker);

    if (isRegistered) {
      navigation.replace("Login");
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500 }}>
          Registrarse
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
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Nombre:</Text>
            <TextInput
              placeholder="Ingresa tu nombre"
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1,
                padding: 10,
                marginLeft: 37,
                marginVertical: 10,
                width: "100%",
                borderColor: nameError ? "red" : "#ccc",
              }}
            />
          </View>
          {nameError ? (
            <Text
              style={{
                display: "flex",
                fontSize: 10,
                justifyContent: "center",
                marginLeft: "70px",
                color: "red",
              }}
            >
              {nameError}
            </Text>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Apellido:</Text>
            <TextInput
              placeholder="Ingresa tu apellido"
              value={lastName}
              onChangeText={setLastName}
              style={{
                borderWidth: 1,
                padding: 10,
                marginLeft: 37,
                marginVertical: 10,
                width: "100%",
                borderColor: lastNameError ? "red" : "#ccc",
              }}
            />
          </View>
          {lastNameError ? (
            <Text
              style={{
                display: "flex",
                fontSize: 10,
                justifyContent: "center",
                marginLeft: "72px",
                color: "red",
              }}
            >
              {lastNameError}
            </Text>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Correo:</Text>

            <TextInput
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                padding: 10,
                marginLeft: 47,
                marginVertical: 10,
                width: "100%",
                borderColor: emailError ? "red" : "#ccc",
              }}
            />
          </View>

          {emailError ? (
            <Text
              style={{
                fontSize: 10,
                display: "flex",
                fontSize: 10,
                marginRight: "27px",
                justifyContent: "center",
                color: "red",
              }}
            >
              {emailError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Contraseña:</Text>
            <TextInput
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                borderWidth: 1,
                padding: 10,
                marginLeft: 19,
                marginVertical: 10,
                width: "100%",
                borderColor: passwordError ? "red" : "#ccc",
              }}
            />
          </View>
          {passwordError ? (
            <Text
              style={{
                display: "flex",
                fontSize: 10,
                justifyContent: "center",
                color: "red",
              }}
            >
              {passwordError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Confirmar contraseña:</Text>
            <TextInput
              placeholder="Repite tu contraseña"
              value={validatepassword}
              onChangeText={setValidatePassword}
              secureTextEntry
              style={{
                borderWidth: 1,
                padding: 10,
                marginVertical: 10,
                width: "100%",
                borderColor: validatePasswordError ? "red" : "#ccc",
              }}
            />
          </View>
          {validatePasswordError ? (
            <Text
              style={{
                display: "flex",
                fontSize: 10,
                justifyContent: "center",
                marginLeft: "20px",
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
    </SafeAreaProvider>
  );
}
