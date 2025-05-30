import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { loginAdmin } from "../services/adminService";
import Toast from "react-native-toast-message";
import { loginSpeaker } from "../services/speakerService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    if (!email) {
      setEmailError("El correo es requerido");
    }
    if (email && !email.includes("@")) {
      setEmailError("El correo no es valido");
    }
    if (!password) {
      setPasswordError("La contraseña es requerida");
    }

    if (emailError || passwordError) {
      return;
    }
    const isAdmin = await loginAdmin(email, password);
    const isSpeaker = await loginSpeaker(email, password);

    const islogged = isAdmin || isSpeaker;

    if (islogged) {
      navigation.replace("Main");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El correo o la contraseña son incorrectos",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500 }}>
            Iniciar sesión
          </Text>
          <Ionicons name="person" size={100} color="#2196f3" />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person" size={25} color="#2196f3" />
            <TextInput
              placeholder="Ingresa el correo"
              value={email}
              onChangeText={setEmail}
              borderColor={emailError ? "red" : "#ccc"}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius:10,
                marginVertical: 10,
                width: "100%",
              }}
            />
          </View>
          {emailError ? (
            <Text style={{ color: "red" }}>{emailError}</Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="lock-closed" size={25} color="#2196f3" />
            <TextInput
              placeholder="Ingresa la contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              borderColor={emailError ? "red" : "#ccc"}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius:10,
                marginVertical: 10,
                width: "100%",
              }}
            />
          </View>
          {passwordError ? (
            <Text style={{ color: "red" }}>{passwordError}</Text>
          ) : null}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>¿No tienes una cuenta? </Text>
            <Text
              onPress={() => navigation.navigate("Registrar")}
              style={{ color: "blue", textDecorationLine: "underline" }}
            >
              Crea una
            </Text>
          </View>
          <Button
            style={{ marginTop: 20, borderRadius: 30 }}
            title="Entrar"
            onPress={handleLogin}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
