import { View, Text, Image, Pressable, ScrollView, ActivityIndicator } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import styles from "../styles/styles";
import { getEvents } from "../services/eventService";
import { getSpeaker } from "../services/speakerService";
import { getData, storeData } from "../storage/localStorage";
import { getAdmin } from "../services/adminService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PaginatedList from "../components/PaginatedList";
import EventCard from "../components/EventCard";
import DashboardScreen from "./Dashboard/DashboardScreen";

export default function Home({ route }) {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsActive, setEventsActive] = useState([]);
  const [eventsEnded, setEventsEnded] = useState([]);
  const [eventsToday, setEventsToday] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchUser();
    console.log("Usuario refrescado");
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const fetchUser = async () => {
    const speaker = await getSpeaker(await getData("email"));
    const admin = await getAdmin(await getData("email"));
    const currentUser = admin ? admin.admin : speaker.speaker;
    setUser(currentUser);
    await storeData("user", JSON.stringify(currentUser));
  };

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      const today = new Date();
      setEvents(response);

      setEventsActive(
        response.filter((event) => event.status === "Por empezar")
      );

      setEventsEnded(response.filter((event) => event.status === "Finalizado"));

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
    } finally {
       setLoading(false);
    }
  };

  const handleRefresh = async (event) => {
    await fetchEvents();
  };

  return (
    <SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
      <SafeAreaView style={{ flex: 1 }}>
          {/* Encabezado */}
          <View style={styles.header}>
            <View>
              <Text style={styles.subtitle}>BIENVENIDO</Text>
              <Text style={styles.title}>
                {user != null
                  ? user.firstName + "  " + user.lastName
                  : "Usuario"}
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate("Cuenta", { user, refresh })}
            >
              <Image
                source={
                  user && user.image
                    ? { uri: user.image + `?${new Date().getTime()}` } // Cache busting
                    : require("../../assets/defaultpfp.png")
                }
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
              <Text style={styles.cardTitle}>Finalizados</Text>
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

        { loading ?  <ActivityIndicator style={{ marginTop: 40 }} /> :

          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: { fontSize: 14 },
              tabBarStyle: {
                backgroundColor: "#fff",
                height: 50, // ajusta el alto
              },
              tabBarIndicatorStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            <Tab.Screen
              name="Eventos"
              component={AllEvents}
              initialParams={{events, navigation, handleRefresh, refreshing, setRefreshing}}
            />
            <Tab.Screen name="Estadisticas" component={DashboardScreen} />
          </Tab.Navigator>

          }


      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AllEvents({ route, navigation }) {
  const { events } = route.params;
  const renderEventCard = ({ item }) => (
    <EventCard
      page="Home"
      key={item.eventid}
      event={item}
      onPress={() => navigation.navigate("EventDetail", { event:item })}
    />
  );
  return (
    <>
      <PaginatedList
        data={events}
        renderItem={renderEventCard}
        listHeight={480} // Altura fija
        emptyMessage="No hay eventos aún"
      />
    </>
  );
}
