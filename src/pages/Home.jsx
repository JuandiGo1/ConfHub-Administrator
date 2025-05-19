
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import styles from "../styles/styles";
import { getEvents } from "../services/eventService";
import { getSpeaker } from "../services/speakerService";
import { getData, storeData } from "../storage/localStorage";
import { getAdmin } from "../services/adminService";
import { useNavigation } from "@react-navigation/native";

import EventCard from "../components/EventCard";


export default function Home() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsActive, setEventsActive] = useState([]);
  const [eventsEnded, setEventsEnded] = useState([]);
  const [eventsToday, setEventsToday] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const today = new Date();
        setEvents(response);

        setEventsActive(
          response.filter((event) => event.status === "Por empezar")
        );

        setEventsEnded(
          response.filter((event) => event.status === "Finalizado")
        );

        setEventsToday(
          response.filter((event) => {
            const eventDate = new Date(event.datetime); // Convertir datetime a Date
            return (
              eventDate.getDate() === today.getDate() &&
              eventDate.getMonth() === today.getMonth() &&
              eventDate.getFullYear() === today.getFullYear()
            );
          })
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    const fetchUser = async () => {
      const speaker = await getSpeaker(await getData("email"));
      const admin = await getAdmin(await getData("email"));
      console.log("speaker", speaker);
      console.log("admin", admin);
      setUser(admin ? admin.admin : speaker.speaker);
    };

    fetchUser();

    fetchEvents();
  }, []);

  useEffect(() => {
    storeData("user", user);
    console.log("user", user);
  }, [user]);

  return (
    <SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>BIENVENIDO</Text>
          <Text style={styles.title}>
            {user != null ? user.firstName + "  " + user.lastName : "Usuario"}
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate("Cuenta", {user})}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
        </Pressable>
      </View>

      {/* Tarjetas */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#6EE7B7" }]}>
          <Text style={styles.cardTitle}>Eventos Activos</Text>
          <Text style={styles.cardValue}>{eventsToday.length}</Text>
          <Text style={styles.cardInfo}>↑ Eventos hoy</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FCA5A5" }]}>
          <Text style={styles.cardTitle}>Finalizadoss</Text>
          <Text style={styles.cardValue}>{eventsEnded.length}</Text>
          <Text style={styles.cardInfo}>↓ Eventos pasados</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FDE68A" }]}>
          <Text style={styles.cardTitle}>Pendientes</Text>
          <Text style={styles.cardValue}>{eventsActive.length}</Text>
          <Text style={styles.cardInfo}>↑ 1 Eventos próximos</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#BFDBFE" }]}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardValue}>{events.length}</Text>
          <Text style={styles.cardInfo}>Eventos totales</Text>
        </View>
      </View>
      
      <ScrollView>
        {/* Eventos */}
        <View style={styles.eventsGrid}>
          {events.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              onPress={() => console.log("Evento presionado", event)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
