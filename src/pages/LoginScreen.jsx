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
  const [secure, setSecure] = useState(false);

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
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection:"column",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500 }}>
            Iniciar sesión
          </Text>
          <Ionicons name="person" size={100} color="#2196f3" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: emailError ? 0 : 20,
            }}
          >
            <Ionicons name="person" size={25} color="#2196f3" />
            <TextInput
              placeholder="Ingresa el correo"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                borderColor: emailError ? "red" : "#ccc",
              }}
            />
          </View>
          {emailError ? (
            <Text style={{ color: "red", marginBottom: 20, marginLeft: 25 }}>
              {emailError}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: passwordError ? 0 : 20,
            }}
          >
            <Ionicons name="lock-closed" size={25} color="#2196f3" />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: passwordError ? "red" : "#ccc",
                borderRadius: 10,
              }}
            >
              <TextInput
                placeholder="Ingresa la contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!secure}
                style={{
                  padding: 10,
                  borderRadius: 10,
                }}
              />
              <Ionicons
                onPress={() => setSecure(!secure)}
                style={{ margin: 0, padding: 0 }}
                name={secure ? "eye-outline" : "eye-off-outline"}
                size={25}
                color="#2196f3"
              />
              <View />
            </View>
          </View>
          {passwordError ? (
            <Text style={{ color: "red", marginBottom: 20, marginLeft: 25 }}>
              {passwordError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
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
