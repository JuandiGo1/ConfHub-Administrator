import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { getTracks } from "../../services/trackService";
import { getEvents } from "../../services/eventService";
import Accordion from "../../components/Accordion";
import EventCard from "../../components/EventCard";

export default function TrackListingPage() {
  const navigation = useNavigation();
  const [tracks, setTracks] = useState([]);
  const [eventsByTrack, setEventsByTrack] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksData, allEvents] = await Promise.all([
          getTracks(),
          getEvents(),
        ]);

        const eventMap = {};
        allEvents.forEach((event) => {
          eventMap[event.eventid] = event;
        });

        const groupedEvents = {};
        for (const track of tracksData) {
          const resolvedEvents = track.events
            .map((eventId) => eventMap[eventId])
            .filter(Boolean);
          groupedEvents[track.name] = resolvedEvents;
        }

        setTracks(tracksData);
        setEventsByTrack(groupedEvents);
      } catch (err) {
        console.error("Error loading tracks or events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {tracks.map((track, idx) => {
        const events = eventsByTrack[track.name] || [];

        // Calculate total attendees
        const totalAttendees = events.reduce(
          (sum, event) => sum + (event.attendees || 0),
          0
        );

        const extraInfo = (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>
              {events.length} {events.length === 1 ? "Evento" : "Eventos"}
            </Text>
            <Text style={[styles.extraInfoText, { marginTop: 2 }]}>
              {totalAttendees} {totalAttendees === 1 ? "Asistente" : "Asistentes"}
            </Text>
          </View>
        );

        return (
          <Accordion
            key={idx}
            title={track.name}
            description={track.description}
            extraInfo={extraInfo}
          >
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event.eventid}
                  event={event}
                  onPress={() =>
                    navigation.navigate("EventDetail", { event })
                  }
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No hay eventos en este track.</Text>
            )}
          </Accordion>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
