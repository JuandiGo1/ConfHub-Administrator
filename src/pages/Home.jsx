import { View, Text, Image } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "../styles/styles";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider style={[styles.container,  { paddingTop: insets.top }]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>BIENVENIDO</Text>
          <Text style={styles.title}>Admin</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </View>

      {/* Tarjetas */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#6EE7B7" }]}>
          <Text style={styles.cardTitle}>Eventos Activos</Text>
          <Text style={styles.cardValue}>23</Text>
          <Text style={styles.cardInfo}>↑ 3 More vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FCA5A5" }]}>
          <Text style={styles.cardTitle}>Finalizados</Text>
          <Text style={styles.cardValue}>12</Text>
          <Text style={styles.cardInfo}>↓ 1 Less vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FDE68A" }]}>
          <Text style={styles.cardTitle}>Pendientes</Text>
          <Text style={styles.cardValue}>35</Text>
          <Text style={styles.cardInfo}>↑ 1 New vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#BFDBFE" }]}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardValue}>None</Text>
          <Text style={styles.cardInfo}>No new Meetings</Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
