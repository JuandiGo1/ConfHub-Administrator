import { View, Text, Image, StyleSheet } from "react-native";
import formatDate from "../utils/dateFormatter";

export default function EventCard({ event }) {
  const date = new Date(event.datetime);
  const formattedDate = formatDate(date);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: event.speakeravatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.speaker}>{event.speakername}</Text>
        </View>
      </View>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.info}>{formattedDate}</Text>
        <Text style={styles.info}>{event.location_}</Text>
      </View>
      <View style={styles.tagsRow}>
        {event.tags && event.tags.map((tag, idx) => (
          <Text key={idx} style={styles.tag}>{tag}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  speaker: {
    fontSize: 13,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: "#888",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: "#E0E7FF",
    color: "#3730A3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    marginRight: 4,
    marginBottom: 2,
  },
});