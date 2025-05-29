import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, Platform, ActivityIndicator, KeyboardAvoidingView, useWindowDimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/styles";
import { updateEvent, getEventsById } from "../services/eventService";

export default function EditEventModal({ event, onClose }) {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

  // Campos editables
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [sessionOrder, setSessionOrder] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  // No editables
  const [date, setDate] = useState(new Date());
  const [availableSpots, setAvailableSpots] = useState("");

  // Fetch evento actualizado al abrir modal
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        console.log("Obteniendo evento con ID:", event.eventid);
        const fetchedArr = await getEventsById(event.eventid);
        const fetched = Array.isArray(fetchedArr) ? fetchedArr[0] : fetchedArr;
        console.log("Evento obtenido del backend:", fetched);

        setEventData(fetched);
        setTitle(fetched.title ?? "");
        setCategory(fetched.category ?? "");
        setLocation(fetched.location_ ?? fetched.location ?? "");
        setAttendees(
          fetched.attendees !== undefined && fetched.attendees !== null
            ? String(fetched.attendees)
            : ""
        );
        setDescription(fetched.description ?? "");
        setSpeakerName(
          fetched.speakerName ?? fetched.speakername ?? ""
        );
        setSessionOrder(
          fetched.sessionOrder ?? fetched.sessionorder ?? []
        );
        setTags(
          fetched.tags
            ? Array.isArray(fetched.tags)
              ? fetched.tags.join(", ")
              : String(fetched.tags)
            : ""
        );
        setDate(
          fetched.datetime
            ? new Date(fetched.datetime)
            : fetched.dateTime
            ? new Date(fetched.dateTime)
            : new Date()
        );
        setAvailableSpots(
          fetched.availableSpots ?? fetched.availablespots ?? ""
        );
        console.log("Campos inicializados en el modal:", {
          title: fetched.title,
          category: fetched.category,
          location: fetched.location_ ?? fetched.location,
          attendees: fetched.attendees,
          description: fetched.description,
          speakerName: fetched.speakerName ?? fetched.speakername,
          sessionOrder: fetched.sessionOrder ?? fetched.sessionorder,
          tags: fetched.tags,
          date: fetched.datetime ?? fetched.dateTime,
          availableSpots: fetched.availableSpots ?? fetched.availablespots,
        });
      } catch (err) {
        setMessage("Error al cargar el evento.");
        console.error("Error al obtener el evento:", err);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [event]);

  const handleAddSession = () => {
    if (sessionName && sessionDuration) {
      setSessionOrder([
        ...sessionOrder,
        { name: sessionName, duration: Number(sessionDuration) },
      ]);
      setSessionName("");
      setSessionDuration("");
      console.log("Sesión agregada:", sessionOrder);
    }
  };

  const handleSave = async () => {
    try {
      // Solo los campos editables se actualizan
      const safeSpeakerName = speakerName || "";
      const nameSeparator = safeSpeakerName.split(" ").join("+");
      const avatarUrl = `https://avatar.iran.liara.run/username?username=${nameSeparator}`;

      const updatedEvent = {
        ...eventData,
        title,
        category,
        location,
        attendees: Number(attendees),
        description,
        speakerName: safeSpeakerName,
        speakerAvatar: avatarUrl,
        sessionOrder,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      };

      console.log("Evento a actualizar (payload enviado al backend):", updatedEvent);

      await updateEvent(event.eventid, updatedEvent);

      setMessage("Evento actualizado");
      setTimeout(() => onClose(true), 1000);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      setMessage("Error al actualizar el evento");
    }
  };

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  if (loading || !eventData) {
    return (
      <View style={{ padding: 30, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  // Log para ver los valores actuales en los campos editables antes de renderizar
  console.log("Valores actuales en campos editables:", {
    title,
    category,
    location,
    speakerName,
    attendees,
    description,
    tags,
    sessionOrder,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={true}
      >
        <Text style={{ fontWeight: "bold" }}>Editar Evento</Text>
        <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Categoría" value={category} onChangeText={setCategory} style={styles.input} />
        <TextInput placeholder="Ubicación" value={location} onChangeText={setLocation} style={styles.input} />
        <TextInput placeholder="Nombre del ponente" value={speakerName} onChangeText={setSpeakerName} style={styles.input} />
        <TextInput placeholder="Asistentes" value={attendees} onChangeText={setAttendees} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]} multiline numberOfLines={4} />
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>Sesiones</Text>
        <View
          style={{
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 8,
            marginBottom: 8,
            alignItems: "stretch",
          }}
        >
          <TextInput
            placeholder="Nombre sesión"
            value={sessionName}
            onChangeText={setSessionName}
            style={[
              styles.input,
              { flex: isSmallScreen ? undefined : 2, minWidth: isSmallScreen ? "100%" : 0 },
            ]}
          />
          <TextInput
            placeholder="Duración (min)"
            value={sessionDuration}
            onChangeText={setSessionDuration}
            keyboardType="numeric"
            style={[
              styles.input,
              { flex: isSmallScreen ? undefined : 1, minWidth: isSmallScreen ? "100%" : 0 },
            ]}
          />
          <TouchableOpacity
            onPress={handleAddSession}
            style={{
              justifyContent: "center",
              paddingHorizontal: 8,
              marginTop: isSmallScreen ? 8 : 0,
              alignSelf: isSmallScreen ? "stretch" : "center",
            }}
          >
            <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Agregar</Text>
          </TouchableOpacity>
        </View>
        {sessionOrder.map((s, idx) => (
          <Text key={idx} style={{ fontSize: 13, color: "#444" }}>
            {s.name} - {s.duration} min
          </Text>
        ))}
        <TextInput placeholder="Tags (separados por coma)" value={tags} onChangeText={setTags} style={styles.input} />

        {/* Campos solo visualización */}
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>Información adicional del evento</Text>
        <Text>Fecha y hora: {date.toLocaleString("es-ES")}</Text>
        <Text>Cupos disponibles: {availableSpots}</Text>
        <Text>Estado: {eventData.status}</Text>
        <Text>Promedio de calificación: {eventData.avgScore}</Text>
        <Text>Número de reseñas: {eventData.numberReviews}</Text>
        <Text>ID: {eventData.eventid}</Text>

        <Button title="Guardar Cambios" onPress={handleSave} />
        <Button title="Cancelar" color="#888" onPress={() => onClose(false)} />
        {message ? <Text style={{ marginTop: 10, color: "#2563eb" }}>{message}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}