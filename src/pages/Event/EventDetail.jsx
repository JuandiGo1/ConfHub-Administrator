import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import formatDate from "../../utils/dateFormatter";

export default function EventDetailPage({ route }) {
  const { event } = route.params;
  const formattedDate = formatDate(new Date(event.datetime));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.speakerRow}>
        <Image source={{ uri: event.speakeravatar }} style={styles.avatar} />
        <View>
          <Text style={styles.speaker}>{event.speakername}</Text>
          <Text style={styles.category}>{event.category}</Text>
        </View>
      </View>

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.info}><Text style={styles.bold}>Fecha:</Text> {formattedDate}</Text>
        <Text style={styles.info}><Text style={styles.bold}>Lugar:</Text> {event.location_}</Text>
        <Text style={styles.info}><Text style={styles.bold}>Estado:</Text> {event.status}</Text>
        <Text style={styles.info}><Text style={styles.bold}>Asistentes:</Text> {event.attendees}</Text>
        <Text style={styles.info}><Text style={styles.bold}>Cupos disponibles:</Text> {event.availablespots}</Text>
        <Text style={styles.info}><Text style={styles.bold}>Track:</Text> {event.track}</Text>
      </View>

      <View style={styles.tagsRow}>
        {event.tags && event.tags.map((tag, idx) => (
          <Text key={idx} style={styles.tag}>{tag}</Text>
        ))}
      </View>

      <View style={styles.sessionsBlock}>
        <Text style={styles.bold}>Sesiones:</Text>
        {event.sessionorder && event.sessionorder.map((session, idx) => (
          <View key={idx} style={styles.session}>
            <Text style={styles.sessionTitle}>{session.name}</Text>
            <Text style={styles.sessionDesc}>Duración: {session.duration} minutos</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  speakerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  speaker: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: "#6B7280",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  infoBlock: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  info: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "600",
    color: "#111827",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#E5E7EB",
    color: "#374151",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  sessionsBlock: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
    elevation: 1,
  },
  session: {
    marginBottom: 12,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  sessionDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
});

