import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { getTracks } from "../services/trackService";
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
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [date, setDate] = useState(new Date());
  const [availableSpots, setAvailableSpots] = useState("");
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState("None");

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await getTracks();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTracks([]);
      }
    };
    fetchTracks();
  }, []);

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
        setSpeakerName(fetched.speakerName ?? fetched.speakername ?? "");
        setSessionOrder(fetched.sessionOrder ?? fetched.sessionorder ?? []);
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

        setSelectedTrack(
          fetched.track && fetched.track !== "" ? fetched.track : "none"
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

  const handleDateChange = (e, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (e, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

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
        title,
        category,
        location,
        dateTime: date.toISOString(),
        attendees: Number(attendees),
        availableSpots,
        description,
        speakerName: safeSpeakerName,
        speakerAvatar: avatarUrl,
        sessionOrder,
        track: selectedTrack !== "None" ? selectedTrack : null,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      };

      console.log(
        "Evento a actualizar (payload enviado al backend):",
        updatedEvent
      );

      await updateEvent(event.eventid, updatedEvent);

      setMessage("Evento actualizado");
      setTimeout(() => onClose(true), 1000);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      setMessage("Error al actualizar el evento");
    }
  };

  if (loading || !eventData) {
    return (
      <View style={{ padding: 30, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Cargando evento...</Text>
      </View>
    );
  }

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
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Nombre del evento
        </Text>
        <TextInput
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Categoría</Text>
        <TextInput
          placeholder="Categoría"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Ubicación</Text>
        <TextInput
          placeholder="Ubicación"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Nombre del ponente
        </Text>
        <TextInput
          placeholder="Nombre del ponente"
          value={speakerName}
          onChangeText={setSpeakerName}
          style={styles.input}
        />
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Fecha y hora
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center", flex: 1 }]}
            onPress={() => setShowDate(true)}
          >
            <Text>
              {date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center", flex: 1 }]}
            onPress={() => setShowTime(true)}
          >
            <Text>
              {date.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}

        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Track</Text>
        <View style={[styles.input, { padding: 0, marginBottom: 12 }]}>
          <Picker
            selectedValue={selectedTrack}
            onValueChange={(itemValue) => setSelectedTrack(itemValue)}
            style={{ height: 60, width: "100%" }}
          >
            <Picker.Item label="Ninguno" value="none" />
            {tracks.map((track) => (
              <Picker.Item
                key={track.name}
                label={track.name}
                value={track.name}
              />
            ))}
          </Picker>
        </View>

        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Asistentes y cupos disponibles
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <TextInput
            placeholder="Asistentes"
            value={attendees}
            onChangeText={setAttendees}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="Cupos disponibles"
            value={availableSpots}
            onChangeText={setAvailableSpots}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Descripción del evento
        </Text>
        <TextInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]}
          multiline
          numberOfLines={4}
        />
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Nombre del ponente
        </Text>
        <TextInput
          placeholder="Nombre del ponente"
          value={speakerName}
          onChangeText={setSpeakerName}
          style={styles.input}
        />

        <Text style={{ marginTop: 10, fontWeight: "bold" }}>Sesiones</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <TextInput
            placeholder="Nombre sesión"
            value={sessionName}
            onChangeText={setSessionName}
            style={[styles.input, { flex: 2 }]}
          />
          <TextInput
            placeholder="Duración (min)"
            value={sessionDuration}
            onChangeText={setSessionDuration}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity
            onPress={handleAddSession}
            style={{ justifyContent: "center", paddingHorizontal: 8 }}
          >
            <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
              Agregar
            </Text>
          </TouchableOpacity>
        </View>
        {sessionOrder.map((s, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 13, color: "#444", flex: 1 }}>
              {s.name} - {s.duration} min
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSessionOrder(sessionOrder.filter((_, i) => i !== idx));
              }}
              style={{
                marginLeft: 8,
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: "#fee2e2",
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#dc2626", fontWeight: "bold" }}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Tags de interés
        </Text>
        <TextInput
          placeholder="Tags (separados por coma)"
          value={tags}
          onChangeText={setTags}
          style={styles.input}
        />

        {/* Campos solo visualización */}
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Información adicional del evento
        </Text>
        <Text>Fecha y hora: {date.toLocaleString("es-ES")}</Text>
        <Text>Estado: {eventData.status}</Text>
        <Text>Promedio de calificación: {eventData.avgScore}</Text>
        <Text>Número de reseñas: {eventData.numberReviews}</Text>
        <Text>ID: {eventData.eventid}</Text>

        <View
          style={{
            gap: 5,
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button title="Guardar Cambios" onPress={handleSave} />
          <Button
            title="Cancelar"
            color="#888"
            onPress={() => onClose(false)}
          />
        </View>
        {message ? (
          <Text style={{ marginTop: 10, color: "#2563eb" }}>{message}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
