import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";
import { getEventsById, searchEvents } from "../services/eventService";
import EventCard from "./EventCard";
import { getData } from "../storage/localStorage";
import styles from "../styles/styles";

export default function MyEvents() {
  const [events, setEvents] = useState(null);
  useEffect(() => {
    const fetchMyEvents = async () => {
      const user = await getData("user");

      if (user.events) {
        setEvents(
          user.events.map(async (eventid) => {
            return await getEventsById(eventid);
          })
        );
      }
    };
  }, []);
  return (
    <View style={styles.container}>
      {events == null ? <Text>Aún no creas eventos</Text> : null}
      <FlatList
        data={events}
        renderItem={({item}) => <EventCard event={item} />}
        keyExtractor={(item) => item.eventid}
      />
    </View>
  );
}
