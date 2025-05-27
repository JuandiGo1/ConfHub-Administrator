import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/styles";
import { updateEvent } from "../services/eventService";

export default function EditEventModal({ event, onClose }) {
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState(event.category);
  const [location, setLocation] = useState(event.location);
  const [attendees, setAttendees] = useState(String(event.attendees));
  const [availableSpots, setAvailableSpots] = useState(String(event.availableSpots));
  const [description, setDescription] = useState(event.description);
  const [speakerName, setSpeakerName] = useState(event.speakerName);
  const [sessionOrder, setSessionOrder] = useState(event.sessionOrder || []);
  const [sessionName, setSessionName] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [tags, setTags] = useState(event.tags ? event.tags.join(", ") : "");
  const [date, setDate] = useState(new Date(event.dateTime));
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [message, setMessage] = useState("");

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
    }
  };

  const handleSave = async () => {
    try {
      const updatedEvent = {
        ...event,
        title,
        category,
        location,
        dateTime: date.toISOString(),
        attendees: Number(attendees),
        availableSpots: Number(availableSpots),
        description,
        speakerName,
        sessionOrder,
        tags: tags.split(",").map((t) => t.trim()),
      };
      await updateEvent(event.eventid, updatedEvent);
      setMessage("Evento actualizado");
      setTimeout(() => onClose(true), 1000);
    } catch (error) {
      setMessage("Error al actualizar el evento");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
      <Text style={{ fontWeight: "bold" }}>Editar Evento</Text>
      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Categoría" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Ubicación" value={location} onChangeText={setLocation} style={styles.input} />
      <TextInput placeholder="Nombre del ponente" value={speakerName} onChangeText={setSpeakerName} style={styles.input} />
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowDate(true)}>
          <Text>{date.toLocaleDateString("es-ES")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowTime(true)}>
          <Text>{date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
      </View>
      {showDate && (
        <DateTimePicker value={date} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleDateChange} />
      )}
      {showTime && (
        <DateTimePicker value={date} mode="time" is24Hour={true} display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleTimeChange} />
      )}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TextInput placeholder="Asistentes" value={attendees} onChangeText={setAttendees} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
        <TextInput placeholder="Cupos disponibles" value={availableSpots} onChangeText={setAvailableSpots} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
      </View>
      <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]} multiline numberOfLines={4} />
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Sesiones</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <TextInput placeholder="Nombre sesión" value={sessionName} onChangeText={setSessionName} style={[styles.input, { flex: 2 }]} />
        <TextInput placeholder="Duración (min)" value={sessionDuration} onChangeText={setSessionDuration} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
        <TouchableOpacity onPress={handleAddSession} style={{ justifyContent: "center", paddingHorizontal: 8 }}>
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Agregar</Text>
        </TouchableOpacity>
      </View>
      {sessionOrder.map((s, idx) => (
        <Text key={idx} style={{ fontSize: 13, color: "#444" }}>
          {s.name} - {s.duration} min
        </Text>
      ))}
      <TextInput placeholder="Tags (separados por coma)" value={tags} onChangeText={setTags} style={styles.input} />
      <Button title="Guardar Cambios" onPress={handleSave} />
      <Button title="Cancelar" color="#888" onPress={() => onClose(false)} />
      {message ? <Text style={{ marginTop: 10, color: "#2563eb" }}>{message}</Text> : null}
    </ScrollView>
  );
}