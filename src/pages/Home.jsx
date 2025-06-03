import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useState, useEffect, useCallback, useRef } from "react";
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
import { Ionicons } from "@expo/vector-icons";

export default function Home({ route }) {
  let screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsActive, setEventsActive] = useState([]);
  const [eventsEnded, setEventsEnded] = useState([]);
  const [eventsToday, setEventsToday] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { height, width } = Dimensions.get("window");

      setIsPortrait(height >= width);
    };

    // Ejecutar al montar
    handleOrientationChange();

    // Suscribirse a cambios
    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => subscription?.remove();
  }, []);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const flatListRef = useRef(null);

  const scrollTo = () => {
    console.log("scrolleado");
    console.log(flatListRef.current);
    flatListRef.current?.scrollToEnd({ offset: 1000, animated: true });
  };

  return (
    <SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Encabezado */}
          <View
            style={styles.header}
            onLayout={(event) => {
              setHeaderHeight(event.nativeEvent.layout.height);
            }}
          >
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
                    ? { uri: user.image + `?${new Date().getTime()}` }
                    : require("../../assets/defaultpfp.png")
                }
                style={styles.avatar}
              />
            </Pressable>
          </View>

          {/* Tarjetas */}
          <View
            onLayout={(event) => {
              setCardHeight(event.nativeEvent.layout.height);
            }}
            style={styles.grid}
          >
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

          {/* {!isPortrait && (
            <Pressable
              style={{
                position: "absolute",
                top: headerHeight + cardHeight + 30,
                right: 30,
                zIndex: 40,
              }}
              onPress={scrollTo}
            >
              <View
                style={{
                  fontSize: 30,
                  borderRadius: 30,
                  backgroundColor: "gray",
                }}
              >
                ↓
              </View>
            </Pressable>
          )} */}

          {/* Tabs fijos abajo */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <Tab.Navigator
                screenOptions={{
                  tabBarLabelStyle: { fontSize: 14 },
                  tabBarStyle: { backgroundColor: "#fff", height: 50 },
                  tabBarIndicatorStyle: { backgroundColor: "#6C63FF" },
                }}
              >
                <Tab.Screen name="Eventos">
                  {() => (
                    <AllEvents
                      flatListRef={flatListRef}
                      events={events}
                      navigation={navigation}
                      refreshing={refreshing}
                      handleRefresh={handleRefresh}
                      restHeight={
                        screenHeight -
                        (headerHeight + cardHeight + insets.top + 140)
                      }
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="Estadísticas" component={DashboardScreen} />
              </Tab.Navigator>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AllEvents({
  events,
  navigation,
  handleRefresh,
  refreshing,
  restHeight,
  flatListRef,
}) {
  console.log("RestHeight", restHeight);
  const renderEventCard = ({ item }) => (
    <EventCard
      page="Home"
      key={item.eventid}
      event={item}
      onPress={() => navigation.navigate("EventDetail", { event: item })}
    />
  );
  return (
    <>
      <PaginatedList
        data={events}
        flatListRef={flatListRef}
        renderItem={renderEventCard}
        listHeight={restHeight} // altura de lista dependiendo de la ventana
        emptyMessage="No hay eventos aún"
        handleRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </>
  );
}
