import { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";

import { getEventsById } from "../services/eventService";
import EventCard from "./EventCard";
import { getData } from "../storage/localStorage";
import styles from "../styles/styles";
import { useFocusEffect } from "@react-navigation/native";

export default function MyEvents() {
  const [events, setEvents] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMyEvents();
    }, [])
  );

  const handleDelete = async (event) => {
    await fetchMyEvents();
  };

  const fetchMyEvents = async () => {
    // Obtiene los datos del usuario logueado
    const userstring = await getData("user");
    const user = JSON.parse(userstring);
    // Si el usuario no tiene eventos, no hace nada
    if (user.events.length > 0) {
      const myEvents = await Promise.all(
        // Mapea los IDs de eventos del usuario a sus detalles
        user.events.map((eventid) => {
          return getEventsById(eventid);
        })
      );

      setEvents(myEvents.flat());
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyEvents(); // vuelve a pedir los datos
    setRefreshing(false); // se quita el spinner
  };
  return (
    <View style={styles.container}>
      {events == null ? <Text>Aún no creas eventos</Text> : null}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventCard event={item} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => item.eventid}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}
