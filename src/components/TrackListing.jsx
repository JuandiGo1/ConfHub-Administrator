import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Accordion from "../components/Accordion";
import EventCard from "../components/EventCard";
import { getEventsFromATrack } from "../services/eventService";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../storage/localStorage";

const TrackListing = ({ tracks, onEdit, onDelete, setRefresh }) => {
  const [trackEvents, setTrackEvents] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchEvents = async () => {
    const stringUser = await getData("user");
    console.log("User data:", JSON.parse(stringUser));
    setUser(JSON.parse(stringUser));
    const eventsPromises = tracks.map(async (track) => {
      const events = await getEventsFromATrack(track.name);
      return [track.name, events];
    });

    const eventsResults = await Promise.all(eventsPromises);

    const eventsByTrack = Object.fromEntries(eventsResults);
      setTrackEvents(eventsByTrack);
    };

    fetchEvents();
  }, [tracks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefresh(prev => !prev); // cambia el estado de refresh
    setRefreshing(false); // se quita el spinner
  };
  const renderItem = ({ item }) => {
    const track = item;
    const events = trackEvents[track.name] || [];

    // Calculate total attendees
    const totalAttendees = events.reduce(
      (sum, event) => sum + (event.attendees || 0),
      0
    );

    const extraInfo = (
      <View style={styles2.extraInfo}>
        <Text style={styles2.extraInfoText}>
          {events.length} {events.length === 1 ? "Evento" : "Eventos"}
        </Text>
        <Text style={[styles2.extraInfoText, { marginTop: 2 }]}>
          {totalAttendees} {totalAttendees === 1 ? "Asistente" : "Asistentes"}
        </Text>
      </View>
    );

    return (
      <Accordion
        title={track.name}
        description={track.description}
        extraInfo={extraInfo}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.eventid}
              event={event}
              onPress={() => navigation.navigate("EventDetail", { event })}
            />
          ))
        ) : (
          <Text style={styles2.emptyText}>No hay eventos en este track.</Text>
        )}
      </Accordion>
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backButton, styles.editButton]}
        onPress={() => onEdit(item.name, item.description)}
      >
        <Ionicons name="pencil" size={40} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backButton, styles.deleteButton]}
        onPress={() => onDelete(item.name, item.description)}
      >
        <Ionicons name="trash-bin" size={40} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={tracks}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-170} // espacio para los dos botones
      disableRightSwipe
      disableLeftSwipe={!(user && user.rol == true)} // deshabilita el swipe si no es admin

    />
  );
};
const styles2 = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontStyle: "italic",
  },
  extraInfo: {
    alignItems: "flex-end",
  },
  extraInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: "#FFF",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    padding: 20,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  backButton: {
    width: 80,
    height: "65%",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default TrackListing;
