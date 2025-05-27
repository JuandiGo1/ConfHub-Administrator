import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import formatDate from "../utils/dateFormatter";
import { getData, storeData} from "../storage/localStorage";
import { deleteEvent } from "../services/eventService";
import DeleteEventPop from "./DeleteEventPop";

export default function EventCard({ event, onPress, onDelete }) {
  const date = new Date(event.datetime);
  const formattedDate = formatDate(date);
  const [canEdit, setCanEdit] = useState(false);
  const [showDeletePop, setShowDeletePop] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const userString = await getData("user");
      const user = JSON.parse(userString);
      const email = await getData("email");
      const isAdmin = user.rol === true;
      console.log("ES ADMIN?", isAdmin)
      setCanEdit(event.user_info === email || isAdmin);
    };
    checkPermission();
  }, [event.user_info]);

  const handleDelete = async () => {
    try {
      await deleteEvent(event.eventid);
      // Quitar el eventid del array de eventos del usuario en localStorage
      const userString = await getData("user");
      const user = JSON.parse(userString);
      console.log("Evento borrado:", event.eventid);
      user.events = user.events.filter((id) => id !== event.eventid);
      await storeData("user", JSON.stringify(user));
      console.log("Evento eliminado del usuario:", user.events);
      console.log("Evento borrado correctamente");
    } catch (error) {
      console.error("Error al borrar el evento:", error);
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: event.speakeravatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.speaker}>{event.speakername}</Text>
        </View>
        {canEdit && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => console.log("Edit event")}
              style={styles.actionBtn}
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeletePop(true)}
              style={styles.actionBtn}
            >
              <Text style={[styles.actionText, { color: "#dc2626" }]}>
                Borrar
              </Text>
            </TouchableOpacity>
            <DeleteEventPop
              visible={showDeletePop}
              onConfirm={async () => {
                setShowDeletePop(false);
                await handleDelete();
                if (onDelete) onDelete(event);
              }}
              onCancel={() => setShowDeletePop(false)}
            />
          </View>
        )}
      </View>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.info}>{formattedDate}</Text>
        <Text style={styles.info}>{event.location_}</Text>
      </View>
      <View style={styles.tagsRow}>
        {event.tags &&
          event.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
      </View>
    </Pressable>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 4,
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 13,
  },
});
